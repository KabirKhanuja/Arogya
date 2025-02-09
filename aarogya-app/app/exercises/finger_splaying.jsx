import { Image } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

export default class FingerSplayTracker {
  constructor() {
    this.splayCount = { right: 0, left: 0 };
    this.prevSpread = { right: null, left: null };
    this.splayComplete = { right: false, left: false };
    this.repsCount = 15;
    this.exerciseOrder = ["right", "left"];
    this.currentExercise = 0;
    this.model = null;
    this.isModelLoaded = false;
    this.initialize();
  }

  async initialize() {
    try {
      // Load the handpose model
      await tf.ready();
      this.model = await handpose.load();
      this.isModelLoaded = true;
      return true;
    } catch (error) {
      console.error("Error initializing FingerSplayTracker:", error);
      return false;
    }
  }

  async processFrame(imageData) {
    if (!this.isModelLoaded) {
      throw new Error("Model not initialized. Call initialize() first.");
    }

    try {
      // Convert image data to tensor
      const imageTensor = await tf.browser.fromPixels(imageData);
      
      // Get hand predictions
      const predictions = await this.model.estimateHands(imageTensor);
      
      const currentHand = this.exerciseOrder[this.currentExercise];
      
      let result = {
        currentHand: currentHand,
        currentRepsCount: this.splayCount[currentHand],
        targetRepsCount: this.repsCount,
        nextHand: null,
        completed: false
      };

      if (predictions.length > 0) {
        // Filter for the current hand we're tracking
        const handedness = predictions[0].handedness.toLowerCase();
        
        if (handedness === currentHand) {
          // Get index and pinky landmarks
          const indexTip = predictions[0].landmarks[8]; // Index finger tip
          const pinkyTip = predictions[0].landmarks[20]; // Pinky tip
          
          // Calculate spread distance
          const spreadDistance = Math.abs(pinkyTip[0] - indexTip[0]);
          
          if (this.prevSpread[handedness] !== null) {
            const spreadDiff = spreadDistance - this.prevSpread[handedness];
            
            if (spreadDiff > 15) {
              this.splayComplete[handedness] = true;
            }
            
            if (this.splayComplete[handedness] && spreadDiff < -15) {
              this.splayCount[handedness]++;
              this.splayComplete[handedness] = false;
            }
          }
          
          this.prevSpread[handedness] = spreadDistance;
          
          // Check if current exercise is complete
          if (this.splayCount[currentHand] >= this.repsCount) {
            this.currentExercise++;
            
            if (this.currentExercise < this.exerciseOrder.length) {
              result.nextHand = this.exerciseOrder[this.currentExercise];
            } else {
              result.completed = true;
            }
          }
          
          result.currentRepsCount = this.splayCount[currentHand];
        }
      }

      // Cleanup
      tf.dispose(imageTensor);
      
      return result;
    } catch (error) {
      console.error("Error processing frame:", error);
      throw error;
    }
  }

  reset() {
    this.splayCount = { right: 0, left: 0 };
    this.prevSpread = { right: null, left: null };
    this.splayComplete = { right: false, left: false };
    this.currentExercise = 0;
  }

  setRepsCount(count) {
    this.repsCount = count;
  }

  setExerciseOrder(order) {
    if (!Array.isArray(order) || !order.every(hand => ['right', 'left'].includes(hand))) {
      throw new Error("Exercise order must be an array containing 'right' and/or 'left'");
    }
    this.exerciseOrder = order;
    this.currentExercise = 0;
  }
}