import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    ActivityIndicator,
    Switch,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    requestNotificationPermissions,
    scheduleWaterReminder,
    cancelWaterReminders,
} from '../src/exercises/lab10/notificationHelper';

const INTERVAL_OPTIONS = [
    { label: '3 minutes (test)', value: 3 * 60 },
    { label: '15 minutes', value: 15 * 60 },
    { label: '30 minutes', value: 30 * 60 },
    { label: '1 hour', value: 60 * 60 },
    { label: '2 hours', value: 2 * 60 * 60 },
];

export default function WaterReminderScreen() {
    const router = useRouter();
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedInterval, setSelectedInterval] = useState(INTERVAL_OPTIONS[0]);
    const [loading, setLoading] = useState(false);

    async function toggleReminder(value: boolean) {
        setLoading(true);
        if (value) {
            const granted = await requestNotificationPermissions();
            if (!granted) {
                Alert.alert(
                    'Permission Required',
                    'Please enable notification permissions in your device settings to use this feature.'
                );
                setLoading(false);
                return;
            }
            try {
                await scheduleWaterReminder(selectedInterval.value);
                setIsEnabled(true);
                Alert.alert(
                    '✅ Reminder Set!',
                    `You will be reminded to drink water every ${selectedInterval.label}.`
                );
            } catch (e) {
                Alert.alert('Error', 'Could not schedule reminder. Please try again.');
            }
        } else {
            await cancelWaterReminders();
            setIsEnabled(false);
            Alert.alert('❌ Reminder Cancelled', 'Water reminders have been turned off.');
        }
        setLoading(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Water Reminder</Text>
            </View>

            <View style={styles.content}>
                {/* Hero */}
                <View style={styles.hero}>
                    <View style={styles.heroIcon}>
                        <Ionicons name="water" size={52} color="#4A90D9" />
                    </View>
                    <Text style={styles.heroTitle}>Stay Hydrated!</Text>
                    <Text style={styles.heroSubtitle}>
                        Set reminders to drink water throughout the day. Staying hydrated improves focus and energy.
                    </Text>
                </View>

                {/* Interval Selector */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reminder Interval</Text>
                    {INTERVAL_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.option,
                                selectedInterval.value === option.value && styles.optionSelected,
                            ]}
                            onPress={() => setSelectedInterval(option)}
                            disabled={isEnabled}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    selectedInterval.value === option.value && styles.optionTextSelected,
                                ]}
                            >
                                {option.label}
                            </Text>
                            {selectedInterval.value === option.value && (
                                <Ionicons name="checkmark-circle" size={20} color="#4A90D9" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Toggle */}
                <View style={styles.toggleRow}>
                    <View>
                        <Text style={styles.toggleLabel}>Enable Reminders</Text>
                        <Text style={styles.toggleSub}>
                            {isEnabled ? `Active – every ${selectedInterval.label}` : 'Tap to activate'}
                        </Text>
                    </View>
                    {loading ? (
                        <ActivityIndicator color="#4A90D9" />
                    ) : (
                        <Switch
                            value={isEnabled}
                            onValueChange={toggleReminder}
                            trackColor={{ false: '#ccc', true: '#4A90D9' }}
                            thumbColor={isEnabled ? '#fff' : '#fff'}
                        />
                    )}
                </View>

                {isEnabled && (
                    <View style={styles.activeCard}>
                        <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
                        <Text style={styles.activeText}>
                            Reminders are active. You'll be notified when the app is in the background too!
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    header: {
        backgroundColor: '#4A90D9',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 40 : 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    backBtn: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 28,
    },
    heroIcon: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#E8F4FD',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A2E',
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 6,
        paddingHorizontal: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 10,
    },
    option: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    optionSelected: {
        borderColor: '#4A90D9',
        backgroundColor: '#EBF4FF',
    },
    optionText: {
        fontSize: 15,
        color: '#333',
    },
    optionTextSelected: {
        color: '#4A90D9',
        fontWeight: '600',
    },
    toggleRow: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    toggleSub: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    activeCard: {
        backgroundColor: '#E8F8EE',
        borderRadius: 10,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    activeText: {
        fontSize: 13,
        color: '#27AE60',
        flex: 1,
        lineHeight: 18,
    },
});
