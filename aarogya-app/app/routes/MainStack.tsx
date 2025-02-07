import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/Home';
import FitnessScreen from '../screens/Fitness';
import ChatBotScreen from '../screens/ChatBot';
import ProfileScreen from '../screens/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

export const MainStackParamsList = {
    home: undefined,
    chat: undefined,
};

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName='home'
            screenOptions={(route) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;
                    let routeName = route.route.name;
                    switch (routeName) {
                        case 'home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'fitness':
                            iconName = focused ? 'heart' : 'heart-outline';
                            break;
                        case 'profile':
                            iconName = focused ? 'person-circle' : 'person-circle-outline';
                            break;
                        case 'chat':
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
                    paddingTop: 6
                }
            })}>

            <Tab.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="fitness" component={FitnessScreen} options={{ headerShown: false }} />
            <Tab.Screen name="chat" component={ChatBotScreen} options={{ headerShown: false }} />
            <Tab.Screen name="profile" component={ProfileScreen} options={{ headerShown: false }} />

        </Tab.Navigator>
    );
};

export default MainNavigator;