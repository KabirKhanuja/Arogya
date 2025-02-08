import React, { createContext, FC, PropsWithChildren } from "react";
import AuthenticationService from "./service"

type Screen = "landing" | "login" | "dashboard" | "form";

interface ScreenState {
    screen: Screen;
}

type AppContextType = {
    authService: AuthenticationService;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setUser: (user: UserType) => void;
    user: UserType | null;
    setFormFilled: (formFilled: boolean) => void;
    formFilled: boolean;
}

export const AppContext = createContext<AppContextType>({
    authService: new AuthenticationService(),
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    setUser: () => { },
    user: null,
    formFilled: false,
    setFormFilled: () => { },
})

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<UserType | null>(null);
    const [screenState, setScreenState] = React.useState<ScreenState>({ screen: "landing" });
    const [formFilled, setFormFilled] = React.useState<boolean>(false);
    const authService = new AuthenticationService();
    const defaultContext = {
        authService,
        isLoggedIn,
        setIsLoggedIn,
        setUser,
        user,
        setFormFilled,
        formFilled,
    };

    return (
        <AppContext.Provider value={defaultContext}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext;