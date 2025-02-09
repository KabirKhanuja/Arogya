import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Alert, Linking, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {Api} from "../utils/ApiConstants";

const DELAY = 100;

export default function CameraScreen() {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const navigation = useNavigation();
    const exerciseName = "finger_splaying"; // Change this as needed

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

    useEffect(() => {
        let interval;
        if (permission?.granted) {
            console.log("Starting camera capture");
            
            interval = setInterval(async () => {
                if (cameraRef.current) {
                    try {
                        const photo = await cameraRef.current.takePictureAsync({ base64: true });
                        sendImage(photo.base64);
                    } catch (error) {
                        console.error("Error capturing image:", error);
                    }
                }
            }, DELAY);
        }
        return () => clearInterval(interval);
    }, [permission]);

    const sendImage = async (base64Image) => {
        try {
            const response = await fetch(Api.RECORD_EXERCISE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    image: base64Image,
                    exercise: exerciseName
                })
            });
            const responseJson = await response.json();
            if (!response.ok) {
                console.error("Failed to send image");
            }
            console.log("Image sent successfully", responseJson);
            
        } catch (error) {
            console.error("Error sending image:", error);
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
                ref={cameraRef}
                style={{ flex: 1 }} 
                facing={facing}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                }}>
                    <TouchableOpacity
                        style={{
                            flex: 0.1,
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                            marginBottom: 20,
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </SafeAreaView>
    );
}
