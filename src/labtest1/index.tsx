import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider, useTheme } from '../lab3/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import WeatherCard from '../lab3/WeatherCard';
import ThemeSwitcher from '../lab3/ThemeSwitcher';
import ResponsiveGalleryClickable from './components/ResponsiveGalleryClickable';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Gallery Screen
function GalleryScreen() {
    const { colors } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.content}>
                <ResponsiveGalleryClickable />
            </ScrollView>
        </View>
    );
}

// Weather Screen
function WeatherScreen() {
    const { colors } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.content}>
                <WeatherCard />
            </ScrollView>
        </View>
    );
}

// Settings Screen
function SettingsScreen() {
    const { colors } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.contentPadded}>
                <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
                <ThemeSwitcher />
            </ScrollView>
        </View>
    );
}

// Tabs Navigator
function TabsNavigator() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondary,
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTintColor: colors.text,
            }}
        >
            <Tab.Screen
                name="Gallery"
                component={GalleryScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="images" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Weather"
                component={WeatherScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cloudy" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// Drawer Navigator
function DrawerNavigator() {
    const { colors } = useTheme();

    return (
        <Drawer.Navigator
            screenOptions={{
                drawerStyle: {
                    backgroundColor: colors.card,
                },
                drawerActiveTintColor: colors.primary,
                drawerInactiveTintColor: colors.secondary,
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTintColor: colors.text,
            }}
        >
            <Drawer.Screen
                name="Home"
                component={TabsNavigator}
                options={{
                    title: 'Lab Test 1',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
}

// Main component
export default function LabTest1() {
    return (
        <ThemeProvider>
            <DrawerNavigator />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 10,
    },
    contentPadded: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
