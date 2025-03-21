import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

export default function LandingScreen() {
    const navigation = useNavigation();
    const goToLogin = () => navigation.navigate("login");

    const features = [
        {
            icon: "fitness-outline",
            title: "Personalized Exercises",
            description: "Custom rehabilitation routines tailored to your needs"
        },
        {
            icon: "analytics-outline",
            title: "Track Progress",
            description: "Monitor your recovery journey with detailed insights"
        },
        {
            icon: "medical-outline",
            title: "Expert Guidance",
            description: "AI-powered assistance based on medical expertise"
        }
    ];

    return (
        <ScrollView style={{ backgroundColor: "#FCFAF7" }}>
            <LinearGradient 
                colors={["#F99E16", "#FFB347"]} 
                style={{
                    paddingTop: 60,
                    paddingBottom: 40,
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                }}>
                <View style={{ padding: 20, alignItems: "center" }}>
                    <Text style={{ 
                        fontSize: 40, 
                        fontWeight: "bold", 
                        color: "#161411", 
                        marginBottom: 10 
                    }}>
                        Arogya
                    </Text>
                    <Text style={{ 
                        fontSize: 18, 
                        color: "#161411", 
                        textAlign: "center",
                        opacity: 0.8,
                        width: "80%" 
                    }}>
                        Your AI-powered guide to effective rehabilitation
                    </Text>
                </View>
            </LinearGradient>

            <View style={{ padding: 20 }}>
                <Image 
                    source={require("../../assets/images/arogya_landing_page_image.jpeg")} 
                    style={{
                        width: width - 40,
                        height: 220,
                        borderRadius: 20,
                        marginVertical: 20
                    }} 
                    resizeMode="cover"
                />

                <Text style={{ 
                    fontSize: 24, 
                    fontWeight: "bold", 
                    color: "#161411",
                    marginBottom: 30,
                    marginTop: 20,
                    textAlign: "center" 
                }}>
                    Why Choose Arogya?
                </Text>

                {features.map((feature, index) => (
                    <View key={index} style={{
                        flexDirection: "row",
                        backgroundColor: "#F4F2EF",
                        padding: 20,
                        borderRadius: 12,
                        marginBottom: 15,
                        alignItems: "center"
                    }}>
                        <View style={{
                            backgroundColor: "#F99E16",
                            padding: 12,
                            borderRadius: 12,
                            marginRight: 15
                        }}>
                            <Ionicons name={feature.icon} size={24} color="#161411" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ 
                                fontSize: 18, 
                                fontWeight: "600",
                                color: "#161411",
                                marginBottom: 5
                            }}>
                                {feature.title}
                            </Text>
                            <Text style={{ 
                                fontSize: 14,
                                color: "#8C7A5E"
                            }}>
                                {feature.description}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            <TouchableOpacity 
                style={{
                    backgroundColor: "#F99E16",
                    padding: 18,
                    borderRadius: 12,
                    margin: 20,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center"
                }} 
                onPress={goToLogin}
            >
                <Text style={{ 
                    color: "#161411", 
                    fontSize: 18, 
                    fontWeight: "600",
                    marginRight: 8
                }}>
                    Get Started
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#161411" />
            </TouchableOpacity>
        </ScrollView>
    );
}