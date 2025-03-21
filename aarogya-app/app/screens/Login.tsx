import { useNavigation, NavigationProp } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Loading from "../components/Loading";
import AppContext from "../auth/AuthContext";
import { AuthStackNavigationProps } from "../routes/AuthStack";
import { schedulePushNotification } from "../utils/NotificationUtils";

const loginNotifications = {
  titles: [
    "Welcome Back, Warrior!",
    "Back on Track!",
    "Let’s Crush Today’s Rehab!",
    "Your Progress Awaits!",
    "Time to Stretch & Strengthen!"
  ],
  bodies: [
    "Keep the momentum going! Your next workout is ready 🏃‍♂️.",
    "Consistency is key! Let’s hit today’s rehab goals 🔥.",
    "Every session brings you closer to recovery 💪.",
    "Let’s make today’s workout count. Ready when you are!",
    "Your exercises are lined up. Let’s get moving 🚀."
  ]
};

export default function LoginScreen() {
  const navigation = useNavigation<AuthStackNavigationProps>();
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

    authService.loginUserAccount({ email, password }).then((response: { response?: any; error?: string | null }) => {
      if (response.error == null) {
        const randomLoginTitle = loginNotifications.titles[Math.floor(Math.random() * loginNotifications.titles.length)];
        const randomLoginBody = loginNotifications.bodies[Math.floor(Math.random() * loginNotifications.bodies.length)];
        console.log("Login successful: ", response.response);
        schedulePushNotification({
          title: randomLoginTitle,
          body: randomLoginBody,
          data: {},
          afterSec: 30,
        })
        setLoading(false);
        setIsLoggedIn(true);
      } else {
        if (response && response.error != null) {
          setError(response.error);
          setLoading(false);
        } else {
          setError("Invalid email or password");
          setLoading(false);
        }
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
        Welcome Back
      </Text>

      {loading && <Loading visible={loading} />}

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
        disabled={loading}
        onPress={onLogin}
      >
        <Text style={{
          color: "#161411",
          fontSize: 18,
          fontWeight: "600"
        }}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleRegister}
        style={{ marginTop: 20 }}
      >
        <Text style={{
          color: "#8C7A5E",
          fontSize: 16
        }}>
          Don't have an account? <Text style={{ color: "#F99E16" }}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
