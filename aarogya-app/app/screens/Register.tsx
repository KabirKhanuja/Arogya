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
    const { authService, isLoggedIn, setIsLoggedIn } = useContext(AppContext);

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
            if (response && typeof response === 'object' && !('error' in response)) {
                console.log("Registration successful: ", response);
                setLoading(false);
                setIsLoggedIn(true);
            } else {
                setLoading(false);
                if (response && typeof response === 'object' && 'error' in response) {
                    setError(response.error as string);
                } else {
                    setError("An error occurred while registering");
                }
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
                backgroundColor: "#f5f7fa",
                padding: 20,
            }}
        >
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 20 }}>
                Register
            </Text>

            {loading && <Loading visible={loading} />}

            <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={onChangeName}
                style={{
                    width: "90%",
                    padding: 12,
                    backgroundColor: "white",
                    borderRadius: 8,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: "#ccc",
                }}
            />

            <TextInput
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={onChangeEmail}
                style={{
                    width: "90%",
                    padding: 12,
                    backgroundColor: "white",
                    borderRadius: 8,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: "#ccc",
                }}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={onChangePassword}
                secureTextEntry
                style={{
                    width: "90%",
                    padding: 12,
                    backgroundColor: "white",
                    borderRadius: 8,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: "#ccc",
                }}
            />

            {error && (
                <View
                    style={{
                        width: "90%",
                        padding: 12,
                        backgroundColor: "#f8d7da",
                        borderRadius: 8,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: "#f5c6cb",
                    }}
                >
                    <Text style={{ color: "#721c24" }}>{error}</Text>
                </View>
            )}

            <TouchableOpacity
                style={{
                    backgroundColor: "#007bff",
                    paddingVertical: 12,
                    paddingHorizontal: 30,
                    borderRadius: 8,
                    marginTop: 10,
                }}
                onPress={onRegister}
            >
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                    Register
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogin}>
                <Text style={{ color: "#007bff", marginTop: 15 }}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}
