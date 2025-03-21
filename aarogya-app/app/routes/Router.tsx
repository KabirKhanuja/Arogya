import MainNavigator from "./MainStack"
import AuthNavigator from "./AuthStack"
import React, { useContext } from "react"
import AppContext from "../auth/AuthContext"
import { UserType } from "../types/user";
import Loading from "../components/Loading";
import { initNotifications, schedulePushNotification } from "../utils/NotificationUtils";

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
  

export default function Router() {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const { authService, isLoggedIn, setIsLoggedIn, setUser, user } = useContext(AppContext);

    React.useEffect(() => {
        initNotifications();
    }, [])

    React.useEffect(() => {
        if (isLoggedIn && user) {
            setIsLoading(false);
            return;
        }
        authService.getCurrentUser()
            .then(responseJson => {
                setIsLoading(false);
                console.log("Response from getCurrentUser: ", responseJson);

                if (responseJson) {
                    const _user = responseJson.user;
                    const tuser: UserType = {
                        email: _user.username ? _user.username : _user.email,
                        name: _user.name,
                        id: _user.user_id ? _user.user_id : _user.id,
                        age: _user.age,
                        gender: _user.gender,
                        weight: _user.weight,
                        height: _user.height,
                        doYouSmoke: _user.doYouSmoke,
                        doYouDrink: _user.doYouDrink,
                        problems: _user.problems,
                        medicalHistory: _user.medicalHistory,
                        formFilled: _user.formFilled,
                    };
                    const randomTitle = loginNotifications.titles[Math.floor(Math.random() * loginNotifications.titles.length)];
                    const randomBody = loginNotifications.bodies[Math.floor(Math.random() * loginNotifications.bodies.length)];            
                    schedulePushNotification({
                        title: randomTitle,
                        body: randomBody,
                        data: {},
                        afterSec: 1*60
                    })
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

    if (isLoading) return <Loading />

    return (
        isLoggedIn ? <MainNavigator /> : <AuthNavigator />
    )
}