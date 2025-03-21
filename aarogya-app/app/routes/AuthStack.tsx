import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import LandingScreen from '../screens/Landing';
import { StackNavigationProp } from '@react-navigation/stack';
import UnlockedBadgeScreen from '../screens/UnlockedBadge';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

export type AuthStackParamsList = {
  login: undefined,
  register: undefined,
};

export type AuthStackNavigationProps = StackNavigationProp<AuthStackParamsList>;


const AuthNavigator = () => {
  return (
    <>
      <StatusBar backgroundColor="#F99E16" barStyle="dark-content" />
      <Stack.Navigator>
        <Stack.Screen name="landing-page" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="register" component={RegisterScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </>
  );
};

export default AuthNavigator;