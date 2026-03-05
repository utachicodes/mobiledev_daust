import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    Platform,
    TextInput,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';
import {
    requestNotificationPermissions,
    sendStepGoalNotification,
} from '../src/exercises/lab10/notificationHelper';

export default function StepCounterScreen() {
    const router = useRouter();
    const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean | null>(null);
    const [currentSteps, setCurrentSteps] = useState(0);
    const [goalInput, setGoalInput] = useState('10000');
    const [goal, setGoal] = useState(10000);
    const [goalReached, setGoalReached] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const subscription = useRef<Pedometer.Subscription | null>(null);
    const simInterval = useRef<NodeJS.Timeout | null>(null);
    // Refs to avoid stale closures inside setInterval/useEffect
    const goalReachedRef = useRef(false);
    const isTrackingRef = useRef(false);
    const currentStepsRef = useRef(0);
    const goalRef = useRef(10000);

    useEffect(() => {
        checkPedometerAvailability();
        return () => {
            subscription.current?.remove();
            if (simInterval.current) clearInterval(simInterval.current);
        };
    }, []);

    useEffect(() => {
        const progress = Math.min(currentSteps / goal, 1);
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 600,
            useNativeDriver: false,
        }).start();

        // Keep refs in sync
        currentStepsRef.current = currentSteps;
        goalRef.current = goal;

        if (currentSteps >= goal && !goalReachedRef.current && isTrackingRef.current) {
            goalReachedRef.current = true;
            setGoalReached(true);
            notifyGoalReached(currentSteps, goal);
        }
    }, [currentSteps, goal]);

    async function checkPedometerAvailability() {
        const available = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(available);
    }

    async function startTracking() {
        const numGoal = parseInt(goalInput, 10);
        if (isNaN(numGoal) || numGoal <= 0) {
            Alert.alert('Invalid Goal', 'Please enter a valid step goal (e.g. 10000).');
            return;
        }

        const granted = await requestNotificationPermissions();
        if (!granted) {
            Alert.alert('Permission Required', 'Notification permission is needed to alert you when you reach your goal.');
        }

        setGoal(numGoal);
        setGoalReached(false);
        goalReachedRef.current = false;
        setCurrentSteps(0);
        currentStepsRef.current = 0;
        goalRef.current = numGoal;
        setIsTracking(true);
        isTrackingRef.current = true;

        if (isPedometerAvailable) {
            // Subscribe to live step updates
            subscription.current = Pedometer.watchStepCount((result) => {
                setCurrentSteps(result.steps);
            });
        } else {
            // Simulator-friendly: simulate step increments
            simulateSteps(numGoal);
        }
    }

    function stopTracking() {
        subscription.current?.remove();
        subscription.current = null;
        if (simInterval.current) {
            clearInterval(simInterval.current);
            simInterval.current = null;
        }
        isTrackingRef.current = false;
        setIsTracking(false);
    }

    function simulateSteps(numGoal: number) {
        // For simulators: simulate 1 step every 200ms to demonstrate functionality
        let simSteps = 0;
        simInterval.current = setInterval(() => {
            simSteps += Math.floor(Math.random() * 5) + 1;
            setCurrentSteps(simSteps);
            if (simSteps >= numGoal) {
                if (simInterval.current) clearInterval(simInterval.current);
                simInterval.current = null;
            }
        }, 200);
    }

    async function notifyGoalReached(steps: number, goalValue: number) {
        try {
            await sendStepGoalNotification(steps, goalValue);
        } catch (e) {
            console.log('Notification error:', e);
        }
        Alert.alert(
            '🏆 Goal Reached!',
            `Amazing! You've reached ${goalValue.toLocaleString()} steps!`,
            [
                {
                    text: 'View Stats',
                    onPress: () =>
                        router.push({
                            pathname: '/stats',
                            params: { steps: steps.toString(), goal: goalValue.toString() },
                        }),
                },
                { text: 'Keep Going!', style: 'cancel' },
            ]
        );
    }

    const progress = Math.min(currentSteps / goal, 1);
    const percentage = Math.round(progress * 100);
    const remaining = Math.max(goal - currentSteps, 0);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Step Counter</Text>
            </View>

            <View style={styles.content}>
                {/* Availability Banner */}
                {isPedometerAvailable === false && (
                    <View style={styles.simBanner}>
                        <Ionicons name="phone-portrait-outline" size={16} color="#E67E22" />
                        <Text style={styles.simText}>
                            Pedometer not available – running in simulation mode.
                        </Text>
                    </View>
                )}

                {/* Step Circle */}
                <View style={styles.circleWrapper}>
                    <View style={[styles.circle, goalReached && styles.circleSuccess]}>
                        <Text style={styles.stepCount}>{currentSteps.toLocaleString()}</Text>
                        <Text style={styles.stepLabel}>steps</Text>
                        {goalReached && <Ionicons name="trophy" size={24} color="#F1C40F" style={{ marginTop: 6 }} />}
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Progress</Text>
                        <Text style={styles.progressPercent}>{percentage}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                { width: progressWidth },
                                goalReached && styles.progressBarSuccess,
                            ]}
                        />
                    </View>
                    <Text style={styles.progressRemaining}>
                        {goalReached ? '🎉 Goal reached!' : `${remaining.toLocaleString()} steps remaining`}
                    </Text>
                </View>

                {/* Goal Input */}
                {!isTracking && (
                    <View style={styles.goalSection}>
                        <Text style={styles.goalLabel}>Daily Step Goal</Text>
                        <View style={styles.goalInputRow}>
                            <Ionicons name="footsteps" size={20} color="#27AE60" />
                            <TextInput
                                style={styles.goalInput}
                                value={goalInput}
                                onChangeText={setGoalInput}
                                keyboardType="numeric"
                                placeholder="Enter goal"
                                maxLength={6}
                            />
                            <Text style={styles.goalUnit}>steps</Text>
                        </View>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                    {!isTracking ? (
                        <TouchableOpacity style={styles.startBtn} onPress={startTracking} activeOpacity={0.85}>
                            <Ionicons name="play" size={20} color="#fff" />
                            <Text style={styles.startBtnText}>Start Tracking</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.stopBtn} onPress={stopTracking} activeOpacity={0.85}>
                                <Ionicons name="stop" size={20} color="#E74C3C" />
                                <Text style={styles.stopBtnText}>Stop</Text>
                            </TouchableOpacity>
                            {currentSteps > 0 && (
                                <TouchableOpacity
                                    style={styles.statsBtn}
                                    onPress={() => router.push({ pathname: '/stats', params: { steps: currentSteps.toString(), goal: goal.toString() } })}
                                    activeOpacity={0.85}
                                >
                                    <Ionicons name="bar-chart" size={20} color="#fff" />
                                    <Text style={styles.statsBtnText}>View Stats</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F8F4' },
    header: {
        backgroundColor: '#27AE60',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 40 : 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    backBtn: { marginRight: 12 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
    content: { flex: 1, padding: 20 },
    simBanner: {
        backgroundColor: '#FEF3E2',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    simText: { fontSize: 12, color: '#E67E22', flex: 1 },
    circleWrapper: { alignItems: 'center', marginVertical: 20 },
    circle: {
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 6,
        borderColor: '#27AE60',
        shadowColor: '#27AE60',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 14,
        elevation: 8,
    },
    circleSuccess: {
        borderColor: '#F1C40F',
        shadowColor: '#F1C40F',
    },
    stepCount: { fontSize: 38, fontWeight: '900', color: '#1A1A2E' },
    stepLabel: { fontSize: 14, color: '#888', fontWeight: '500' },
    progressSection: { marginBottom: 20 },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
    progressPercent: { fontSize: 14, fontWeight: '700', color: '#27AE60' },
    progressBarBg: {
        height: 14,
        borderRadius: 7,
        backgroundColor: '#D5F5E3',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 7,
        backgroundColor: '#27AE60',
    },
    progressBarSuccess: { backgroundColor: '#F1C40F' },
    progressRemaining: { fontSize: 12, color: '#888', marginTop: 6, textAlign: 'right' },
    goalSection: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    goalLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 10 },
    goalInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    goalInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A2E',
    },
    goalUnit: { fontSize: 14, color: '#888' },
    buttonRow: { flexDirection: 'row', gap: 12 },
    startBtn: {
        flex: 1,
        backgroundColor: '#27AE60',
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#27AE60',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    startBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
    stopBtn: {
        flex: 1,
        backgroundColor: '#FDE8E8',
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1.5,
        borderColor: '#E74C3C',
    },
    stopBtnText: { fontSize: 16, fontWeight: '700', color: '#E74C3C' },
    statsBtn: {
        flex: 1,
        backgroundColor: '#27AE60',
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#27AE60',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    statsBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
