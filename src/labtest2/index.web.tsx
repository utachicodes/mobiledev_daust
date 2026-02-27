import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Web is not supported for this screen — it uses native-only modules (WebView, expo-location)
export default function LabTest2Web() {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>🗺️</Text>
            <Text style={styles.title}>Utachi's Map</Text>
            <Text style={styles.subtitle}>Open this screen on a mobile device</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
    icon:     { fontSize: 48, marginBottom: 12 },
    title:    { fontSize: 22, fontWeight: '700', color: '#212529' },
    subtitle: { fontSize: 14, color: '#6c757d', marginTop: 6 },
});
