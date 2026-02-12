import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import LoginScreen from './components/LoginScreen';
import Lab3Screen from '../lab3';

const Lab5Content = () => {
    const { isAuthenticated, isLoading, user, logout } = useAuth();
    const { colors, theme, toggleTheme } = useTheme();

    if (isLoading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <LoginScreen />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <View>
                    <Text style={[styles.welcome, { color: colors.text }]}>Hello, {user?.username}!</Text>
                    <Text style={[styles.themeLabel, { color: colors.secondary }]}>
                        Current Theme: {theme.toUpperCase()}
                    </Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={toggleTheme}
                    >
                        <Text style={[styles.actionBtnText, { color: colors.primary }]}>Switch Theme</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={logout}
                    >
                        <Text style={[styles.actionBtnText, { color: '#FF3B30' }]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                <Lab3Screen hideProvider={true} />
            </View>
        </View>
    );
};

export default function Lab5Screen() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Lab5Content />
            </AuthProvider>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        paddingTop: 10,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerActions: {
        alignItems: 'flex-end',
    },
    welcome: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    themeLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    actionBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        marginBottom: 6,
        minWidth: 100,
        alignItems: 'center',
    },
    actionBtnText: {
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
});
