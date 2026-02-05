import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';

const WeatherCard = () => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.city}>San Francisco</Text>
                <Text style={styles.date}>Monday, 4 Oct</Text>
            </View>

            <View style={styles.mainInfo}>
                <Text style={styles.temp}>72°</Text>
                <View style={styles.conditionContainer}>
                    {/* Using a placeholder image for the weather icon cause ion got one */}
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/869/869869.png' }}
                        style={styles.icon}
                    />
                    <Text style={styles.condition}>Sunny</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.highLowItem}>
                    <Text style={styles.highLowLabel}>High</Text>
                    <Text style={styles.highLowValue}>78°</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.highLowItem}>
                    <Text style={styles.highLowLabel}>Low</Text>
                    <Text style={styles.highLowValue}>65°</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#4facfe', 
        borderRadius: 24,
        padding: 24,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
        marginBottom: 20,
        overflow: 'hidden',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    city: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    date: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
    },
    mainInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    temp: {
        fontSize: 84,
        fontWeight: '200', 
        color: '#fff',
        includeFontPadding: false, 
    },
    conditionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 8,
        tintColor: '#fff',
    },
    condition: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        padding: 16,
    },
    highLowItem: {
        flex: 1,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: 10,
    },
    highLowLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    highLowValue: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
});

export default WeatherCard;
