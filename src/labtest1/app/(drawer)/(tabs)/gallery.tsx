import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../../exercises/lab3/ThemeContext';
import ResponsiveGalleryClickable from '../../../components/ResponsiveGalleryClickable';

export default function GalleryScreen() {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.content}>
                <ResponsiveGalleryClickable />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 10,
    },
});
