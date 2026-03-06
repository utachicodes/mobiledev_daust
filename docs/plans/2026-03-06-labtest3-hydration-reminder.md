# Lab Test 3: Hydration Reminder Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a React Native hydration reminder app that sends notifications during user-defined working hours via background tasks.

**Architecture:** Single-screen app with three service layers (storage, notifications, background tasks) and two UI components (working hours input, task toggle). Background task runs every 3 minutes, checks if current time is within working hours, and sends notification only if condition is met.

**Tech Stack:** React Native, Expo SDK 54, expo-task-manager, expo-notifications, AsyncStorage, TypeScript

---

## Task 1: Setup Types and Project Structure

**Files:**
- Create: `src/labtest3/types.ts`
- Create: `src/labtest3/services/storage.ts`
- Create: `src/labtest3/services/notifications.ts`
- Create: `src/labtest3/services/backgroundTask.ts`
- Create: `src/labtest3/components/WorkingHoursInput.tsx`
- Create: `src/labtest3/components/TaskToggle.tsx`

**Step 1: Create types.ts with required interfaces**

Create file `src/labtest3/types.ts`:

```typescript
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
```

**Step 2: Commit initial types**

```bash
git add src/labtest3/types.ts
git commit -m "feat(labtest3): add TypeScript types and constants"
```

---

## Task 2: Implement Storage Service

**Files:**
- Create: `src/labtest3/services/storage.ts`

**Step 1: Create storage service**

Create file `src/labtest3/services/storage.ts`:

```typescript
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
```

**Step 2: Commit storage service**

```bash
git add src/labtest3/services/storage.ts
git commit -m "feat(labtest3): implement AsyncStorage service for working hours"
```

---

## Task 3: Implement Notifications Service

**Files:**
- Create: `src/labtest3/services/notifications.ts`

**Step 1: Create notifications service**

Create file `src/labtest3/services/notifications.ts`:

```typescript
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
```

**Step 2: Commit notifications service**

```bash
git add src/labtest3/services/notifications.ts
git commit -m "feat(labtest3): implement notifications service"
```

---

## Task 4: Implement Background Task Service

**Files:**
- Create: `src/labtest3/services/backgroundTask.ts`
- Modify: `app.json` (add plugin if needed)

**Step 1: Create background task service**

Create file `src/labtest3/services/backgroundTask.ts`:

```typescript
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
```

**Step 2: Commit background task service**

```bash
git add src/labtest3/services/backgroundTask.ts
git commit -m "feat(labtest3): implement background task service with task manager"
```

---

## Task 5: Create WorkingHoursInput Component

**Files:**
- Create: `src/labtest3/components/WorkingHoursInput.tsx`

**Step 1: Create time input component**

Create file `src/labtest3/components/WorkingHoursInput.tsx`:

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { WorkingHours } from '../types';

interface Props {
  value: WorkingHours;
  onChange: (hours: WorkingHours) => void;
  onSave: () => void;
}

export default function WorkingHoursInput({ value, onChange, onSave }: Props) {
  const [startInput, setStartInput] = useState(String(value.start));
  const [endInput, setEndInput] = useState(String(value.end));
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const start = parseInt(startInput, 10);
    const end = parseInt(endInput, 10);

    if (isNaN(start) || isNaN(end)) {
      setError('Please enter valid numbers');
      return;
    }

    if (start < 0 || start > 23 || end < 0 || end > 23) {
      setError('Hours must be between 0 and 23');
      return;
    }

    if (end <= start) {
      setError('End time must be after start time');
      return;
    }

    setError(null);
    onChange({ start, end });
    onSave();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Working Hours</Text>

      <View style={styles.inputContainer}>
        <View style={styles.timeField}>
          <Text style={styles.fieldLabel}>Start (24h)</Text>
          <TextInput
            style={styles.input}
            value={startInput}
            onChangeText={setStartInput}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="9"
          />
        </View>

        <Text style={styles.separator}>to</Text>

        <View style={styles.timeField}>
          <Text style={styles.fieldLabel}>End (24h)</Text>
          <TextInput
            style={styles.input}
            value={endInput}
            onChangeText={setEndInput}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="17"
          />
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.displayText}>
        {startInput}:00 - {endInput}:00
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Hours</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  timeField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  separator: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 8,
  },
  displayText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4A90D9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

**Step 2: Commit WorkingHoursInput component**

```bash
git add src/labtest3/components/WorkingHoursInput.tsx
git commit -m "feat(labtest3): add WorkingHoursInput component with validation"
```

---

## Task 6: Create TaskToggle Component

**Files:**
- Create: `src/labtest3/components/TaskToggle.tsx`

**Step 1: Create toggle component**

Create file `src/labtest3/components/TaskToggle.tsx`:

```typescript
import React from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator } from 'react-native';

interface Props {
  enabled: boolean;
  onToggle: (value: boolean) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function TaskToggle({ enabled, onToggle, loading = false, error = null }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Background Reminder</Text>
          <Text style={styles.status}>{enabled ? 'Active' : 'Inactive'}</Text>
        </View>
        <View style={styles.toggleContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#4A90D9" />
          ) : (
            <Switch
              value={enabled}
              onValueChange={onToggle}
              trackColor={{ false: '#767577', true: '#4A90D9' }}
              thumbColor={enabled ? '#fff' : '#f4f3f4'}
            />
          )}
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {enabled && (
        <Text style={styles.info}>
          Reminders will be sent during working hours every 3 minutes.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  toggleContainer: {
    width: 50,
    alignItems: 'center',
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 8,
  },
  info: {
    fontSize: 12,
    color: '#4A90D9',
    marginTop: 8,
    lineHeight: 16,
  },
});
```

**Step 2: Commit TaskToggle component**

```bash
git add src/labtest3/components/TaskToggle.tsx
git commit -m "feat(labtest3): add TaskToggle component for background task control"
```

---

## Task 7: Create Main Screen Component

**Files:**
- Create: `src/labtest3/index.tsx`

**Step 1: Create main component**

Create file `src/labtest3/index.tsx`:

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Text, SafeAreaView, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { storageService } from './services/storage';
import { notificationService } from './services/notifications';
import { backgroundTaskService } from './services/backgroundTask';
import { WorkingHours } from './types';
import WorkingHoursInput from './components/WorkingHoursInput';
import TaskToggle from './components/TaskToggle';

export default function LabTest3() {
  const [workingHours, setWorkingHours] = useState<WorkingHours>({ start: 9, end: 17 });
  const [taskEnabled, setTaskEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial state from storage
  useEffect(() => {
    const loadState = async () => {
      try {
        const [hours, enabled] = await Promise.all([
          storageService.getWorkingHours(),
          storageService.getTaskEnabled(),
        ]);
        setWorkingHours(hours);
        setTaskEnabled(enabled);
      } catch (err) {
        console.error('Failed to load state:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadState();

    // Set notification handler
    const subscription = Notifications.addNotificationResponseListener((response) => {
      console.log('Notification tapped:', response);
    });

    return () => subscription.remove();
  }, []);

  const handleWorkingHoursChange = useCallback((hours: WorkingHours) => {
    setWorkingHours(hours);
  }, []);

  const handleSaveWorkingHours = useCallback(async () => {
    try {
      await storageService.saveWorkingHours(workingHours);
      Alert.alert('Success', 'Working hours saved');
    } catch (err) {
      console.error('Failed to save working hours:', err);
      Alert.alert('Error', 'Failed to save working hours');
    }
  }, [workingHours]);

  const handleTaskToggle = useCallback(
    async (value: boolean) => {
      setToggleLoading(true);
      setError(null);
      try {
        if (value) {
          // Request permissions before enabling
          const notificationPerm = await notificationService.requestPermission();
          if (!notificationPerm) {
            setError('Notification permission denied');
            setToggleLoading(false);
            return;
          }

          // Register background task
          await backgroundTaskService.registerTask();
          setTaskEnabled(true);
          await storageService.setTaskEnabled(true);
          Alert.alert('Success', 'Hydration reminders enabled');
        } else {
          // Unregister background task
          await backgroundTaskService.unregisterTask();
          setTaskEnabled(false);
          await storageService.setTaskEnabled(false);
          Alert.alert('Success', 'Hydration reminders disabled');
        }
      } catch (err) {
        console.error('Failed to toggle task:', err);
        setError('Failed to update reminder settings');
        setToggleLoading(false);
        return;
      }
      setToggleLoading(false);
    },
    []
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Hydration Reminder</Text>

        <TaskToggle
          enabled={taskEnabled}
          onToggle={handleTaskToggle}
          loading={toggleLoading}
          error={error}
        />

        <WorkingHoursInput
          value={workingHours}
          onChange={handleWorkingHoursChange}
          onSave={handleSaveWorkingHours}
        />

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            • Enable the toggle to start receiving reminders{'\n'}
            • Set your working hours{'\n'}
            • You'll get notified every 3 minutes when within working hours{'\n'}
            • Reminders continue even when the app is closed
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  infoSection: {
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    marginTop: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#1565c0',
    lineHeight: 20,
  },
});
```

**Step 2: Commit main component**

```bash
git add src/labtest3/index.tsx
git commit -m "feat(labtest3): create main screen with working hours and task toggle"
```

---

## Task 8: Verify Dependencies and Test

**Files:**
- Check: `package.json`
- Verify: `app.json`

**Step 1: Install expo-task-manager if missing**

Run: `npm list expo-task-manager`

If not present, run: `npm install expo-task-manager`

Then commit:
```bash
git add package.json package-lock.json
git commit -m "fix(labtest3): add expo-task-manager dependency"
```

**Step 2: Test on device/simulator**

Run: `expo start` or `npm run android`

**Expected behavior:**
- App loads with "Hydration Reminder" title
- Toggle is off initially
- Can set working hours
- Toggling on requests notification permission
- Notification appears every 3 minutes during working hours
- Settings persist after app restart

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat(labtest3): complete hydration reminder implementation"
```

---

## Summary

This plan implements a fully functional hydration reminder app with:
- ✅ Background task execution every 3 minutes
- ✅ Working hours checking
- ✅ Local notifications
- ✅ AsyncStorage persistence
- ✅ Permission management
- ✅ Clean service-based architecture
- ✅ Validated input components

Total estimated steps: 8 tasks, ~40 minutes of development
