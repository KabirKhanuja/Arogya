import Loading from "../components/Loading"
import MainNavigator from "./MainStack"
import AuthNavigator from "./AuthStack"
import React, { useContext } from "react"
import AppContext from "../auth/AuthContext"
import { useNavigation } from "expo-router"

export default Router = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const { authService, isLoggedIn, setIsLoggedIn, setUser, user, formFilled, setFormFilled } = useContext(AppContext);
    const navigation = useNavigation();

    React.useEffect(() => {
        if (isLoggedIn && user) {
            setIsLoading(false);
            return;
        }

        authService.getCurrentUser()
            .then(responseJson => {
                setIsLoading(false);

                if (responseJson) {
                    const _user = responseJson.user;
                    setFormFilled(
                        _user.name !== null && _user.height !== "" && _user.weight !== "" && _user.age !== "" && _user.problem !== ""
                    )
                    setUser({
                        email: _user.username,
                        name: _user.name,
                        id: _user.user_id,
                        age: _user.age,
                        gender: _user.gender,
                        weight: _user.weight,
                        height: _user.height,
                        doYouSmoke: _user.smoking,
                        doYouDrink: _user.drinking,
                        problems: _user.problems,
                        medicalHistory: _user.medicalHistory
                    });

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
        isLoggedIn ? (
            formFilled ? <MainNavigator /> : <AuthNavigator />
        ) : <AuthNavigator />
    )
}