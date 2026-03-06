import * as TaskManager from 'expo-task-manager';
import { BACKGROUND_TASK_NAME, BACKGROUND_TASK_INTERVAL } from '../types';
import { notificationService } from './notifications';
import { storageService } from './storage';

// Register the background task
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    const workingHours = await storageService.getWorkingHours();
    const now = new Date();

    if (notificationService.isWithinWorkingHours(now, workingHours.start, workingHours.end)) {
      await notificationService.sendHydrationReminder();
    }

    return TaskManager.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background task error:', error);
    return TaskManager.BackgroundFetchResult.Failed;
  }
});

export const backgroundTaskService = {
  async registerTask(): Promise<void> {
    try {
      await TaskManager.registerTaskAsync(BACKGROUND_TASK_NAME, {
        minimumInterval: BACKGROUND_TASK_INTERVAL,
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('Background task registered');
    } catch (error) {
      console.error('Failed to register background task:', error);
      throw error;
    }
  },

  async unregisterTask(): Promise<void> {
    try {
      await TaskManager.unregisterTaskAsync(BACKGROUND_TASK_NAME);
      console.log('Background task unregistered');
    } catch (error) {
      console.error('Failed to unregister background task:', error);
      throw error;
    }
  },

  async isTaskRegistered(): Promise<boolean> {
    try {
      const tasks = await TaskManager.getRegisteredTasksAsync();
      return tasks.some((task) => task.taskName === BACKGROUND_TASK_NAME);
    } catch (error) {
      console.error('Failed to check task registration:', error);
      return false;
    }
  },
};
