import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Alert, Linking, Platform } from "react-native";
import { CameraView, Camera, useCameraPermissions, CameraType } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview"; // Import WebView
import { Api } from "../utils/ApiConstants";
import * as SecureStorage from "expo-secure-store";
import ExerciseUtils from "../utils/ExerciseUtils";
import { useRoute } from "@react-navigation/native";
import { CountdownScreenProps } from "./Countdown";
import { useNavigation } from "expo-router";
import { MainStackNavigationProps } from "../routes/MainStack";

export type ExerciseScreenProps = {
    exerciseName: string;
}

const DELAY = 1000;

const TabButtons = ({ tabs, activeTab, setActiveTab }: { tabs: string[], activeTab: string, setActiveTab: (tab: string) => void }) => {
    return (
        <View style={{ flexDirection: "row", justifyContent: "center", margin: 10 }}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        marginHorizontal: 5,
                        borderRadius: 8,
                        backgroundColor: activeTab === tab ? "#007AFF" : "#E0E0E0",
                    }}
                >
                    <Text style={{ color: activeTab === tab ? "#FFF" : "#000", fontWeight: "bold" }}>
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const ExerciseDemoVideo = ({ url }: { url: string | null } = { url: null }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', }}>
            <Text style={{ textAlign: 'center', marginBottom: 10, fontWeight: 'bold' }}>Exercise Demo</Text>
            <View style={{ flex: 1, maxHeight: 320, margin: 15, borderRadius: 16, overflow: 'hidden', borderColor: '#F99E16', borderWidth: 2 }}>
                <WebView
                    style={{
                        height: 20,
                        overflow: 'hidden' // Ensures the border radius is applied correctly
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{ uri: url ? url : 'https://www.youtube.com/embed/5-g_fi3VhIs?si=8gKtdLuV1sBqDvib' }}
                />
            </View>
        </View>
    )
};

export default function Exercising5() {
    const [facing, setFacing] = useState<CameraType>('front');
    const [permission, requestPermission] = useCameraPermissions();
    const camera = useRef(null);
    const [showCamera, setShowCamera] = useState(true);
    const route = useRoute();
    const navigation = useNavigation<MainStackNavigationProps>();
    const extraExerciseName = (route.params as CountdownScreenProps)?.exerciseName || "Exercise";
    const exerciseName = "finger_splaying";
    const exerciseRef = useRef(new ExerciseUtils(exerciseName));
    const [count, setCount] = React.useState(0);
    const [exerciseMessage, setExerciseMessage] = React.useState("Please follow the instructions");
    const [isCompleted, setIsCompleted] = React.useState(false);
    const TOTAL_COUNT = 15;
    const [activeTab, setActiveTab] = useState("Exercise");

    useEffect(() => {
        (async () => {
            exerciseRef.current.save();
            // const rcount = await SecureStorage.getItemAsync("ex-count") || "0";
            // await SecureStorage.setItemAsync("ex-count", (parseInt(rcount) + 1).toString());
        })();
    }, []);

    const sendImage = async (base64Image: string) => {
        try {
            const response = await Api.post(Api.RECORD_EXERCISE_URL, {
                image: base64Image,
                exercise: exerciseName,
                state: exerciseRef.current.getExerciseData()
            });
            if (response.responseJson.result) {
                const exerciseData = response.responseJson.result;
                exerciseRef.current.saveExerciseDataFromResponse(exerciseData);
                if (exerciseData.rep_count) {
                    setCount(exerciseData.rep_count);
                }
                if (exerciseData.completed && exerciseData.completed === true) {
                    setIsCompleted(true);
                    setExerciseMessage("Well done! You have completed the exercise.");
                    return;
                }
                setExerciseMessage((prev) => exerciseRef.current.getMessage() || prev);
                console.log(exerciseRef.current.getMessage());
            }
        } catch (error) {
            console.log("Error sending image:", error);
        }
    };

    useEffect(() => {
        let interval;
        interval = setInterval(async () => {
            if (camera.current && !isCompleted && showCamera) {
                try {
                    const photo = await (camera.current as CameraView).takePictureAsync({ base64: true, shutterSound: false });
                    if (photo && photo.base64) {
                        sendImage(photo.base64);
                    }
                } catch (error) {
                    console.error("Error capturing image:", error);
                }
            }
        }, DELAY);
        return () => clearInterval(interval);
    }, [permission]);


    useEffect(() => {
        if (permission?.granted == true) return;
        if (!permission?.granted && permission?.canAskAgain) {
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
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{
                    zIndex: 10,
                    width: '100%',
                    position: "absolute",
                    opacity: 0.9,
                    paddingVertical: 10,
                }}>
                    <Text style={{
                        fontSize: 18,
                        paddingVertical: 15,
                        flex: 1,
                        textAlign: "center",
                        fontWeight: "400"
                    }}>
                        {extraExerciseName}
                    </Text>
                    {
                        !isCompleted && (
                            <View style={{
                                alignItems: "center",
                                backgroundColor: "orange",
                                padding: 12,
                            }}>
                                <Text style={{
                                    color: "#21160A",
                                    fontSize: 14,
                                    flex: 1,
                                    marginBottom: 8,
                                    fontWeight: "500"
                                }}>
                                    {exerciseMessage}
                                </Text>
                                <Text style={{
                                    color: "#007AFF",
                                    fontSize: 14,
                                    fontWeight: "600"
                                }}>
                                    {`Counter: ${count}/${TOTAL_COUNT}`}
                                </Text>
                            </View>
                        )
                    }

                    {
                        !isCompleted && (
                            <View style={{
                                alignItems: "center",
                                justifyContent: "center",
                                width: '100%',
                                marginVertical: 5
                            }}>
                                <TabButtons tabs={["Exercise", "View Demo"]} activeTab={activeTab} setActiveTab={(tab) => {
                                    setActiveTab(tab);
                                    setShowCamera(tab === "Exercise");
                                }} />
                            </View>
                        )
                    }

                </View>

                {
                    isCompleted ? (

                        <View style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Ionicons name="checkmark-circle" size={128} color="green" style={{ marginBottom: 18 }} />
                            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Exercise Completed!</Text>
                            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>You earned two new badges!</Text>
                        </View>
                    ) : (
                        <View style={{ flex: 1, width: '100%' }}>
                            {permission?.granted ? (
                                showCamera ? (
                                    <CameraView
                                        ref={camera}
                                        style={{ flex: 1 }}
                                        facing={facing}
                                    />
                                ) : (
                                    <ExerciseDemoVideo url={null} />
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
                    )
                }

                <View
                    style={{
                        zIndex: 10,
                        width: '100%',
                        bottom: 0,
                        position: "absolute",
                        paddingVertical: 10,
                    }}
                >
                    {
                        !isCompleted && (
                            <View style={{
                                alignItems: "center",
                                width: '100%',
                                marginBottom: 25,
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
                        )
                    }

                    <View style={{ width: '100%', paddingHorizontal: 16 }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 2,
                            width: '100%'
                        }}>
                            {
                                !isCompleted && (
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            alignItems: "center",
                                            backgroundColor: "#F4EADB",
                                            borderRadius: 8,
                                            paddingVertical: 18,
                                            marginRight: 8
                                        }}
                                        onPress={() => {
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: "BadgesUnlocked" }],
                                            })
                                        }}
                                    >
                                        <Text style={{ color: "#21160A", fontSize: 16 }}>
                                            {"Alternate"}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }

                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    backgroundColor: isCompleted ? "green" : "#F4EADB",
                                    borderRadius: 8,
                                    paddingVertical: 18,
                                    marginLeft: 8
                                }}
                                onPress={() => {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: "MainTabs" }],
                                    });
                                }}
                            >
                                <Text style={{ color: isCompleted ? "white" : "#21160A", fontSize: 16 }}>
                                    {"Next"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </View>
        </SafeAreaView >
    )
}