import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/exercises/common/ThemeContext';
import { useAuth } from '../../src/exercises/lab5/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
    const { colors } = useTheme();
    const { user, logout } = useAuth();
    const router = useRouter();

    const labs = [
        { title: 'Lab 1: User Profiles', icon: 'person', route: '/(app)/labs/lab1' },
        { title: 'Lab 2: State & Lists', icon: 'list', route: '/(app)/labs/lab2' },
        { title: 'Lab 3: Props & Events', icon: 'cloudy', route: '/(app)/labs/lab3' },
        { title: 'Lab 4: Lifecycle', icon: 'flask', route: '/(app)/labs/lab4' },
        { title: 'Lab 5: Context & Auth', icon: 'lock-closed', route: '/(app)/labs/lab5' },
        { title: 'Lab 6: Tic-Tac-Toe', icon: 'grid', route: '/(app)/labs/lab6' },
        { title: 'Lab Test 3: Hydration Reminder', icon: 'water', route: '/(app)/labs/labtest3' },
        { title: 'Test 1: Project Submission', icon: 'checkmark-circle', route: '/(app)/test1' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: colors.text }]}>Welcome,</Text>
                    <Text style={[styles.userName, { color: colors.primary }]}>{user?.username}!</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => router.push('/settings')}
                        style={[styles.logoutBtn, { backgroundColor: colors.card, marginRight: 10 }]}
                    >
                        <Ionicons name="settings-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout} style={[styles.logoutBtn, { backgroundColor: colors.card }]}>
                        <Ionicons name="log-out-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.grid}>
                {labs.map((lab, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.card, { backgroundColor: colors.card }]}
                        onPress={() => router.push(lab.route)}
                    >
                        <Ionicons name={lab.icon as any} size={32} color={colors.primary} />
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{lab.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
    },
    greeting: {
        fontSize: 18,
        opacity: 0.7,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutBtn: {
        padding: 10,
        borderRadius: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        justifyContent: 'space-around',
    },
    card: {
        width: '45%',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});
