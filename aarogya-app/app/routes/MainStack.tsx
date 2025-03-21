import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import HomeScreen from '../screens/Home';
import FitnessScreen from '../screens/Fitness';
import ChatBotScreen from '../screens/ChatBot';
import ProfileScreen from '../screens/Profile';
import CountdownScreen from '../screens/Countdown';
import SettingsScreen from '../screens/Settings';
import FormScreen from '../screens/Form';
import Exercising5 from '../screens/Exercising5';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ScoreProvider } from '../context/ScoreContext';
import { StackNavigationProp } from "@react-navigation/stack";
import AppContext from '../auth/AuthContext';
import GeneratingRoadmapScreen from '../screens/GeneratingRoadmap';
import { Keyboard, StatusBar } from 'react-native';
import UnlockedBadgeScreen from '../screens/UnlockedBadge';

const Stack = createNativeStackNavigator();

export type MainStackParamsList = {
    camera: undefined,
    form: {
        force: boolean;
    },
    GeneratingRoadmap: {
        force: boolean;
    },
    BadgesUnlocked: undefined,
    MainTabs: undefined,
    Countdown: {
        exerciseName: string;
    },
    Settings: undefined,
    Exercising5: undefined,
};

export type MainStackTabsParamsList = {
    Home: undefined,
    Fitness: undefined,
    Chat: undefined,
    Profile: undefined,
};

export type MainStackNavigationProps = StackNavigationProp<MainStackParamsList>;


const Tab = createBottomTabNavigator();

const MainNavigator = () => {
    const { user } = useContext(AppContext);

    return (
        <ScoreProvider>
            <Stack.Navigator initialRouteName={user?.formFilled ? "MainTabs" : "form"}>
                <Stack.Screen name="form" component={FormScreen} options={{ headerShown: false }} />
                <Stack.Screen name="GeneratingRoadmap" component={GeneratingRoadmapScreen} options={{ headerShown: false }} />
                <Stack.Screen name="BadgesUnlocked" component={UnlockedBadgeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MainTabs" component={MainTabsNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="Countdown" component={CountdownScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, headerTitle: "Settings" }} />
                <Stack.Screen name="Exercising5" component={Exercising5} options={{ headerShown: false }} />
            </Stack.Navigator>
        </ScoreProvider>
    )
}
const MainTabsNavigator = () => {
    // Hides the bottom navigation bar when the keyboard is open
    const [tabBarVisible, setTabBarVisible] = React.useState(true);

    React.useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setTabBarVisible(false));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setTabBarVisible(true));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);
    return (
        <>
            <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
            <Tab.Navigator
                initialRouteName='Home'
                screenOptions={(route) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName: any;
                        let routeName = route.route.name;
                        switch (routeName) {
                            case 'Home':
                                iconName = focused ? 'home' : 'home-outline';
                                break;
                            case 'Fitness':
                                iconName = focused ? 'heart' : 'heart-outline';
                                break;
                            case 'Profile':
                                iconName = focused ? 'person-circle' : 'person-circle-outline';
                                break;
                            case 'Chat':
                                iconName = focused ? 'chatbox' : 'chatbox-outline';
                                break;
                            default:
                                iconName = 'home';
                                break;
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },


                    tabBarStyle: tabBarVisible ? {
                        height: 68,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: "#F5F0E5",
                        paddingTop: 6,
                    } : { display: 'none' },

                })}>

                <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Fitness" component={FitnessScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Chat" component={ChatBotScreen} options={{ headerShown: true, headerTitle: "Arogya Assistant" }} />
                <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />

            </Tab.Navigator>
        </>
    );
};

export default MainNavigator;