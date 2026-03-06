import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, WorkingHours } from '../types';

const DEFAULT_WORKING_HOURS: WorkingHours = {
  start: 9,
  end: 17,
};

export const storageService = {
  async getWorkingHours(): Promise<WorkingHours> {
    try {
      const [start, end] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.WORKING_HOURS_START),
        AsyncStorage.getItem(STORAGE_KEYS.WORKING_HOURS_END),
      ]);

      if (start !== null && end !== null) {
        return {
          start: parseInt(start, 10),
          end: parseInt(end, 10),
        };
      }
      return DEFAULT_WORKING_HOURS;
    } catch (error) {
      console.error('Failed to get working hours:', error);
      return DEFAULT_WORKING_HOURS;
    }
  },

  async saveWorkingHours(hours: WorkingHours): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.WORKING_HOURS_START, String(hours.start)),
        AsyncStorage.setItem(STORAGE_KEYS.WORKING_HOURS_END, String(hours.end)),
      ]);
    } catch (error) {
      console.error('Failed to save working hours:', error);
      throw error;
    }
  },

  async getTaskEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.TASK_ENABLED);
      return enabled === 'true';
    } catch (error) {
      console.error('Failed to get task enabled state:', error);
      return false;
    }
  },

  async setTaskEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASK_ENABLED, String(enabled));
    } catch (error) {
      console.error('Failed to set task enabled state:', error);
      throw error;
    }
  },
};
