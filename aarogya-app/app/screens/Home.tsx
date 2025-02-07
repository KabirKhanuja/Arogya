import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import AppContext from "../auth/AuthContext";

export default function HomeScreen() {
    const { user } = useContext(AppContext);

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: "#f5f7fa",
                padding: 20,
                alignItems: "center",
            }}
        >
            {
                user ? (
                    <>
                        <Text style={{ fontSize: 26, fontWeight: "bold", color: "#333", marginTop: 10 }}>
                            Welcome, {user.name}! 👋
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginTop: 10 }}>
                            Your email: {user.email}
                        </Text>
                        <Text style={{ fontSize: 16, fontStyle: "italic", color: "#333", marginTop: 30 }}>
                            Please show me the bottom navigation bar now where there would be "Home", "Fitness", "Chat", "Profile"
                        </Text>
                    </>
                ) : (
                    <Text style={{ fontSize: 26, fontWeight: "bold", color: "#333", marginTop: 10 }}>
                        You are not logged in!
                    </Text>
                )
            }
        </ScrollView>
    );
}
