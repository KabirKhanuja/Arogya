import React, { createContext, FC, PropsWithChildren } from "react";
import AuthenticationService from "./service"
import getUserMain from "../utils/UsersDB";

type AppContextType = {
    authService: AuthenticationService;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setUser: (user: UserType) => void;
    user: UserType | null;
}

export const AppContext = createContext<AppContextType>({
    authService: new AuthenticationService(),
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    setUser: () => { },
    user: null,
})

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
    const _user = getUserMain();
    // const [user, setUser] = React.useState<UserType | null>(null);
    const [user, setUser] = React.useState<UserType | null>(_user);
    const authService = new AuthenticationService();
    const defaultContext = {
        authService,
        isLoggedIn,
        setIsLoggedIn,
        setUser,
        user,
    };

    return (
        <AppContext.Provider value={defaultContext}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext;