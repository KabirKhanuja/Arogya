import React, { useState } from "react";
import { SafeAreaView, View, ScrollView, Image, Text, TouchableOpacity, TextInput, } from "react-native";

export default function ChatBotScreen(props) {
    const [textInput1, onChangeTextInput1] = useState('');
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
                <View >
                    <View
                        style={{
                            alignItems: "flex-start",
                            backgroundColor: "#FCF9F7",
                        }}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "#FCF9F7",
                                paddingVertical: 28,
                                paddingHorizontal: 16,
                            }}>
                            <Image
                                source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                                resizeMode={"stretch"}
                                style={{
                                    width: 24,
                                    height: 24,
                                    marginRight: 104,
                                }}
                            />
                            <Text
                                style={{
                                    color: "#1C160C",
                                    fontSize: 18,
                                    flex: 1,
                                }}>
                                {"Talk-to-Doc"}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "#FCF9F7",
                                paddingVertical: 22,
                                paddingHorizontal: 16,
                                marginBottom: 16,
                            }}>
                            <Text
                                style={{
                                    color: "#1C160C",
                                    fontSize: 16,
                                    marginRight: 4,
                                    flex: 1,
                                }}>
                                {"You have a new message"}
                            </Text>
                            <Text
                                style={{
                                    color: "#9E7A47",
                                    fontSize: 14,
                                }}>
                                {"1:23 PM"}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: 39,
                                marginHorizontal: 16,
                            }}>
                            <Image
                                source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                                resizeMode={"stretch"}
                                style={{
                                    borderRadius: 20,
                                    width: 40,
                                    height: 40,
                                }}
                            />
                            <View
                                style={{
                                    width: 299,
                                    marginTop: 4,
                                }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginBottom: 11,
                                        marginLeft: 1,
                                        marginRight: 210,
                                    }}>
                                    <Text
                                        style={{
                                            color: "#1C160C",
                                            fontSize: 16,
                                            marginRight: 14,
                                        }}>
                                        {"Doc"}
                                    </Text>
                                    <Text
                                        style={{
                                            color: "#9E7A47",
                                            fontSize: 14,
                                            flex: 1,
                                        }}>
                                        {"1:24 PM"}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        color: "#1C160C",
                                        fontSize: 16,
                                    }}>
                                    {"Hi there, I'm your virtual guide to help you through your exercises. How can I help you today? "}
                                </Text>
                            </View>
                        </View>
                        <Text
                            style={{
                                color: "#9E7A47",
                                fontSize: 13,
                                marginBottom: 6,
                                marginLeft: 69,
                            }}>
                            {"Me"}
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#F99E16",
                                borderRadius: 8,
                                paddingVertical: 18,
                                paddingHorizontal: 16,
                                marginBottom: 37,
                                marginLeft: 16,
                            }} onPress={() => alert('Pressed!')}>
                            <Text
                                style={{
                                    color: "#1C160C",
                                    fontSize: 16,
                                }}>
                                {"I'm  having  a  hard  time  with  the  hip  flexor  stretch.  "}
                            </Text>
                        </TouchableOpacity>
                        <Text
                            style={{
                                color: "#9E7A47",
                                fontSize: 13,
                                marginBottom: 6,
                                marginLeft: 68,
                            }}>
                            {"Therapist Bot"}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: 217,
                                marginHorizontal: 16,
                            }}>
                            <View
                                style={{
                                    width: 40,
                                    marginTop: 80,
                                }}>
                                <View >
                                    <Image
                                        source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                                        resizeMode={"stretch"}
                                        style={{
                                            borderRadius: 20,
                                            height: 40,
                                        }}
                                    />
                                    <Image
                                        source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                                        resizeMode={"stretch"}
                                        style={{
                                            borderRadius: 20,
                                            height: 40,
                                            marginTop: -39,
                                        }}
                                    />
                                </View>
                            </View>
                            <TextInput
                                placeholder={"This  is  a  common  problem.  The key  is  to  focus  on  keeping  your  pelvis  stable  while  stretching the front  of  your  hips.  "}
                                value={textInput1}
                                onChangeText={onChangeTextInput1}
                                style={{
                                    color: "#1C160C",
                                    fontSize: 16,
                                    width: 306,
                                    backgroundColor: "#F4EFE5",
                                    borderRadius: 8,
                                    paddingVertical: 18,
                                    paddingHorizontal: 16,
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 12,
                                marginHorizontal: 16,
                            }}>
                            <View
                                style={{
                                    width: 266,
                                    backgroundColor: "#F4EFE5",
                                    paddingVertical: 18,
                                    paddingHorizontal: 16,
                                }}>
                                <Text
                                    style={{
                                        color: "#9E7A47",
                                        fontSize: 16,
                                    }}>
                                    {"Write  a message"}
                                </Text>
                            </View>
                            <View
                                style={{
                                    width: 40,
                                    backgroundColor: "#F4EFE5",
                                    paddingHorizontal: 6,
                                }}>
                                <Image
                                    source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                                    resizeMode={"stretch"}
                                    style={{
                                        height: 20,
                                        marginTop: 14,
                                    }}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                height: 20,
                                backgroundColor: "#FCF9F7",
                            }}>
                        </View>
                    </View>
                    <Image
                        source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                        resizeMode={"stretch"}
                        style={{
                            position: "absolute",
                            top: 318,
                            right: -6,
                            width: 110,
                            height: 91,
                        }}
                    />
                    <Image
                        source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                        resizeMode={"stretch"}
                        style={{
                            position: "absolute",
                            bottom: -3,
                            left: 0,
                            width: 110,
                            height: 91,
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}