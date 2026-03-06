export interface WorkingHours {
  start: number;
  end: number;
}

export interface TaskState {
  enabled: boolean;
  workingHours: WorkingHours;
}

export interface WaterLog {
  id: string;
  timestamp: number;
  amount: number; // ml
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  logs: WaterLog[];
  goal: number; // ml
}

export const STORAGE_KEYS = {
  WORKING_HOURS_START: 'hydration_working_hours_start',
  WORKING_HOURS_END: 'hydration_working_hours_end',
  TASK_ENABLED: 'hydration_task_enabled',
  DAILY_GOAL: 'hydration_daily_goal',
  WATER_LOGS: 'hydration_water_logs',
  REMINDER_INTERVAL: 'hydration_reminder_interval',
} as const;

export const BACKGROUND_TASK_NAME = 'hydration-reminder-task';
export const DEFAULT_GOAL_ML = 2000;
export const DEFAULT_INTERVAL_MINUTES = 3;
export const GLASS_SIZES = [150, 200, 250, 350, 500];
