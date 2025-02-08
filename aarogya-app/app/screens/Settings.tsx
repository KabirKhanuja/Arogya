import React, { useContext, useEffect } from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, } from "react-native";
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
                paddingTop: 20,
                backgroundColor: "#FFFFFF",
            }}>
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                }}>

                <TouchableOpacity
                    style={{
                        alignItems: "center",
                        backgroundColor: "#F99E16",
                        borderRadius: 8,
                        paddingVertical: 15,
                        marginBottom: 12,
                        marginHorizontal: 16,
                    }} onPress={handleLogout}>
                    <Text
                        style={{
                            color: "#1C160C",
                            fontSize: 14,
                        }}>
                        {"Logout"}
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    )
}