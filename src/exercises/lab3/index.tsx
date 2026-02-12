import React from 'react';
import { StyleSheet, View, ScrollView, Text, SafeAreaView } from 'react-native';
import WeatherCard from './WeatherCard';
import ResponsiveGallery from './ResponsiveGallery';
import ThemeSwitcher from './ThemeSwitcher';
import { ThemeProvider, useTheme } from './ThemeContext';

export const Lab3Content = () => {
    const { colors } = useTheme();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.contentContainer}
        >
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercise 3: Theme Switcher</Text>
                <ThemeSwitcher />
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercise 1: Weather Card</Text>
                <WeatherCard />
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercise 2: Responsive Gallery</Text>
                <Text style={[styles.subtitle, { color: colors.secondary }]}>
                    Resize window or rotate device to see columns change.
                </Text>
                <ResponsiveGallery />
            </View>
        </ScrollView>
    );
};

export default function Lab3Screen({ hideProvider = false }: { hideProvider?: boolean }) {
    if (hideProvider) {
        return <Lab3Content />;
    }
    return (
        <ThemeProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Lab3Content />
            </SafeAreaView>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 16,
        fontStyle: 'italic',
    },
});
