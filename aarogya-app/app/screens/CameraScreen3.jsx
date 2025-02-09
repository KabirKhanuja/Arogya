import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Alert, Linking, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import FingerSplayTracker from "../exercises/finger_splaying";

export default function CameraScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const navigation = useNavigation();
  const fingerSplayRef = useRef(new FingerSplayTracker());
  const [tracking, setTracking] = useState({
    currentHand: '',
    currentRepsCount: 0,
    targetRepsCount: 15,
    nextHand: null,
    completed: false
  });

  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    } else if (!permission?.granted && !permission?.canAskAgain) {
      showPermissionAlert();
    }
  }, [permission]);

  const showPermissionAlert = () => {
    Alert.alert(
      "Camera Permission Required",
      "Please grant camera access to use this feature. You can enable it in your device settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openSettings }
      ]
    );
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const handleFrame = async (frame) => {
    try {
      const result = await fingerSplayRef.current.processFrame(frame);
      setTracking(result);

      if (result.completed) {
        Alert.alert(
          "Exercise Complete!",
          "Great job! You've completed all the exercises.",
          [
            { text: "Done", onPress: () => navigation.goBack() }
          ]
        );
      } else if (result.nextHand) {
        Alert.alert(
          "Switch Hands",
          `Great! Now switch to your ${result.nextHand} hand`,
          [{ text: "OK", style: "default" }]
        );
      }
    } catch (error) {
      console.error("Error processing frame:", error);
    }
  };

  if (!permission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Checking camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No access to camera</Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}
        >
          <Text style={{ color: 'white' }}>Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CameraView
        ref={ref => setCamera(ref)}
        style={{ flex: 1 }}
        facing={facing}
        onFrameReady={handleFrame}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}>
          {/* Header with back button and camera flip */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
          }}>
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 20,
              }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 20,
              }}
              onPress={() => setFacing(prev => prev === 'front' ? 'back' : 'front')}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Exercise tracking overlay */}
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
            }}>
              <Text style={{ color: 'white', fontSize: 24, marginBottom: 10 }}>
                {tracking.currentHand.toUpperCase()} HAND
              </Text>
              <Text style={{ color: 'white', fontSize: 20 }}>
                {tracking.currentRepsCount} / {tracking.targetRepsCount} reps
              </Text>
            </View>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}