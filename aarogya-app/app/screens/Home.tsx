import React, { useContext, useState } from "react";
import { SafeAreaView, View, ScrollView, Text, Image, TouchableOpacity, } from "react-native";
import AppContext from "../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";
import RoadmapUtils from "../utils/RoadmapUtils";
import ExerciseRoadmap from "../components/ExerciseRoadmap";
import { ScoreContext } from "../context/ScoreContext";
import { Accelerometer, Pedometer } from 'expo-sensors';
import * as SecureStorage from "expo-secure-store";
import { Roadmap } from "../types/Roadmap";
import { MainStackNavigationProps } from "../routes/MainStack";
import QuoteCarousel from "../components/QuotesCarousel";
import Localdb from "../utils/Localdb";

const CALORIES_PER_STEP = 0.05;

const LoadingIndicator = ({ text = "Loading" }) => {
    const typingIndicator = [`${text}`, `${text}.`, `${text}..`, `${text}...`];
    const [indicator, setIndicator] = React.useState(0);
    setTimeout(() => {
        setIndicator((indicator + 1) % 4);
    }, 300);
    return (
        <Text>{typingIndicator[indicator]}</Text>
    );
};

export default function HomeScreen() {
    const { user } = useContext(AppContext);
    const [roadmapGenerated, setRoadmapGenerated] = React.useState(false);
    const [roadmap, setRoadmap] = React.useState<Roadmap | Object>({});
    const navigation = useNavigation<MainStackNavigationProps>();
    const roadmapGeneratorRef = React.useRef(new RoadmapUtils(user!!.id!!));
    const { setTotalScore } = useContext(ScoreContext);
    const currentScore = 0;
    const [steps, setSteps] = useState(0);
    const [exercisesCount, setExercisesCount] = useState(0);
    const [iscounting, setIscounting] = useState(false);
    const [lastY, setLastY] = useState(0);
    const [lastTime, setLastTime] = useState(0);

    React.useEffect(() => {
        (async () => {
            const rcount = await SecureStorage.getItemAsync("ex-count") || "0";
            setExercisesCount(parseInt(rcount));
        })();
    }, []);

    React.useEffect(() => {
        setTimeout(() => {
            setExercisesCount(Localdb.getExerciseHistory().length);
        }, 1000);
    }, [exercisesCount]);


    React.useEffect(() => {
        let subscription: any;
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

    const estimatedCaloriesBurned = () => (steps * CALORIES_PER_STEP)

    React.useEffect(() => {
        if (!roadmapGenerated) {
            roadmapGeneratorRef.current.generateRoadmap()
                .then((response) => {
                    if (response) {
                        setRoadmap(response);
                    }
                    setRoadmapGenerated(true);
                });
        }
    }, []);

    React.useEffect(() => {
        setTotalScore(currentScore);
    }, [currentScore]);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
            }}>
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: "#FCFAF7",
                }}>
                <View
                    style={{
                        alignItems: "flex-start",
                        backgroundColor: "#FCFAF7",
                        width: "100%",
                    }}>
                    <View
                        style={{
                            alignItems: "center",
                            backgroundColor: "#FCFAF7",
                            paddingTop: 21,
                            paddingStart: 16,
                            paddingBottom: 8,
                            marginBottom: 16,
                        }}>
                    </View>
                    <View
                        style={{
                            alignItems: "center",
                            width: "100%",
                        }}>
                        <Image
                            source={{ uri: "https://picsum.photos/200" }}
                            resizeMode={"stretch"}
                            style={{
                                borderRadius: 64,
                                width: 128,
                                height: 128,
                                marginBottom: 21,
                            }}
                        />
                        <Text
                            style={{
                                color: "#161411",
                                fontSize: 22,
                                marginBottom: 7,
                            }}>
                            {`Good morning, ${user?.name}!`}
                        </Text>
                        <Text
                            style={{
                                color: "#8C7A5E",
                                fontSize: 16,
                                marginBottom: 34,
                            }}>
                            {"Ready for today's exercises?"}
                        </Text>
                    </View>
                    <View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 16,
                                marginHorizontal: 16,
                                gap: 16,
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "#F4F2EF",
                                    borderRadius: 12,
                                    paddingVertical: 30,
                                    paddingHorizontal: 25,
                                    alignItems: "center",
                                    minWidth: 195,
                                }}>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 16,
                                        marginBottom: 16,
                                        textAlign: "center",
                                    }}>
                                    {"Steps Today"}
                                </Text>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 24,
                                    }}>
                                    <Text>{steps}</Text>
                                </Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "#F4F2EF",
                                    borderRadius: 12,
                                    paddingVertical: 30,
                                    paddingHorizontal: 25,
                                    alignItems: "center",
                                    minWidth: 165,
                                }}>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 16,
                                        marginBottom: 16,
                                        textAlign: "center",
                                    }}>
                                    {"Exercises Done"}
                                </Text>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 24,
                                    }}>
                                    {exercisesCount}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 16,
                                marginHorizontal: 16,
                                gap: 16,
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "#F4F2EF",
                                    borderRadius: 12,
                                    paddingVertical: 30,
                                    paddingHorizontal: 25,
                                    alignItems: "center",
                                    minWidth: 195,
                                }}>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 16,
                                        marginBottom: 16,
                                        textAlign: "center",
                                    }}>
                                    {"Total Score"}
                                </Text>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 24,
                                    }}>
                                    {currentScore}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "#F4F2EF",
                                    borderRadius: 12,
                                    paddingVertical: 30,
                                    paddingHorizontal: 25,
                                    alignItems: "center",
                                    minWidth: 165,
                                }}>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 16,
                                        marginBottom: 16,
                                        textAlign: "center",
                                    }}>
                                    {"Calories Burned"}
                                </Text>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 24,
                                    }}>
                                    <Text>
                                        {estimatedCaloriesBurned().toFixed(2)} calories
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Text
                        style={{
                            color: "#161411",
                            fontSize: 18,
                            marginTop: 16,
                            marginBottom: 26,
                            width: "100%",
                            fontWeight: "bold",
                            textAlign: "center"
                        }}>
                        {"Today's roadmap"}
                    </Text>
                    {
                        !roadmapGenerated ? (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginStart: 40,
                                    paddingBottom: 50
                                }}
                            >
                                <LoadingIndicator text="Generating" />
                            </View>
                        ) : (
                            <>
                                <ExerciseRoadmap data={roadmap} />
                            </>
                        )
                    }
                    <TouchableOpacity
                        style={{
                            alignItems: "center",
                            backgroundColor: "#F99E16",
                            borderRadius: 12,
                            padding: 18,
                            alignSelf: "stretch",
                            marginBottom: 12,
                            marginHorizontal: 16,
                        }} onPress={() => {
                            const firstExerciseName = (roadmap as Roadmap).phases?.[0]?.weekly_schedule?.[0]?.sessions?.[0]?.exercises?.[0]?.name;
                            if (firstExerciseName) {
                                navigation.navigate("Countdown", {
                                    exerciseName: firstExerciseName,
                                });
                            }
                        }}>
                        <Text
                            style={{
                                color: "#161411",
                                fontSize: 16,
                                textAlign: "center",
                            }}>
                            {"Start routine"}
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            height: 20,
                            backgroundColor: "#FFFFFF",
                        }}>
                    </View>
                    <QuoteCarousel />
                    <View
                        style={{
                            height: 20,
                            backgroundColor: "#FFFFFF",
                        }}>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}