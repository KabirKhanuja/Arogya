import { useNavigation, NavigationProp } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AppRoutes from "../types/routes";
import Loading from "../components/Loading";
import AppContext from "../auth/AuthContext";

export default function RegisterScreen() {
    const navigation = useNavigation<NavigationProp<AppRoutes>>();
    const [loading, setLoading] = React.useState(false);
    const [error, _setError] = React.useState<string | null>(null);
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const { authService, isLoggedIn, setIsLoggedIn, setFormFilled } = useContext(AppContext);

    const handleLogin = () => {
        // Navigate to the login screen
        navigation.goBack();
    };

    const setError = (error: string | null) => {
        _setError(error);
        if (!error) return;
        setTimeout(() => {
            _setError(null);
        }, 3000);
    };

    const onRegister = () => {
        setLoading(true);
        setError(null);
        console.log(name, email, password);

        if (!email || !password || !name || email === "" || password === "" || name === "") {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        } else if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        } else if (!email.includes("@")) {
            setError("Invalid email");
            setLoading(false);
            return;
        } else if (name.length < 3) {
            setError("Name must be at least 3 characters long");
            setLoading(false);
            return;
        }

        authService.createUserAccount({ name, email, password }).then((response) => {
            if (response) {
                console.log("Registration successful: ", response);
                setLoading(false);
                // setFormFilled(false);
                setIsLoggedIn(true);
            } else {
                setError("An error occurred while registering");
                setLoading(false);
            }
        });
    };

    const onChangeName = (e: any) => {
        setName(e);
    };

    const onChangeEmail = (e: any) => {
        setEmail(e);
    };

    const onChangePassword = (e: any) => {
        setPassword(e);
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#FCFAF7",
                padding: 20,
            }}
        >
            <Text style={{ 
                fontSize: 32, 
                fontWeight: "bold", 
                color: "#161411", 
                marginBottom: 30 
            }}>
                Create Account
            </Text>

            {loading && <Loading visible={loading} />}

            <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={onChangeName}
                style={{
                    width: "90%",
                    padding: 16,
                    backgroundColor: "#F4F2EF",
                    borderRadius: 12,
                    marginBottom: 16,
                    fontSize: 16,
                    color: "#161411",
                }}
                placeholderTextColor="#8C7A5E"
            />

            <TextInput
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={onChangeEmail}
                style={{
                    width: "90%",
                    padding: 16,
                    backgroundColor: "#F4F2EF",
                    borderRadius: 12,
                    marginBottom: 16,
                    fontSize: 16,
                    color: "#161411",
                }}
                placeholderTextColor="#8C7A5E"
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={onChangePassword}
                secureTextEntry
                style={{
                    width: "90%",
                    padding: 16,
                    backgroundColor: "#F4F2EF",
                    borderRadius: 12,
                    marginBottom: 16,
                    fontSize: 16,
                    color: "#161411",
                }}
                placeholderTextColor="#8C7A5E"
            />

            {error && (
                <View
                    style={{
                        width: "90%",
                        padding: 16,
                        backgroundColor: "#f8d7da",
                        borderRadius: 12,
                        marginBottom: 16,
                        borderWidth: 1,
                        borderColor: "#f5c6cb",
                    }}
                >
                    <Text style={{ color: "#721c24" }}>{error}</Text>
                </View>
            )}

            <TouchableOpacity
                style={{
                    backgroundColor: "#F99E16",
                    width: "90%",
                    padding: 16,
                    borderRadius: 12,
                    marginTop: 10,
                    alignItems: "center",
                }}
                onPress={onRegister}
            >
                <Text style={{ 
                    color: "#161411", 
                    fontSize: 18, 
                    fontWeight: "600" 
                }}>
                    Register
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={handleLogin}
                style={{ marginTop: 20 }}
            >
                <Text style={{ 
                    color: "#8C7A5E",
                    fontSize: 16
                }}>
                    Already have an account? <Text style={{ color: "#F99E16" }}>Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}
