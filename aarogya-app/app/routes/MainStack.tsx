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
                    paddingTop: 6
                }
            })}>

            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Fitness" component={FitnessScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Chat" component={ChatBotScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />

        </Tab.Navigator>
    );
};

export default MainNavigator;