// import { useState, useEffect, useRef } from 'react';
// import { Text, View, Platform, StyleSheet, Button } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getIncompleteExercises, markExerciseCompleted } from './exerciseTracker';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const [notification, setNotification] = useState(null);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log(response);
//     });

//     scheduleDailyMotivationalNotification();
//     checkIncompleteExercises();

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener.current);
//       Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   const handleCompleteExercise = async (exerciseName) => {
//     await markExerciseCompleted(exerciseName);
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Your expo push token: {expoPushToken}</Text>
//       <Button title="Complete Exercise" onPress={() => handleCompleteExercise('Exercise 1')} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// async function scheduleDailyMotivationalNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Stay Active! 💪",
//       body: "Don't forget to complete your exercises today!",
//     },
//     trigger: { hour: 9, minute: 0, repeats: true }, // Daily reminder at 9 AM
//   });
// }

// async function checkIncompleteExercises() {
//   const incompleteExercises = await getIncompleteExercises();
//   if (incompleteExercises.length > 0) {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "You have pending exercises! ⏳",
//         body: `Don't forget to complete: ${incompleteExercises.join(', ')}`,
//       },
//       trigger: { seconds: 5 }, // Show notification immediately
//     });
//   }
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'Daily Reminders',
//       importance: Notifications.AndroidImportance.MAX,
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId })).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   return token;
// }
