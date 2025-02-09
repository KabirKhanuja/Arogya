import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Accelerometer, Pedometer } from 'expo-sensors';

const CALORIES_PER_STEP = 0.05;

export default function StepCount() {
  const [steps, setSteps] = useState(0);
  const [iscounting, setIscounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  const animationRefRunning = useRef(null);
  const animationRefSitting = useRef(null);

  useEffect(() => {
    let subscription;
    Accelerometer.isAvailableAsync().then((result) => {  
      if (result) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const threshold = 0.1;
          const timestamp = new Date().getTime();

          if (
            Math.abs(y - lastY) > threshold &&
            !iscounting &&
            (timestamp - lastTime) > 800
          ) {
            setIscounting(true);
            setLastTime(timestamp);
            setLastY(y);

            setSteps((prevSteps) => prevSteps + 1); 

            setTimeout(() => {
              setIscounting(false);
            }, 1200);
          }
        });
      } else {
        console.log('Accelerometer is not available on this device');
      }
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [iscounting, lastY, lastTime]);

  const resetSteps = () => {
    setSteps(0);
  }

  const estimatedCaloriesBurned = steps*CALORIES_PER_STEP;


  return (
    <View style={styles.container}>
          <Text style={styles.stepsText}>{steps}</Text>
      {/* <Text style={styles.title}>Step Tracker</Text>
      <View style={styles.infoContainer}>
        <View style={styles.stepsContainer}> */}
          {/* <Text style={styles.stepsText}>{steps}</Text> */}
          {/* <Text style={styles.stepsLabel}>Steps</Text> */}
        {/* </View> */}
        {/* <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesLabel}>
            Estimated Calories Burned;
            </Text>
          <Text style={styles.caloriesText}>
            {estimatedCaloriesBurned.toFixed(2)} calories
            </Text>
        </View> */}
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20
  },
  stepsText: {
    fontSize: 36,
    color: '#3498db',
    fontweight: 'bold',
    marginRight: 8
  },
  stepsLabel: {
    fontSize: 24,
    color: '#555'
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  caloriesLabel: {
    fontSize: 20,
    color: '#555',
    marginRight: 6
  },
  caloriesText: {
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: 'bold'
  }
});
