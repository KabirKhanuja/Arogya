import Loading from "../components/Loading"
import MainNavigator from "./MainStack"
import AuthNavigator from "./AuthStack"
import React, { useContext } from "react"
import AppContext, { AppContextProvider } from "../auth/AuthContext"

export default Router = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    // const [user, setUser] = React.useState(null);
    const { authService, isLoggedIn, setIsLoggedIn,setUser, user } = useContext(AppContext);

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
                    setUser({
                        email: _user.username,
                        name: _user.name,
                        id: _user.user_id,
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

    if (isLoading) {
        return <Loading />;
    }

    return (
        isLoggedIn ? <MainNavigator /> : <AuthNavigator />
    )
}