import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function LandingScreen(){
    const navigation = useNavigation();
    const goToLogin = () => navigation.navigate("login");

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", backgroundColor: "#f8f9fa" }}>
            <LinearGradient colors={["#6a11cb", "#2575fc"]} style={{ padding: 40, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}>
                <Text style={{ fontSize: 32, fontWeight: "bold", color: "#fff", textAlign: "center" }}>Aarogya</Text>
                <Text style={{ fontSize: 18, color: "#e3e3e3", textAlign: "center", marginTop: 10 }}>
                    Your AI-powered guide to effective rehabilitation guide
                </Text>
            </LinearGradient>

            <View style={{ padding: 20, alignItems: "center" }}>
                <Image source={{ uri: "https://png.pngtree.com/png-clipart/20230921/original/pngtree-smiling-caregiver-with-happy-old-female-patient-disabled-rehab-person-vector-png-image_12493915.png" }} style={{ width: "100%", height: 200, borderRadius: 15, marginVertical: 20 }} />

                <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, marginTop: 50 }}>How It Helps</Text>
                <Text style={{ fontSize: 16, textAlign: "center", color: "#555", marginBottom: 20 }}>
                    Our assistant provides real-time feedback and personalized exercise plans based on your rehabilitation needs.
                </Text>

                <View style={{ backgroundColor: "transparent", padding: 15, marginVertical: 45, elevation: 0 }}>
                </View>
            </View>

            <TouchableOpacity style={{ backgroundColor: "#2575fc", padding: 15, borderRadius: 30, margin: 20, alignItems: "center" }} onPress={goToLogin}>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Get Started</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};