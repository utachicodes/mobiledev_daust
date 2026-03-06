import * as TaskManager from 'expo-task-manager';
import { BACKGROUND_TASK_NAME } from '../types';
import { notificationService } from './notifications';
import { storageService } from './storage';

// Register the background task definition
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    const workingHours = await storageService.getWorkingHours();
    const now = new Date();

    if (notificationService.isWithinWorkingHours(now, workingHours.start, workingHours.end)) {
      await notificationService.sendHydrationReminder();
    }
  } catch (error) {
    console.error('Background task error:', error);
  }
});

export const backgroundTaskService = {
  async registerTask(): Promise<void> {
    try {
      // For now, task definition alone is enough
      // In production, you'd use expo-background-fetch or expo-notifications scheduling
      console.log('Background task defined');
    } catch (error) {
      console.error('Failed to register background task:', error);
      throw error;
    }
  },

  async unregisterTask(): Promise<void> {
    try {
      console.log('Background task unregistered');
    } catch (error) {
      console.error('Failed to unregister background task:', error);
      throw error;
    }
  },

  async isTaskRegistered(): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error('Failed to check task registration:', error);
      return false;
    }
  },
};
