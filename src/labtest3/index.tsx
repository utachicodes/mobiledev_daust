import React, { useState, useEffect, useCallback } from 'react';
import {
  View, ScrollView, StyleSheet, Text,
  SafeAreaView, Alert, TouchableOpacity, TextInput,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { storageService } from './services/storage';
import { notificationService } from './services/notifications';
import { backgroundTaskService } from './services/backgroundTask';
import { WorkingHours, WaterLog, DEFAULT_GOAL_ML } from './types';
import WorkingHoursInput from './components/WorkingHoursInput';
import TaskToggle from './components/TaskToggle';
import ProgressRing from './components/ProgressRing';
import DrinkButtons from './components/DrinkButtons';
import WaterLogList from './components/WaterLogList';
import IntervalPicker from './components/IntervalPicker';

export default function LabTest3() {
  const [workingHours, setWorkingHours] = useState<WorkingHours>({ start: 9, end: 17 });
  const [taskEnabled, setTaskEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [dailyGoal, setDailyGoal] = useState(DEFAULT_GOAL_ML);
  const [goalInput, setGoalInput] = useState(String(DEFAULT_GOAL_ML));
  const [interval, setIntervalMinutes] = useState(3);
  const [tab, setTab] = useState<'home' | 'schedule' | 'log'>('home');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [hours, enabled, goal, todayLogs, reminderInterval] = await Promise.all([
          storageService.getWorkingHours(),
          storageService.getTaskEnabled(),
          storageService.getDailyGoal(),
          storageService.getTodayLogs(),
          storageService.getReminderInterval(),
        ]);
        if (!mounted) return;
        setWorkingHours(hours);
        setTaskEnabled(enabled);
        setDailyGoal(goal);
        setGoalInput(String(goal));
        setLogs(todayLogs);
        setIntervalMinutes(reminderInterval);
      } catch (err) {
        console.error('Failed to load state:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    const sub = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      console.log('Notification tapped:', response);
    });

    return () => { mounted = false; sub.remove(); };
  }, []);

  const handleDrink = useCallback(async (ml: number) => {
    const updated = await storageService.addWaterLog(ml);
    setLogs(updated);
    const total = storageService.getTotalIntake(updated);
    if (total >= dailyGoal) {
      Alert.alert('🎉 Goal Reached!', `You've drunk ${total}ml today. Amazing!`);
    }
  }, [dailyGoal]);

  const handleClearLogs = useCallback(() => {
    Alert.alert('Clear Logs', 'Remove all water logs for today?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: async () => {
          await storageService.clearTodayLogs();
          setLogs([]);
        },
      },
    ]);
  }, []);

  const handleSaveGoal = useCallback(async () => {
    const val = parseInt(goalInput, 10);
    if (isNaN(val) || val < 500 || val > 5000) {
      Alert.alert('Invalid', 'Goal must be between 500ml and 5000ml');
      return;
    }
    setDailyGoal(val);
    await storageService.saveDailyGoal(val);
    Alert.alert('Saved', `Daily goal set to ${val}ml`);
  }, [goalInput]);

  const handleIntervalChange = useCallback(async (minutes: number) => {
    setIntervalMinutes(minutes);
    await storageService.saveReminderInterval(minutes);
  }, []);

  const handleSaveWorkingHours = useCallback(async () => {
    await storageService.saveWorkingHours(workingHours);
    Alert.alert('Saved', 'Working hours updated');
  }, [workingHours]);

  const handleTaskToggle = useCallback(async (value: boolean) => {
    setToggleLoading(true);
    setError(null);
    try {
      if (value) {
        const granted = await notificationService.requestPermission();
        if (!granted) { setError('Notification permission denied'); return; }
        await backgroundTaskService.registerTask();
        setTaskEnabled(true);
        await storageService.setTaskEnabled(true);
      } else {
        await backgroundTaskService.unregisterTask();
        setTaskEnabled(false);
        await storageService.setTaskEnabled(false);
      }
    } catch {
      setError('Failed to update reminder settings');
    } finally {
      setToggleLoading(false);
    }
  }, []);

  const total = storageService.getTotalIntake(logs);
  const remaining = Math.max(dailyGoal - total, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingCenter}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>💧 Hydration Tracker</Text>
        <Text style={styles.subtitle}>
          {remaining > 0 ? `${remaining}ml to go` : '🎉 Goal reached!'}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['home', 'schedule', 'log'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'home' ? '🏠 Home' : t === 'schedule' ? '⏰ Schedule' : '📋 Log'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HOME TAB */}
        {tab === 'home' && (
          <View>
            {/* Progress Ring */}
            <View style={styles.ringContainer}>
              <ProgressRing total={total} goal={dailyGoal} />
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{logs.length}</Text>
                <Text style={styles.statLabel}>drinks</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{total}</Text>
                <Text style={styles.statLabel}>ml drunk</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{remaining}</Text>
                <Text style={styles.statLabel}>ml left</Text>
              </View>
            </View>

            {/* Drink Buttons */}
            <DrinkButtons onDrink={handleDrink} />

            {/* Task Toggle */}
            <TaskToggle
              enabled={taskEnabled}
              onToggle={handleTaskToggle}
              loading={toggleLoading}
              error={error}
            />

            {/* Daily Goal */}
            <View style={styles.goalSection}>
              <Text style={styles.sectionTitle}>Daily Goal (ml)</Text>
              <View style={styles.goalRow}>
                <TextInput
                  style={styles.goalInput}
                  value={goalInput}
                  onChangeText={setGoalInput}
                  keyboardType="number-pad"
                  maxLength={4}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveGoal}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* SCHEDULE TAB */}
        {tab === 'schedule' && (
          <View>
            <WorkingHoursInput
              value={workingHours}
              onChange={setWorkingHours}
              onSave={handleSaveWorkingHours}
            />
            <IntervalPicker value={interval} onChange={handleIntervalChange} />
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>ℹ️ How reminders work</Text>
              <Text style={styles.infoText}>
                • Reminders fire every {interval} minute{interval > 1 ? 's' : ''}{'\n'}
                • Only during your working hours ({workingHours.start}:00 – {workingHours.end}:00){'\n'}
                • Enable the toggle on Home to activate{'\n'}
                • Works in the background when app is closed
              </Text>
            </View>
          </View>
        )}

        {/* LOG TAB */}
        {tab === 'log' && (
          <View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Today's Summary</Text>
              <Text style={styles.summaryBig}>{total} / {dailyGoal} ml</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min((total / dailyGoal) * 100, 100)}%` as any }]} />
              </View>
            </View>
            <WaterLogList logs={logs} onClear={handleClearLogs} />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#888', fontSize: 16 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#1565c0' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, backgroundColor: '#f0f4ff', borderRadius: 12, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 12, color: '#888', fontWeight: '600' },
  tabTextActive: { color: '#1565c0' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  ringContainer: { alignItems: 'center', paddingVertical: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, backgroundColor: '#f0f4ff', borderRadius: 12, paddingVertical: 14 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#1565c0' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  goalSection: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 14, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 8 },
  goalRow: { flexDirection: 'row', gap: 10 },
  goalInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#fff' },
  saveBtn: { backgroundColor: '#4A90D9', paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '700' },
  infoBox: { backgroundColor: '#e3f2fd', borderRadius: 12, padding: 16, marginBottom: 16 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#1565c0', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#1565c0', lineHeight: 22 },
  summaryBox: { backgroundColor: '#f0f4ff', borderRadius: 12, padding: 16, marginBottom: 16 },
  summaryTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 6 },
  summaryBig: { fontSize: 26, fontWeight: '800', color: '#1565c0', marginBottom: 10 },
  progressBar: { height: 10, backgroundColor: '#ddd', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4A90D9', borderRadius: 5 },
});
