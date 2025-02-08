import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView, View, ScrollView, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Pedometer } from 'expo-sensors';
import AppContext from "../auth/AuthContext";
import { useNavigation } from "expo-router";
import RoadmapUtils from "../utils/RoadmapUtils";
import Loading from "../components/Loading";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types
type PedometerAvailability = 'checking' | 'available' | 'unavailable';
type Subscription = { remove: () => void };

interface DayBoundaries {
    startOfDay: Date;
    endOfDay: Date;
}

// Utility function to get start and end of day in IST
const getDayBoundariesIST = (): DayBoundaries => {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
};

export default function HomeScreen() {
    const { user } = useContext(AppContext);
    const [roadmapGenerated, setRoadmapGenerated] = React.useState<boolean>(false);
    const [roadmap, setRoadmap] = React.useState<Record<string, any>>({});
    const [stepCount, setStepCount] = useState<number>(0);
    const [isPedometerAvailable, setPedometerAvailable] = useState<PedometerAvailability>('checking');
    const navigation = useNavigation();
    const roadmapGeneratorRef = React.useRef(new RoadmapUtils(user?.id ?? ''));

    // Store steps at midnight
    const storeStepsAtMidnight = async (steps: number): Promise<void> => {
        try {
            const date = new Date().toISOString().split('T')[0];
            await AsyncStorage.setItem(`steps_${date}`, steps.toString());
        } catch (error) {
            console.error('Error storing steps:', error);
        }
    };

    // Load stored steps
    const loadStoredSteps = async (): Promise<number> => {
        try {
            const date = new Date().toISOString().split('T')[0];
            const steps = await AsyncStorage.getItem(`steps_${date}`);
            return steps ? parseInt(steps) : 0;
        } catch (error) {
            console.error('Error loading steps:', error);
            return 0;
        }
    };

    // Check if we need to reset steps
    const checkAndResetSteps = async (): Promise<void> => {
        const now = new Date();
        const lastResetDate = await AsyncStorage.getItem('lastResetDate');
        const currentDate = now.toISOString().split('T')[0];

        if (lastResetDate !== currentDate) {
            // Store yesterday's steps before resetting
            const yesterdaySteps = await loadStoredSteps();
            await storeStepsAtMidnight(yesterdaySteps);

            // Reset steps for new day
            setStepCount(0);
            await AsyncStorage.setItem('lastResetDate', currentDate);
        }
    };

    useEffect(() => {
        let subscription: Subscription | null = null;

        const subscribe = async () => {
            const isAvailable = await Pedometer.isAvailableAsync();
            setPedometerAvailable(isAvailable ? 'available' : 'unavailable');

            if (isAvailable) {
                const { startOfDay, endOfDay } = getDayBoundariesIST();

                // Load any stored steps first
                const storedSteps = await loadStoredSteps();
                setStepCount(storedSteps);

                // Check if we need to reset steps
                await checkAndResetSteps();

                // Subscribe to pedometer updates
                subscription = Pedometer.watchStepCount(result => {
                    setStepCount(prevCount => {
                        const newCount = prevCount + result.steps;
                        storeStepsAtMidnight(newCount);
                        return newCount;
                    });
                });

                // Get steps since start of day
                const pastStepCountResult = await Pedometer.getStepCountAsync(startOfDay, endOfDay);
                if (pastStepCountResult) {
                    setStepCount(pastStepCountResult.steps);
                }
            } else {
                Alert.alert(
                    'Pedometer not available',
                    'The pedometer is not available on this device.'
                );
            }
        };

        subscribe();

        // Cleanup subscription on unmount
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    // Your existing useEffect for roadmap
    React.useEffect(() => {
        if (!roadmapGenerated) {
            roadmapGeneratorRef.current.generateRoadmap()
                .then((response) => {
                    if (response) {
                        setRoadmap(response);
                        setRoadmapGenerated(true);
                    }
                });
        }
    }, []);

    // For the navigation error, you'll need to type it properly
    const handleStartRoutine = () => {
        // @ts-ignore - Add proper typing for your navigation
        navigation.navigate("Countdown");
    };

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
                                    minWidth: 165,
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
                                    {stepCount.toString()}
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
                                    {"2"}
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
                                    minWidth: 165,
                                }}>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 16,
                                        marginBottom: 16,
                                        textAlign: "center",
                                    }}>
                                    {"Time Spent"}
                                </Text>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 24,
                                    }}>
                                    {"1:03"}
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
                                        // marginHorizontal: 2,
                                    }}>
                                    {"Calories Burned"}
                                </Text>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 24,
                                    }}>
                                    {"34"}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                backgroundColor: "#F4F2EF",
                                borderRadius: 12,
                                paddingVertical: 30,
                                width: 380,
                                paddingHorizontal: 25,
                                marginBottom: 37,
                                alignContent: "center",
                                alignItems: "center",
                                marginHorizontal: 16,
                            }}>
                            <Text
                                style={{
                                    color: "#161411",
                                    fontSize: 16,
                                    marginBottom: 16,
                                }}>
                                {"Total score"}
                            </Text>
                            <Text
                                style={{
                                    color: "#161411",
                                    fontSize: 24,
                                }}>
                                {"3,456"}
                            </Text>
                        </View>
                    </View>
                    <Text
                        style={{
                            color: "#161411",
                            fontSize: 18,
                            marginBottom: 26,
                            marginLeft: 17,
                        }}>
                        {"Today's roadmap"}
                    </Text>
                    {
                        !roadmapGenerated ? (<Loading />) : (
                            <>
                                <Text>
                                    {JSON.stringify(roadmap)}
                                </Text>
                            </>
                        )
                    }
                    {/* <View>
                    <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginBottom: 2,
                                marginLeft: 32,
                                marginRight: 206,
                            }}>
                            <View
                                style={{
                                    width: 8,
                                    marginTop: 2,
                                    marginRight: 25,
                                }}>
                                <View
                                    style={{
                                        height: 8,
                                        backgroundColor: "#161411",
                                        borderRadius: 4,
                                        marginBottom: 4,
                                    }}>
                                </View>
                                <View
                                    style={{
                                        height: 40,
                                        backgroundColor: "#E5E2DB",
                                        marginHorizontal: 3,
                                    }}>
                                </View>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                }}>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 16,
                                        textAlign: "center",
                                        marginBottom: 8,
                                    }}>
                                    {"Morning routine"}
                                </Text>
                                <Text
                                    style={{
                                        color: "#8C7A5E",
                                        fontSize: 16,
                                    }}>
                                    {"2 exercises"}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                width: 2,
                                height: 16,
                                backgroundColor: "#E5E2DB",
                                marginBottom: 2,
                                marginLeft: 35,
                            }}>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginBottom: 3,
                                marginLeft: 32,
                                marginRight: 213,
                            }}>
                            <View
                                style={{
                                    width: 8,
                                    marginTop: 2,
                                    marginRight: 25,
                                }}>
                                <View
                                    style={{
                                        height: 8,
                                        backgroundColor: "#161411",
                                        borderRadius: 4,
                                        marginBottom: 4,
                                    }}>
                                </View>
                                <View
                                    style={{
                                        height: 40,
                                        backgroundColor: "#E5E2DB",
                                        marginHorizontal: 3,
                                    }}>
                                </View>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                }}>
                                <Text
                                    style={{
                                        color: "#161411",
                                        fontSize: 16,
                                        textAlign: "center",
                                        marginBottom: 8,
                                    }}>
                                    {"Afternoon walk"}
                                </Text>
                                <Text
                                    style={{
                                        color: "#8C7A5E",
                                        fontSize: 16,
                                        textAlign: "center",
                                    }}>
                                    {"Walk 500 steps"}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                width: 2,
                                height: 16,
                                backgroundColor: "#E5E2DB",
                                marginBottom: 2,
                                marginLeft: 35,
                            }}>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 8,
                                marginLeft: 32,
                                marginRight: 209,
                            }}>
                            <View
                                style={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: "#161411",
                                    borderRadius: 4,
                                    marginRight: 26,
                                }}>
                            </View>
                            <Text
                                style={{
                                    color: "#161411",
                                    fontSize: 16,
                                    flex: 1,
                                }}>
                                {"Evening routine"}
                            </Text>
                        </View>
                        <Text
                            style={{
                                color: "#8C7A5E",
                                fontSize: 16,
                                marginBottom: 21,
                                marginLeft: 65,
                            }}>
                            {"3 exercises"}
                        </Text>
                    </View> */}

                    <TouchableOpacity
                        style={{
                            alignItems: "center",
                            backgroundColor: "#F99E16",
                            borderRadius: 12,
                            padding: 18,
                            alignSelf: "stretch",
                            marginBottom: 12,
                            marginHorizontal: 16,
                        }}
                        onPress={handleStartRoutine}>
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
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}