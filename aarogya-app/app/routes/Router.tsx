import MainNavigator from "./MainStack"
import AuthNavigator from "./AuthStack"
import React, { useContext } from "react"
import AppContext from "../auth/AuthContext"
import { UserType } from "../types/user";

export default function Router() {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const { authService, isLoggedIn, setIsLoggedIn, setUser, user } = useContext(AppContext);

    React.useEffect(() => {
        if (isLoggedIn && user) {
            setIsLoading(false);
            return;
        }
        authService.getCurrentUser()
            .then(responseJson => {
                console.log("Response from getCurrentUser: ", responseJson);

                setIsLoading(false);
                if (responseJson) {
                    const _user = responseJson.user;
                    const tuser: UserType = {
                        email: _user.username,
                        name: _user.name,
                        id: _user.user_id,
                        age: _user.age,
                        gender: _user.gender,
                        weight: _user.weight,
                        height: _user.height,
                        doYouSmoke: _user.doYouSmoke,
                        doYouDrink: _user.doYouDrink,
                        problems: _user.problems,
                        medicalHistory: _user.medicalHistory
                    };
                    setUser(tuser);
                    setIsLoggedIn(true);
                    return;
                }
                setUser(null);
                setIsLoggedIn(false);
            })
            .catch(err => {
                setUser(null);
                setIsLoading(false);
                setIsLoggedIn(false);
            });
    }, [authService, isLoggedIn, setIsLoggedIn, setUser, user]);

    return (
        isLoggedIn ? <MainNavigator /> : <AuthNavigator />
    )
}