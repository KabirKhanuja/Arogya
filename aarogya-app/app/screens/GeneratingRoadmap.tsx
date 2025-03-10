import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import RoadmapUtils from "../utils/RoadmapUtils";
import AppContext from "../auth/AuthContext";
import { MainStackNavigationProps } from "../routes/MainStack";

const messages = [
    "Generating a Roadmap for you...",
    "Thinking, what fits best...",
    "Analyzing your needs...",
    "Crafting your plan..."
];

const colors = ["#F99E16", "#16A085", "#3498DB", "#E74C3C"];

export type RoadmpaGenerationExtraProps = {
    force: boolean;
}

export default function GeneratingRoadmapScreen() {
    const navigation = useNavigation<MainStackNavigationProps>();
    const { user } = useContext(AppContext);
    const [index, setIndex] = useState(0);
    const fadeAnim = new Animated.Value(1);
    const [roadmapGenerated, setRoadmapGenerated] = React.useState(false);
    const roadmapGeneratorRef = React.useRef(new RoadmapUtils(user!!.id!!));
    const retryCount = React.useRef(0);
    const forceGenerate = (useRoute().params as RoadmpaGenerationExtraProps)?.force || false;

    useEffect(() => {
        const retry = () => {
            if (!roadmapGenerated) {
                roadmapGeneratorRef.current.generateRoadmap({
                    force: forceGenerate
                })
                    .then(() => {
                        setRoadmapGenerated(true);
                        navigation.navigate("MainTabs");
                    })
                    .catch((error) => {
                        console.error("Error generating roadmap: ", error);
                        if (retryCount.current < 3) {
                            retryCount.current += 1;
                            retry();
                        } else {
                            console.error("Failed to generate roadmap after 3 retries.");
                            navigation.navigate("MainTabs");
                            // TODO: Show error message to user and maybe navigate to an error screen
                        }
                    });
            }
        }
        retry();
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
            }).start(() => {
                setIndex((prev) => (prev + 1) % messages.length); // Change text
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }).start();
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <LottieView
                    source={require("../../assets/loading_animation.json")} // Place your Lottie JSON file in assets folder
                    autoPlay
                    loop
                    style={{
                        width: 100,
                        height: 100,
                    }}
                />
                <Animated.Text
                    style={{
                        color: colors[index],
                        fontSize: 21,
                        fontWeight: "600",
                        textAlign: "center",
                        opacity: fadeAnim, // Apply fade animation
                    }}>
                    {messages[index]}
                </Animated.Text>
            </View>
        </SafeAreaView>
    );
}