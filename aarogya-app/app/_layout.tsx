import Router from "./routes/Router";
import { AppContextProvider } from "./auth/AuthContext";

export default function RootLayout() {
  return (
    <AppContextProvider>
      <Router />
    </AppContextProvider>
  )
}