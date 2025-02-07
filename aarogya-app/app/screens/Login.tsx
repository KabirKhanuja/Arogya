import { useNavigation, NavigationProp } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AppRoutes from "../types/routes";
import Loading from "../components/Loading";
import AppContext from "../auth/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<AppRoutes>>();
  const [loading, setLoading] = React.useState(false);
  const [error, _setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { authService, setIsLoggedIn } = useContext(AppContext);

  const setError = (error: string | null) => {
    _setError(error);
    if (!error) return;
    setTimeout(() => {
      _setError(null);
    }, 3000);
  };

  const handleRegister = () => {
    navigation.navigate("register");
  };
  const onLogin = () => {
    setLoading(true);
    setError(null);

    if (email === "" || password === "") {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    authService.loginUserAccount({ email, password }).then((response) => {
      if (response) {
        console.log("Login successful: ", response);
        setLoading(false);
        setIsLoggedIn(true);
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    });
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
        Login
      </Text>

      {loading && <Loading visible={loading} />}

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
        disabled={loading}
        onPress={onLogin}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRegister}>
        <Text style={{ color: "#007bff", marginTop: 15 }}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
