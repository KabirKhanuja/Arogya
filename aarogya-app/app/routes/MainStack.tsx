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

const Stack = createNativeStackNavigator();

export type MainStackParamsList = {
    camera: undefined,
    form: undefined,
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
    return (
        <ScoreProvider>
            <Stack.Navigator>
                <Stack.Screen name="form" component={FormScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MainTabs" component={MainTabsNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="Countdown" component={CountdownScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, headerTitle: "Settings" }} />
                <Stack.Screen name="Exercising5" component={Exercising5} options={{ headerShown: false }} />
            </Stack.Navigator>
        </ScoreProvider>
    )
}
const MainTabsNavigator = () => {
    return (
        <>
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
                    tabBarStyle: {
                        height: 68,
                        alignItems: 'center',
                        alignContent: 'center',
                        justifyContent: 'center',
                        backgroundColor: "#F5F0E5",
                        paddingTop: 6
                    }
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