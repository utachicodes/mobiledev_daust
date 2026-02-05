import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Exercise1 from './Exercise1';
import Exercise2 from './Exercise2';

export default function Lab4Screen() {
    const [selectedExercise, setSelectedExercise] = useState<'menu' | 1 | 2>('menu');

    if (selectedExercise === 1) {
        return <Exercise1 />;
    }

    if (selectedExercise === 2) {
        return <Exercise2 />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Lab 4: React Navigation</Text>
                <Text style={styles.subtitle}>Navigation exercises with React Navigation library</Text>

                <TouchableOpacity
                    style={styles.exerciseButton}
                    onPress={() => setSelectedExercise(1)}
                >
                    <Text style={styles.exerciseTitle}>Exercise 1</Text>
                    <Text style={styles.exerciseDescription}>
                        Basic Navigation with React Navigation
                    </Text>
                    <Text style={styles.exerciseDetails}>
                        Stack Navigation: Home → Details screens
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.exerciseButton}
                    onPress={() => setSelectedExercise(2)}
                >
                    <Text style={styles.exerciseTitle}>Exercise 2</Text>
                    <Text style={styles.exerciseDescription}>
                        Tab Navigation with React Navigation
                    </Text>
                    <Text style={styles.exerciseDetails}>
                        Bottom Tab Navigation: Home, Settings, Profile tabs
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a73e8',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 32,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    exerciseButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#1a73e8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    exerciseTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a73e8',
        marginBottom: 8,
    },
    exerciseDescription: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    exerciseDetails: {
        fontSize: 12,
        color: '#999',
    },
});
