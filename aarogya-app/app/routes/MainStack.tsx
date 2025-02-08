import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import HomeScreen from '../screens/Home';
import FitnessScreen from '../screens/Fitness';
import ChatBotScreen from '../screens/ChatBot';
import ProfileScreen from '../screens/Profile';
import CountdownScreen from '../screens/Countdown';
import SettingsScreen from '../screens/Settings';
import FormScreen from '../screens/Form';
import CameraScreen from '../screens/CameraScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppContext from '../auth/AuthContext';

const Stack = createNativeStackNavigator();

export const MainStackParamsList = {
    home: undefined,
    fitness: undefined,
    chat: undefined,
    profile: undefined,
    camera: undefined,
};

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="form" component={FormScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainTabs" component={MainTabsNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Countdown" component={CountdownScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, headerTitle: "Settings" }} />
            <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
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