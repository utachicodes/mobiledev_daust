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
    const subscription = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
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
