import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useRef, useState } from "react";
import { SafeAreaView, View, ScrollView, Image, Text, TouchableOpacity, TextInput, StyleSheet, ImageSourcePropType } from "react-native";
import Chatbot from "../utils/ChatbotUtils";
import * as Speech from "expo-speech";
import { Linking } from "react-native";

const speakMessage = async (message: string,
    isSpeaking: boolean,
    setIsSpeaking: (isSpeaking: boolean) => void,
) => {
    if (isSpeaking) {
        await Speech.stop();
        setIsSpeaking(false);
        return;
    }

    Speech.speak(message, {
        language: "en",
        onDone: () => setIsSpeaking(false),
        onStart: () => setIsSpeaking(true),
    });
}

const ProfileImageView = ({ source, addMargin = true }: { source: ImageSourcePropType; addMargin?: boolean }) => {
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
                    source={source}
                    resizeMode={"stretch"}
                    style={{
                        borderRadius: 20,
                        height: 34,
                        width: 34,
                    }}
                />
            </View>
        </View>
    );
};

interface BotResponse {
    tool: string,
    query: string,
    conversation_text: string,
    search_results: []
}

function basicTextResponse(message: string): BotResponse {
    return {
        tool: "",
        query: "",
        conversation_text: message,
        search_results: []
    }
}

interface YoutubeToolSearchResult {
    video_id: string,
    title: string,
    description: string,
    thumbnail: string,
    channel_title: string,
    video_url: string
}

const YouTubeSearchResult = ({ message }: { message: BotResponse }) => {
    const openYoutubeVideo = (url: string) => {
        Linking.openURL(url);
    };
    const search_results = message.search_results as YoutubeToolSearchResult[];

    return (
        <>
            {message.tool === "youtube" && message.search_results.length > 0 && (
                <View style={{
                    backgroundColor: "#FFF",
                    padding: 10,
                    borderRadius: 8,
                    borderColor: "#ccc",
                    borderWidth: 1,
                    marginTop: 10,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, alignContent: 'center' }}>
                        <Ionicons name={"logo-youtube"} size={24} color="red" />
                        <Text style={{ fontWeight: 'bold', color: '#FF0000', marginStart: 8 }}>YouTube Videos</Text>
                    </View>

                    {search_results.map((video) => (
                        <TouchableOpacity
                            key={video.video_id}
                            style={{ marginBottom: 10 }}
                            onPress={() => openYoutubeVideo(video.video_url)}
                        >
                            <View style={{ flexDirection: "row" }}>
                                <Image source={{ uri: video.thumbnail }} style={{ width: 80, height: 50, borderRadius: 6 }} />
                                <View style={{ marginLeft: 10, flexShrink: 1 }}>
                                    <Text numberOfLines={2} style={{ fontWeight: '600', color: "#1C160C" }}>{video.title}</Text>
                                    <Text style={{ color: "#666", fontSize: 12 }}>{video.channel_title}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </>
    )
}

const TherapistBotMessage = ({ message, userPictureUrl, isTypingIndicator = false }:
    { message: BotResponse; userPictureUrl: string; isTypingIndicator?: boolean }
) => {
    const messageContent = message.conversation_text;
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const hasToolUsage = message.tool != undefined && message.tool != "";

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 30,
                marginHorizontal: 16,
            }}>
            <ProfileImageView source={require("../../assets/images/doctor_roro.jpeg")} />
            <View>
                <Text style={{ color: "#9E7A47", fontSize: 12, marginBottom: 6, marginLeft: 15, }}>Roro</Text>
                <View
                    style={{
                        width: 306,
                        backgroundColor: "#F4EFE5",
                        borderRadius: 8,
                        paddingVertical: 18,
                        paddingHorizontal: 16,
                        gap: 10,
                    }}
                >
                    <Text
                        style={{
                            color: isTypingIndicator ? "blue" : "#1C160C",
                            fontSize: 16,
                            fontStyle: isTypingIndicator ? "italic" : "normal",
                        }}>
                        {message.conversation_text}
                    </Text>

                    {
                        hasToolUsage && (
                            <YouTubeSearchResult message={message} />
                        )
                    }


                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <TouchableOpacity onPress={() => {
                            speakMessage(messageContent, isSpeaking, setIsSpeaking)
                        }}>
                            {
                                isSpeaking ?
                                    <Ionicons name={"pause-circle"} size={24} color="blue" />
                                    : <Ionicons name={"volume-low"} size={24} color="#9E7A47" />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const UserMessage = ({ message, userPictureUrl }:
    { message: string; userPictureUrl: string }
) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 30,
                marginHorizontal: 16,
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
            <ProfileImageView source={{ uri: userPictureUrl ? userPictureUrl : "https://picsum.photos/200/200" }} />
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
        <TherapistBotMessage message={basicTextResponse(typingIndicator[indicator])} userPictureUrl={"https://picsum.photos/200/200"} isTypingIndicator={true} />
    );
};

const EmptyMessagesContainer = ({ addQuickMessage }:
    { addQuickMessage: (message: string) => void }
) => {
    const suggestions = [
        "How can I track my progress?",
        "What exercises should I start with?",
        "How do I stay motivated?"
    ];

    return (
        <View style={styles.container}>
            <Ionicons name="chatbubbles-outline" size={50} color="#888" />
            <Text style={styles.title}>Welcome to Doctor Roro! 👋</Text>
            <Text style={styles.description}>
                Hi there! I'm Doctor Roro, your AI rehab companion.
                I'm here to support you on your journey, answer your questions, and keep you motivated.
                Just tap on a suggestion below or type your own message to get started!
            </Text>
            <View style={styles.suggestionsContainer}>
                {suggestions.map((text, index) => (
                    <TouchableOpacity key={index} style={styles.chip} onPress={() => addQuickMessage(text)}>
                        <Text style={styles.chipText}>{text}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
    description: {
        textAlign: "center",
        marginVertical: 10,
        color: "#666",
    },
    suggestionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 10,
    },
    chip: {
        backgroundColor: "#eee",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        margin: 5,
    },
    chipText: {
        color: "#333",
        fontWeight: "bold",
    },
});

type ChatMessage = {
    message: any;
    sender: string;
}


export default function ChatBotScreen() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const chatbotRef = useRef(new Chatbot());
    const scrollViewRef = useRef<ScrollView>(null);

    const clearMessages = () => {
        chatbotRef.current.reset();
        setMessages([]);
    }

    const addQuickMessage = (text: string) => {
        handleSendMessage(text);
    }

    const handleSendMessage = (extraMessage: string | null = null) => {
        if ((message === '' || message === null) && extraMessage === null) {
            return;
        }

        const userMessage: ChatMessage = {
            "message": (message === '' || message === null) ? extraMessage!! : message,
            "sender": "user",
        }
        messages.push(userMessage);
        setMessage('');
        setIsTyping(true);

        chatbotRef.current.getChatbotResponse(userMessage.message as string)
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
                if (messages.length >= 2) {
                    setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                }
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
                messages.length === 0 && <EmptyMessagesContainer addQuickMessage={addQuickMessage} />
            }
            {
                messages.length > 0 && (
                    <ScrollView
                        style={{
                            flex: 1,
                            width: "100%",
                        }}
                        ref={scrollViewRef}
                    >
                        <View>
                            <View
                                style={{
                                    alignItems: "center",
                                    paddingVertical: 30,
                                    margin: 0,
                                    paddingHorizontal: 0,
                                }}>
                                {
                                    messages.map((msg, index) => {
                                        if (msg.sender === "user") {
                                            return (
                                                <UserMessage key={index} message={msg.message as string} userPictureUrl={"https://picsum.photos/200/200"} />
                                            )
                                        } else {
                                            return (
                                                <TherapistBotMessage key={index} message={msg.message as BotResponse} userPictureUrl={"https://picsum.photos/200/200"} />
                                            )
                                        }
                                    })
                                }
                                {
                                    isTyping && <TypingIndicator />
                                }
                            </View>
                        </View>
                    </ScrollView>
                )
            }
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: 2,
                    paddingBottom: 6,
                    marginHorizontal: 8,
                    backgroundColor: "white",
                    borderTopWidth: 1,
                    borderColor: "transparent",
                }}>
                <TouchableOpacity onPress={clearMessages}>
                    <ProfileImageView source={{ uri: "https://picsum.photos/200/200" }} addMargin={false} />
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                        marginVertical: 8,
                        paddingVertical: 3,
                        backgroundColor: "#F4EFE5",
                        borderRadius: 8,
                    }}>
                    <TextInput
                        placeholder="Write a message..."
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        style={{
                            flex: 1,
                            fontSize: 16,
                            paddingHorizontal: 15,
                        }}
                        scrollEnabled={true}
                    />
                    <TouchableOpacity
                        style={{
                            padding: 10,
                        }}
                        disabled={message === ''}
                        onPress={() => handleSendMessage()}>
                        <Ionicons name="send" size={24} color={
                            message === '' ? "#9E7A47" : "#1C160C"
                        } />
                    </TouchableOpacity>
                </View>
            </View>


        </SafeAreaView>
    )
}