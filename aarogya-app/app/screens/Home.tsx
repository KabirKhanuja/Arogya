import React, { useContext } from "react";
import { SafeAreaView, View, ScrollView, Text, Image, TouchableOpacity, } from "react-native";
import AppContext from "../auth/AuthContext";
import { useNavigation } from "expo-router";
import RoadmapUtils from "../utils/RoadmapUtils";
import ExerciseRoadmap from "../components/ExerciseRoadmap";

const LoadingIndicator = ({ text = "Typing" }) => {
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
    const [roadmap, setRoadmap] = React.useState({});
    const navigation = useNavigation();
    const roadmapGeneratorRef = React.useRef(new RoadmapUtils(user!!.id!!));

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
                                    {"45"}
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
                                <Text>
                                    {JSON.stringify(roadmap)}
                                </Text>
                                <ExerciseRoadmap data={roadmap}/>
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
                            navigation.navigate("Countdown");
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
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}