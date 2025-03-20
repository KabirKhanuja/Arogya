import Router from "./routes/Router";
import { AppContextProvider } from "./auth/AuthContext";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <AppContextProvider>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <Router />
    </AppContextProvider>
  )
}