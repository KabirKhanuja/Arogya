import React, { useContext, useEffect } from "react";
import { SafeAreaView, View, ScrollView, Text, Image, TouchableOpacity, } from "react-native";
import AppContext from "../auth/AuthContext";

export default function SettingsScreen() {
    const { authService, setIsLoggedIn } = useContext(AppContext);

    const handleLogout = () => {
        authService.logoutUser()
            .then((response) => {
                if (response) {
                    console.log("Logout successful");
                    setIsLoggedIn(false);
                } else {
                    console.log("Error logging out");
                }
            });
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
                    backgroundColor: "#FFFFFF",
                }}>
                <View
                    style={{
                        backgroundColor: "#FCF7F7",
                    }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#FCF7F7",
                            paddingVertical: 28,
                            paddingHorizontal: 16,
                            marginBottom: 20,
                        }}>
                        <Image
                            source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                            resizeMode={"stretch"}
                            style={{
                                width: 24,
                                height: 24,
                                marginRight: 118,
                            }}
                        />
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 18,
                                flex: 1,
                            }}>
                            {"Settings"}
                        </Text>
                    </View>
                    <Text
                        style={{
                            color: "#1C0C0C",
                            fontSize: 18,
                            marginBottom: 9,
                            marginLeft: 17,
                        }}>
                        {"My account"}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#FCF7F7",
                            paddingVertical: 16,
                            paddingHorizontal: 17,
                        }}>
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 16,
                                marginRight: 4,
                                flex: 1,
                            }}>
                            {"Profile"}
                        </Text>
                        <Image
                            source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                            resizeMode={"stretch"}
                            style={{
                                width: 24,
                                height: 24,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#FCF7F7",
                            paddingVertical: 22,
                            paddingHorizontal: 17,
                        }}>
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 16,
                                marginRight: 4,
                                flex: 1,
                            }}>
                            {"Email"}
                        </Text>
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 16,
                            }}>
                            {"test@gmail.com"}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#FCF7F7",
                            paddingVertical: 16,
                            paddingHorizontal: 17,
                        }}>
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 16,
                                marginRight: 4,
                                flex: 1,
                            }}>
                            {"Password"}
                        </Text>
                        <Image
                            source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                            resizeMode={"stretch"}
                            style={{
                                width: 24,
                                height: 24,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#FCF7F7",
                            paddingVertical: 16,
                            paddingHorizontal: 17,
                            marginBottom: 20,
                        }}>
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 16,
                                marginRight: 4,
                                flex: 1,
                            }}>
                            {"Notifications"}
                        </Text>
                        <Image
                            source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                            resizeMode={"stretch"}
                            style={{
                                width: 24,
                                height: 24,
                            }}
                        />
                    </View>
                    <Text
                        style={{
                            color: "#1C0C0C",
                            fontSize: 18,
                            marginBottom: 9,
                            marginLeft: 17,
                        }}>
                        {"Privacy controls"}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#FCF7F7",
                            paddingVertical: 22,
                            paddingHorizontal: 16,
                        }}>
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 16,
                                marginRight: 4,
                                flex: 1,
                            }}>
                            {"See my location"}
                        </Text>
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 16,
                            }}>
                            {"Everyone"}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#FCF7F7",
                            paddingVertical: 22,
                            paddingHorizontal: 16,
                            marginBottom: 20,
                        }}>
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 16,
                                marginRight: 4,
                                flex: 1,
                            }}>
                            {"Contact me"}
                        </Text>
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 16,
                            }}>
                            {"Everyone"}
                        </Text>
                    </View>
                    <Text
                        style={{
                            color: "#1C0C0C",
                            fontSize: 18,
                            marginBottom: 9,
                            marginLeft: 16,
                        }}>
                        {"Support"}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#FCF7F7",
                            padding: 16,
                        }}>
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 16,
                                marginRight: 4,
                                flex: 1,
                            }}>
                            {"Contact Team"}
                        </Text>
                        <Image
                            source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                            resizeMode={"stretch"}
                            style={{
                                width: 24,
                                height: 24,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#FCF7F7",
                            paddingVertical: 16,
                            paddingHorizontal: 17,
                            marginBottom: 12,
                        }}>
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 16,
                                marginRight: 4,
                                flex: 1,
                            }}>
                            {"Privacy Policy"}
                        </Text>
                        <Image
                            source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                            resizeMode={"stretch"}
                            style={{
                                width: 24,
                                height: 24,
                            }}
                        />
                    </View>
                    <TouchableOpacity
                        style={{
                            alignItems: "center",
                            backgroundColor: "#F99E16",
                            borderRadius: 12,
                            paddingVertical: 15,
                            marginBottom: 74,
                            marginHorizontal: 16,
                        }} onPress={handleLogout}>
                        <Text
                            style={{
                                color: "#1C0C0C",
                                fontSize: 14,
                            }}>
                            {"Log out"}
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={{
                            color: "#1C0C0C",
                            fontSize: 14,
                            textAlign: "center",
                            marginBottom: 23,
                        }}>
                        {"Delete account"}
                    </Text>
                    <View
                        style={{
                            height: 20,
                            backgroundColor: "#FCF7F7",
                        }}>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}