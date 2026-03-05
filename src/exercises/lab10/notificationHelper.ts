import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// REQUIRED: This tells expo-notifications what to do when a notification
// is received while the app is foregrounded (show it!)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Requests notification permissions.
 * Returns true if permissions are granted.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
        // Physical device required for push notifications; local notifications work in emulator too
        // but let's proceed anyway
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#4A90D9',
        });
    }

    return finalStatus === 'granted';
}

/**
 * Schedule a repeating water reminder notification.
 * @param intervalSeconds - interval in seconds between reminders (minimum 60s for repeating)
 * @returns notification identifier
 */
export async function scheduleWaterReminder(intervalSeconds: number): Promise<string> {
    // Note: Expo/iOS require at least 60 seconds for repeating intervals
    if (intervalSeconds < 60) {
        console.warn('Repeating interval should be at least 60 seconds.');
    }
    // Cancel existing water reminders first
    await cancelWaterReminders();

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: '💧 Time to Drink Water!',
            body: 'Stay hydrated! Have a glass of water now.',
            sound: true,
            data: { screen: 'water-reminder' },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: intervalSeconds,
            repeats: true,
        },
    });
    return id;
}

/**
 * Cancel all scheduled water reminder notifications.
 */
export async function cancelWaterReminders(): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
        if (notif.content.data?.screen === 'water-reminder') {
            await Notifications.cancelScheduledNotificationAsync(notif.identifier);
        }
    }
}

/**
 * Send an immediate local notification for reaching a step goal.
 */
export async function sendStepGoalNotification(steps: number, goal: number): Promise<void> {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🏆 Goal Reached!',
            body: `Congrats! You've reached your daily goal of ${goal.toLocaleString()} steps!`,
            sound: true,
            data: { screen: 'stats', steps: steps.toString(), goal: goal.toString() },
        },
        trigger: null, // immediate
    });
}
