import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function LandingScreen(){
    const navigation = useNavigation();
    const goToLogin = () => navigation.navigate("login");

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
            <LinearGradient colors={["#6a11cb", "#2575fc"]} style={{ padding: 40, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}>
                <Text style={{ fontSize: 32, fontWeight: "bold", color: "#fff", textAlign: "center" }}>Aarogya</Text>
                <Text style={{ fontSize: 18, color: "#e3e3e3", textAlign: "center", marginTop: 10 }}>
                    Your AI-powered guide to effective physical therapy
                </Text>
            </LinearGradient>

            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>How It Helps</Text>
                <Text style={{ fontSize: 16, textAlign: "center", color: "#555" }}>
                    Our assistant provides real-time feedback and personalized exercise plans based on your rehabilitation needs.
                </Text>

                <Image source={{ uri: "https://png.pngtree.com/png-clipart/20230921/original/pngtree-smiling-caregiver-with-happy-old-female-patient-disabled-rehab-person-vector-png-image_12493915.png" }} style={{ width: "100%", height: 200, borderRadius: 15, marginVertical: 20 }} />

                <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>Features</Text>
                <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 10, marginVertical: 5, elevation: 2 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>📹 Video Demonstrations</Text>
                    <Text style={{ fontSize: 14, color: "#666" }}>Step-by-step guided exercises to ensure correct movements.</Text>
                </View>

                <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 10, marginVertical: 5, elevation: 2 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>📊 Real-Time Feedback</Text>
                    <Text style={{ fontSize: 14, color: "#666" }}>Monitor and improve your form with AI-driven analysis.</Text>
                </View>

                <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 10, marginVertical: 5, elevation: 2 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>🛠️ Personalized Plans</Text>
                    <Text style={{ fontSize: 14, color: "#666" }}>Custom exercises tailored to your recovery needs.</Text>
                </View>
            </View>

            <TouchableOpacity style={{ backgroundColor: "#2575fc", padding: 15, borderRadius: 30, margin: 20, alignItems: "center" }} onPress={goToLogin}>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Get Started</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};