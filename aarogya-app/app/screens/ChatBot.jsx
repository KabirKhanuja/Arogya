import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useRef, useState } from "react";
import { SafeAreaView, View, ScrollView, Image, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import Chatbot from "../utils/ChatbotUtils";


const ProfileImageView = ({ uri, addMargin = true }) => {
    return (
        <View
            style={{
                width: 34,
                height: 34,
                marginTop: addMargin ? 4 : 0,
                marginStart: 10,
                marginEnd: 10
            }}>
            <View>
                <Image
                    source={{ uri }}
                    resizeMode={"stretch"}
                    style={{
                        borderRadius: 20,
                        height: 34,
                    }}
                />
            </View>
        </View>
    );
};

const TherapistBotMessage = ({ message, userPictureUrl, isTypingIndicator = false }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 30,
                marginHorizontal: 16,
                marginEnd: 10,
            }}>
            <ProfileImageView uri={userPictureUrl ? userPictureUrl : "https://picsum.photos/200/200"} />
            <View>
                <Text style={{ color: "#9E7A47", fontSize: 12, marginBottom: 6, marginLeft: 15, }}>Bot</Text>
                <Text
                    style={{
                        color: isTypingIndicator ? "blue" : "#1C160C",
                        fontSize: 16,
                        width: 306,
                        fontStyle: isTypingIndicator ? "italic" : "normal",
                        backgroundColor: "#F4EFE5",
                        borderRadius: 8,
                        paddingVertical: 18,
                        paddingHorizontal: 16,
                    }}>
                    {message}
                </Text>
            </View>
        </View>
    );
};

const UserMessage = ({ message, userPictureUrl }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 30,
                marginHorizontal: 16,
                marginEnd: 10,
            }}>
            <View>
                <Text style={{ color: "#9E7A47", fontSize: 12, marginBottom: 6, marginRight: 15, alignSelf: 'flex-end' }}>You</Text>
                <Text
                    style={{
                        color: "#1C160C",
                        fontSize: 16,
                        fontWeight: "normal",
                        width: 306,
                        backgroundColor: "orange",
                        borderRadius: 8,
                        paddingVertical: 18,
                        paddingHorizontal: 16,
                    }}>
                    {message}
                </Text>
            </View>
            <ProfileImageView uri={userPictureUrl ? userPictureUrl : "https://picsum.photos/200/200"} />
        </View>
    );
};

const TypingIndicator = () => {
    const typingIndicator = ["Typing", "Typing.", "Typing..", "Typing..."];
    const [indicator, setIndicator] = useState(0);
    setTimeout(() => {
        setIndicator((indicator + 1) % 4);
    }, 300);
    return (
        <TherapistBotMessage message={typingIndicator[indicator]} userPictureUrl={"https://picsum.photos/200/200"} isTypingIndicator={true} />
    );
};

const Dialog = () => {
    return (
        <>
            <TherapistBotMessage message={"Hi there, I'm your virtual guide to help you through your exercises. How can I help you today?"} />
            <UserMessage message={"I'm  having  a  hard  time  with  the  hip  flexor  stretch."} />
        </>
    )
}


const EmptyMessagesContainer = () => {
    return (
        <View style={styles.container}>
            <Ionicons name="chatbubbles-outline" size={50} color="#888" />
            <Text style={styles.title}>Welcome to Chatbot!</Text>
            <Text style={styles.description}>
                Start by typing a message below. The chatbot is here to assist you with your queries,
                provide helpful insights, and make your experience smoother.
            </Text>
            <Text style={styles.hint}>Try saying: "Hello!"</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginTop: 8,
    },
    hint: {
        fontSize: 14,
        color: '#007AFF',
        marginTop: 12,
        fontWeight: '500',
    },
});


export default function ChatBotScreen(props) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatbotRef = useRef(new Chatbot());

    const handleSendMessage = () => {
        if (message === '' || message === null) {
            return;
        }

        const userMessage = {
            "message": message,
            "sender": "user",
        }
        messages.push(userMessage);
        setMessage('');
        setIsTyping(true);

        chatbotRef.current.getChatbotResponse(message)
            .then((responseMessage) => {
                if (responseMessage === '' || responseMessage === null) {
                    setIsTyping(false);
                    return;
                }
                const botMessage = {
                    "message": responseMessage,
                    "sender": "bot",
                }
                setMessages((prevMessage) => [...prevMessage, botMessage]);
                setIsTyping(false);
            })
            .catch((error) => {
                console.log("Error in getting response from chatbot: ", error);
                setIsTyping(false);
            });
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "white",
            }}>
            {
                messages.length === 0 && <EmptyMessagesContainer />
            }
            {
                messages.length > 0 && (
                    <ScrollView
                        style={{
                            flex: 1,
                            width: "100%",
                            backgroundColor: "#FFFFFF",
                        }}>
                        <View>
                            <View
                                style={{
                                    alignItems: "flex-start",
                                    paddingTop: 50,
                                    paddingBottom: 50,
                                }}>
                                {
                                    messages.map((msg, index) => {
                                        if (msg.sender === "user") {
                                            return (
                                                <UserMessage key={index} message={msg.message} userPictureUrl={"https://picsum.photos/200/200"} />
                                            )
                                        } else {
                                            return (
                                                <TherapistBotMessage key={index} message={msg.message} userPictureUrl={"https://picsum.photos/200/200"} />
                                            )
                                        }
                                    })
                                }
                                {
                                    isTyping && <TypingIndicator />
                                }
                            </View>
                            {/* <View
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
                                    <Ionicons name="chevron-back" size={24} color="#1C160C" onPress={() => props.navigation.goBack()}
                                        style={{ marginRight: 104, }}
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
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        marginBottom: 39,
                                        marginHorizontal: 16,
                                    }}>
                                    <Image
                                        source={{ uri: "https://picsum.photos/200/300" }}
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
                                                source={{ uri: "https://picsum.photos/200/200" }}
                                                resizeMode={"stretch"}
                                                style={{
                                                    borderRadius: 20,
                                                    height: 40,
                                                }}
                                            />
                                            <Image
                                                source={{ uri: "https://picsum.photos/200/200" }}
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
                                        placeholder={"Write message here"}
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
                                            source={{ uri: "https://picsum.photos/200/200" }}
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
                            </View> */}
                            {/* <Image
                                source={{ uri: "https://picsum.photos/200/200" }}
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
                                source={{ uri: "https://picsum.photos/200/200" }}
                                resizeMode={"stretch"}
                                style={{
                                    position: "absolute",
                                    bottom: -3,
                                    left: 0,
                                    width: 110,
                                    height: 91,
                                }} */}
                            {/* /> */}
                        </View>
                    </ScrollView>
                )
            }
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    backgroundColor: "white",
                    borderTopWidth: 1,
                    borderColor: "transparent",
                }}>
                <ProfileImageView uri={"https://picsum.photos/200/200"} addMargin={false} />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                        marginVertical: 8,
                        color: "#1C160C",
                        paddingVertical: 3,
                        fontSize: 16,
                        backgroundColor: "#F4EFE5",
                        borderRadius: 8,
                    }}>
                    <TextInput
                        placeholder="Write a message..."
                        value={message}
                        onChangeText={setMessage}
                        style={{
                            flex: 1,
                            color: "#1C160C",
                            fontSize: 16,
                            backgroundColor: "#F4EFE5",
                            borderRadius: 8,
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            marginRight: 10,
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            borderRadius: 8,
                            padding: 10,
                        }}
                        disabled={message === ''}
                        onPress={handleSendMessage}>
                        <Ionicons name="send" size={24} color={
                            message === '' ? "#9E7A47" : "#1C160C"
                        } />
                    </TouchableOpacity>
                </View>
            </View>


        </SafeAreaView>
    )
}