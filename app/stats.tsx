import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    ScrollView,
    Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function StatsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const steps = parseInt((params.steps as string) ?? '0', 10);
    const goal = parseInt((params.goal as string) ?? '10000', 10);

    const progress = Math.min(steps / goal, 1);
    const percentage = Math.round(progress * 100);

    // Approximations
    const caloriesBurned = Math.round(steps * 0.04);
    const distanceKm = (steps * 0.000762).toFixed(2);
    const activeMinutes = Math.round(steps / 100);

    // Animation
    const slideAnim = React.useRef(new Animated.Value(40)).current;
    const opacityAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const statCards = [
        {
            icon: 'flame',
            color: '#E74C3C',
            bg: '#FDEDEC',
            label: 'Calories Burned',
            value: `${caloriesBurned}`,
            unit: 'kcal',
        },
        {
            icon: 'navigate',
            color: '#3498DB',
            bg: '#EBF5FB',
            label: 'Distance',
            value: distanceKm,
            unit: 'km',
        },
        {
            icon: 'time',
            color: '#8E44AD',
            bg: '#F5EEF8',
            label: 'Active Time',
            value: `${activeMinutes}`,
            unit: 'min',
        },
        {
            icon: 'walk',
            color: '#27AE60',
            bg: '#E8F8EE',
            label: 'Goal',
            value: `${goal.toLocaleString()}`,
            unit: 'steps',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your Stats</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Animated.View
                    style={{ transform: [{ translateY: slideAnim }], opacity: opacityAnim }}
                >
                    {/* Trophy Banner */}
                    <View style={styles.trophy}>
                        <Text style={styles.trophyEmoji}>🏆</Text>
                        <Text style={styles.trophyTitle}>Goal Achieved!</Text>
                        <Text style={styles.trophySubtitle}>
                            You walked {steps.toLocaleString()} steps today. Keep it up!
                        </Text>
                    </View>

                    {/* Progress Ring (simplified bar) */}
                    <View style={styles.progressCard}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressSteps}>{steps.toLocaleString()}</Text>
                            <Text style={styles.progressGoal}>/ {goal.toLocaleString()} steps</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View
                                style={[styles.progressBarFill, { width: `${Math.min(percentage, 100)}%` }]}
                            />
                        </View>
                        <Text style={styles.progressPct}>{percentage}% of daily goal</Text>
                    </View>

                    {/* Stat Cards Grid */}
                    <Text style={styles.sectionTitle}>Activity Details</Text>
                    <View style={styles.grid}>
                        {statCards.map((card) => (
                            <View key={card.label} style={[styles.statCard, { backgroundColor: card.bg }]}>
                                <View style={[styles.statIcon, { backgroundColor: card.color + '22' }]}>
                                    <Ionicons name={card.icon as any} size={22} color={card.color} />
                                </View>
                                <Text style={[styles.statValue, { color: card.color }]}>{card.value}</Text>
                                <Text style={styles.statUnit}>{card.unit}</Text>
                                <Text style={styles.statLabel}>{card.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Motivational message */}
                    <View style={styles.motivationCard}>
                        <Ionicons name="rocket" size={20} color="#8E44AD" />
                        <Text style={styles.motivationText}>
                            {percentage >= 100
                                ? "You crushed your goal today! You're an inspiration! 🌟"
                                : percentage >= 50
                                    ? "Halfway there! Keep pushing, you've got this! 💪"
                                    : "Every step counts. Start small and build up! 🚶"}
                        </Text>
                    </View>

                    {/* Back button */}
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => router.push('/step-counter')}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="refresh" size={20} color="#fff" />
                        <Text style={styles.btnText}>Start New Session</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
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
    content: { padding: 20 },
    trophy: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#F1C40F',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 14,
        elevation: 6,
    },
    trophyEmoji: { fontSize: 56, marginBottom: 8 },
    trophyTitle: { fontSize: 26, fontWeight: '800', color: '#1A1A2E' },
    trophySubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 6, lineHeight: 20 },
    progressCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
    },
    progressHeader: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
    progressSteps: { fontSize: 32, fontWeight: '900', color: '#1A1A2E' },
    progressGoal: { fontSize: 16, color: '#888', marginLeft: 6 },
    progressBarBg: {
        height: 12,
        borderRadius: 6,
        backgroundColor: '#D5F5E3',
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 6,
        backgroundColor: '#27AE60',
    },
    progressPct: { fontSize: 12, color: '#888', textAlign: 'right' },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
    statCard: {
        width: '47%',
        borderRadius: 14,
        padding: 16,
        alignItems: 'flex-start',
    },
    statIcon: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    statValue: { fontSize: 24, fontWeight: '800' },
    statUnit: { fontSize: 12, color: '#888', marginTop: 1 },
    statLabel: { fontSize: 12, color: '#555', marginTop: 4 },
    motivationCard: {
        backgroundColor: '#F5EEF8',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginBottom: 20,
    },
    motivationText: { flex: 1, fontSize: 14, color: '#8E44AD', lineHeight: 20 },
    btn: {
        backgroundColor: '#27AE60',
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#27AE60',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
