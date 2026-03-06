import * as Notifications from 'expo-notifications';

export const notificationService = {
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  },

  async sendHydrationReminder(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to Drink Water!',
          body: 'Stay hydrated! Have some water now.',
          sound: true,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  },

  isWithinWorkingHours(now: Date, startHour: number, endHour: number): boolean {
    const currentHour = now.getHours();
    return currentHour >= startHour && currentHour < endHour;
  },
};
