import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ReminderScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Animation
    const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
    const opacityAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 80,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const tips = [
        'Start your day with a full glass of water.',
        'Keep a water bottle at your desk.',
        'Drink a glass before every meal.',
        'Flavor your water with lemon or cucumber.',
        'Drink water before, during, and after exercise.',
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reminder</Text>
            </View>

            <View style={styles.content}>
                <Animated.View
                    style={[
                        styles.card,
                        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
                    ]}
                >
                    {/* Icon */}
                    <View style={styles.iconWrapper}>
                        <Text style={styles.iconEmoji}>💧</Text>
                    </View>

                    <Text style={styles.message}>Time to Drink Water!</Text>
                    <Text style={styles.submessage}>
                        Your body is about 60% water. Staying hydrated is essential for your health and well-being.
                    </Text>

                    {/* Tip box */}
                    <View style={styles.tipBox}>
                        <Ionicons name="bulb-outline" size={18} color="#4A90D9" />
                        <Text style={styles.tipText}>{randomTip}</Text>
                    </View>

                    {/* Stats row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>8</Text>
                            <Text style={styles.statLabel}>Glasses / day</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>2L</Text>
                            <Text style={styles.statLabel}>Recommended</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>250ml</Text>
                            <Text style={styles.statLabel}>Per glass</Text>
                        </View>
                    </View>
                </Animated.View>

                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => router.push('/water-reminder')}
                    activeOpacity={0.85}
                >
                    <Ionicons name="settings-outline" size={20} color="#fff" />
                    <Text style={styles.btnText}>Manage Reminders</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBF4FF',
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
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        shadowColor: '#4A90D9',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 20,
    },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EBF4FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    iconEmoji: {
        fontSize: 52,
    },
    message: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1A1A2E',
        textAlign: 'center',
    },
    submessage: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    tipBox: {
        backgroundColor: '#EBF4FF',
        borderRadius: 10,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        width: '100%',
        marginBottom: 24,
    },
    tipText: {
        flex: 1,
        fontSize: 13,
        color: '#4A90D9',
        lineHeight: 18,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#4A90D9',
    },
    statLabel: {
        fontSize: 11,
        color: '#999',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E0E0E0',
    },
    btn: {
        backgroundColor: '#4A90D9',
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#4A90D9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
