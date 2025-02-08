import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import LandingScreen from '../screens/Landing';
import FormScreen from '../screens/Form';

const Stack = createNativeStackNavigator();

export const AuthStackParamsList = {
  login: undefined,
  register: undefined,
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="landing-page" component={LandingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="form" component={FormScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;