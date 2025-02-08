import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { Pedometer } from 'react-native-sensors';

const StepTracker = () => {
  const [stepCount, setStepCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (isTracking) {
      const subscription = Pedometer.watchStepCount((result) => {
        setStepCount(result.steps); // Update step count
      });

      return () => {
        subscription.remove(); // Clean up on component unmount
      };
    }
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  return (
    <View>
      <Text style={{ fontSize: 20 }}>Steps Count: {stepCount}</Text>
      <Button title="Start Tracking" onPress={startTracking} />
      <Button title="Stop Tracking" onPress={stopTracking} />
    </View>
  );
};

export default StepTracker;
