import React, { useState, useEffect } from "react";
import { SafeAreaView, View, ScrollView, Text, Image, TouchableOpacity, Alert, Linking, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

export default (props) => {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [camera, setCamera] = useState(null);
    const [showCamera, setShowCamera] = useState(true); // Add this state

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
            "Please grant camera access to use this feature.",
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

    const toggleView = () => {
        setShowCamera(!showCamera);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                <View style={{ alignItems: "flex-start", backgroundColor: "#F9F4EF", paddingTop: 37 }}>
                    <Text style={{ color: "#1C160C", fontSize: 18, marginBottom: 42, marginLeft: 17 }}>
                        {"Improve your balance "}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 11, marginLeft: 17, marginRight: 30 }}>
                        <Text style={{ color: "#21160A", fontSize: 16, marginRight: 4, flex: 1 }}>
                            {"Stand up and breathe"}
                        </Text>
                        <Text style={{ color: "#21160A", fontSize: 16 }}>
                            {"Counter: 7/10"}
                        </Text>
                    </View>
                    
                    {/* Camera/GIF View Container */}
                    <View style={{ height: 463, width: '100%', marginBottom: 9 }}>
                        {permission?.granted ? (
                            showCamera ? (
                                <CameraView
                                    ref={ref => setCamera(ref)}
                                    style={{ flex: 1 }}
                                    facing={facing}
                                />
                            ) : (
                                <Image
                                    source={{ uri: "https://cdn.dribbble.com/users/1049995/screenshots/4467316/fingertaps_3.gif" }}
                                    style={{ flex: 1, width: '100%', height: '100%' }}
                                    resizeMode="contain"
                                />
                            )
                        ) : (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>No access to camera</Text>
                                <TouchableOpacity 
                                    onPress={requestPermission}
                                    style={{ marginTop: 20, padding: 10, backgroundColor: '#F99E16', borderRadius: 5 }}
                                >
                                    <Text style={{ color: '#21160A' }}>Request Permission</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={{ 
                        alignItems: "center", 
                        marginBottom: 0,
                        width: '100%' 
                    }}>
                        <View style={{ 
                            flexDirection: "row", 
                            alignItems: "center",
                            justifyContent: "center",
                            width: '100%'
                        }}>
                            <View style={{ 
                                width: 48,
                                height: 48,
                                backgroundColor: "#F9F4EF", 
                                borderRadius: 24,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginHorizontal: 12,
                                shadowColor: "#0000001A", 
                                shadowOpacity: 0.1, 
                                shadowOffset: { width: 0, height: 2 }, 
                                shadowRadius: 4, 
                                elevation: 4 
                            }}>
                                <TouchableOpacity><Ionicons name="images-outline" size={24} color="black" /></TouchableOpacity>
                            </View>
                            <View style={{ 
                                width: 64,
                                height: 64,
                                backgroundColor: "#F9F4EF", 
                                borderRadius: 32,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginHorizontal: 12,
                                shadowColor: "#0000001A", 
                                shadowOpacity: 0.1, 
                                shadowOffset: { width: 0, height: 2 }, 
                                shadowRadius: 4, 
                                elevation: 4 
                            }}>
                                <TouchableOpacity onPress={toggleView}>
                                    <Ionicons 
                                        name={showCamera ? "camera-outline" : "videocam-outline"} 
                                        size={32} 
                                        color="black" 
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ 
                                width: 48,
                                height: 48,
                                backgroundColor: "#F9F4EF", 
                                borderRadius: 24,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginHorizontal: 12,
                                shadowColor: "#0000001A", 
                                shadowOpacity: 0.1, 
                                shadowOffset: { width: 0, height: 2 }, 
                                shadowRadius: 4, 
                                elevation: 4 
                            }}>
                                <TouchableOpacity><Ionicons name="refresh-outline" size={24} color="black" /></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '100%', paddingHorizontal: 16 }}>
                        <TouchableOpacity 
                            style={{ 
                                backgroundColor: "#F99E16", 
                                borderRadius: 8, 
                                paddingVertical: 18,
                                alignItems: 'center',
                                marginBottom: 25,
                                width: '100%'
                            }} 
                            onPress={() => alert('Pressed!')}
                        >
                            <Text style={{ color: "#21160A", fontSize: 16 }}>
                                {"Exercise Demo"}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ 
                            flexDirection: "row", 
                            justifyContent: "space-between", 
                            alignItems: "center", 
                            marginBottom: 2,
                            width: '100%'
                        }}>
                            <TouchableOpacity 
                                style={{ 
                                    flex: 1,
                                    alignItems: "center", 
                                    backgroundColor: "#F4EADB", 
                                    borderRadius: 8, 
                                    paddingVertical: 18,
                                    marginRight: 8
                                }} 
                                onPress={() => alert('Pressed!')}
                            >
                                <Text style={{ color: "#21160A", fontSize: 16 }}>
                                    {"Alternate"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{ 
                                    flex: 1,
                                    alignItems: "center", 
                                    backgroundColor: "#F4EADB", 
                                    borderRadius: 8, 
                                    paddingVertical: 18,
                                    marginLeft: 8
                                }} 
                                onPress={() => alert('Pressed!')}
                            >
                                <Text style={{ color: "#21160A", fontSize: 16 }}>
                                    {"Next"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: 20, backgroundColor: "#F9F4EF" }}>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}