export interface WorkingHours {
  start: number;
  end: number;
}

export interface TaskState {
  enabled: boolean;
  workingHours: WorkingHours;
}

export const STORAGE_KEYS = {
  WORKING_HOURS_START: 'hydration_working_hours_start',
  WORKING_HOURS_END: 'hydration_working_hours_end',
  TASK_ENABLED: 'hydration_task_enabled',
} as const;

export const BACKGROUND_TASK_NAME = 'hydration-reminder-task';
export const BACKGROUND_TASK_INTERVAL = 3 * 60; // 3 minutes in seconds
