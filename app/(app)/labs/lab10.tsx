import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Lab10Screen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Ionicons name="notifications" size={48} color="#4A90D9" />
                    <Text style={styles.title}>Lab 10</Text>
                    <Text style={styles.subtitle}>Local Notifications</Text>
                </View>

                <TouchableOpacity
                    style={[styles.card, { borderLeftColor: '#4A90D9' }]}
                    onPress={() => router.push('/water-reminder')}
                    activeOpacity={0.8}
                >
                    <View style={styles.cardIcon}>
                        <Ionicons name="water" size={28} color="#4A90D9" />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>Exercise 1: Water Reminder</Text>
                        <Text style={styles.cardDesc}>
                            Schedule recurring notifications to remind you to drink water.
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { borderLeftColor: '#27AE60' }]}
                    onPress={() => router.push('/step-counter')}
                    activeOpacity={0.8}
                >
                    <View style={styles.cardIcon}>
                        <Ionicons name="footsteps" size={28} color="#27AE60" />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>Exercise 2: Step Counter</Text>
                        <Text style={styles.cardDesc}>
                            Set a daily step goal and get notified when you reach it.
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    content: {
        padding: 24,
        paddingTop: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1A1A2E',
        marginTop: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F0F4F8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
});
