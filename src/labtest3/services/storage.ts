import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, WorkingHours, WaterLog, DEFAULT_GOAL_ML, DEFAULT_INTERVAL_MINUTES } from '../types';

const DEFAULT_WORKING_HOURS: WorkingHours = { start: 9, end: 17 };

const todayKey = () => new Date().toISOString().split('T')[0];

export const storageService = {
  async getWorkingHours(): Promise<WorkingHours> {
    try {
      const [start, end] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.WORKING_HOURS_START),
        AsyncStorage.getItem(STORAGE_KEYS.WORKING_HOURS_END),
      ]);
      if (start !== null && end !== null) {
        return { start: parseInt(start, 10), end: parseInt(end, 10) };
      }
      return DEFAULT_WORKING_HOURS;
    } catch {
      return DEFAULT_WORKING_HOURS;
    }
  },

  async saveWorkingHours(hours: WorkingHours): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.WORKING_HOURS_START, String(hours.start)),
      AsyncStorage.setItem(STORAGE_KEYS.WORKING_HOURS_END, String(hours.end)),
    ]);
  },

  async getTaskEnabled(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.TASK_ENABLED);
      return val === 'true';
    } catch {
      return false;
    }
  },

  async setTaskEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.TASK_ENABLED, String(enabled));
  },

  async getDailyGoal(): Promise<number> {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_GOAL);
      return val ? parseInt(val, 10) : DEFAULT_GOAL_ML;
    } catch {
      return DEFAULT_GOAL_ML;
    }
  },

  async saveDailyGoal(goal: number): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_GOAL, String(goal));
  },

  async getReminderInterval(): Promise<number> {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.REMINDER_INTERVAL);
      return val ? parseInt(val, 10) : DEFAULT_INTERVAL_MINUTES;
    } catch {
      return DEFAULT_INTERVAL_MINUTES;
    }
  },

  async saveReminderInterval(minutes: number): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.REMINDER_INTERVAL, String(minutes));
  },

  async getTodayLogs(): Promise<WaterLog[]> {
    try {
      const key = `${STORAGE_KEYS.WATER_LOGS}_${todayKey()}`;
      const val = await AsyncStorage.getItem(key);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  },

  async addWaterLog(amount: number): Promise<WaterLog[]> {
    const logs = await storageService.getTodayLogs();
    const newLog: WaterLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      amount,
    };
    const updated = [...logs, newLog];
    const key = `${STORAGE_KEYS.WATER_LOGS}_${todayKey()}`;
    await AsyncStorage.setItem(key, JSON.stringify(updated));
    return updated;
  },

  async clearTodayLogs(): Promise<void> {
    const key = `${STORAGE_KEYS.WATER_LOGS}_${todayKey()}`;
    await AsyncStorage.removeItem(key);
  },

  getTotalIntake(logs: WaterLog[]): number {
    return logs.reduce((sum, l) => sum + l.amount, 0);
  },
};
