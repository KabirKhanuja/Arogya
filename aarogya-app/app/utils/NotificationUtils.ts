import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

const initNotifications = async () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });
    await registerForPushNotificationsAsync();
};

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    try {
        // if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            console.log(
                "WARN: Failed to get push token for push notification!"
            );
            return;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid

        if (Constants.easConfig?.projectId) {
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId: Constants.easConfig.projectId,
                })
            ).data;
            console.log(token);
        }
    } catch (error) {}
    return token;
}

async function schedulePushNotification({
    title,
    body,
    data,
    afterSec,
}: {
    title: string;
    body: string;
    data: any;
    afterSec: number;
}) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            data: data,
        },
        trigger: {
            seconds: afterSec,
            repeats: false,
        },
    });
}

export { initNotifications, schedulePushNotification };
