import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Alert, Linking, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera"; // Removed CameraType
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function CameraScreen() {
    const [facing, setFacing] = useState('back'); // Use string literal instead of CameraType
    const [permission, requestPermission] = useCameraPermissions();
    const [camera, setCamera] = useState(null);
    const navigation = useNavigation();

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