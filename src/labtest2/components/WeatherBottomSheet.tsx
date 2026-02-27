import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useTheme } from '../../exercises/common/ThemeContext';
import CurrentWeatherCard from './CurrentWeatherCard';
import ForecastStrip from './ForecastStrip';
import { WeatherData } from '../types';

interface Props {
    weatherData: WeatherData | null;
    isLoading: boolean;
    error: string | null;
}

const { height: SCREEN_H } = Dimensions.get('window');

// Snap positions (translateY values — higher = more collapsed)
const SNAP_PEEK = SCREEN_H - 130;   // Only handle + city + temp visible
const SNAP_HALF = SCREEN_H * 0.52;  // Weather details visible
const SNAP_FULL = SCREEN_H * 0.15;  // Fully open

export default function WeatherBottomSheet({ weatherData, isLoading, error }: Props) {
    const { colors } = useTheme();

    const translateY = useRef(new Animated.Value(SNAP_PEEK)).current;
    const currentY   = useRef(SNAP_PEEK);

    const snapTo = (y: number) => {
        currentY.current = y;
        Animated.spring(translateY, {
            toValue: y,
            useNativeDriver: true,
            bounciness: 4,
        }).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                translateY.stopAnimation();
            },
            onPanResponderMove: (_, g) => {
                const next = currentY.current + g.dy;
                if (next >= SNAP_FULL && next <= SNAP_PEEK) {
                    translateY.setValue(next);
                }
            },
            onPanResponderRelease: (_, g) => {
                const next = currentY.current + g.dy;
                const snaps = [SNAP_PEEK, SNAP_HALF, SNAP_FULL];
                const closest = snaps.reduce((a, b) =>
                    Math.abs(b - next) < Math.abs(a - next) ? b : a
                );
                snapTo(closest);
            },
        })
    ).current;

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.msg, { color: colors.secondary }]}>
                        Fetching weather...
                    </Text>
                </View>
            );
        }
        if (error) {
            return (
                <View style={styles.center}>
                    <Text style={styles.errIcon}>⚠️</Text>
                    <Text style={[styles.msg, { color: colors.secondary }]}>{error}</Text>
                </View>
            );
        }
        if (!weatherData) {
            return (
                <View style={styles.center}>
                    <Text style={[styles.msg, { color: colors.secondary }]}>
                        Search a location to see weather
                    </Text>
                </View>
            );
        }
        return (
            <>
                <CurrentWeatherCard
                    weather={weatherData.current}
                    locationName={weatherData.locationName}
                />
                <ForecastStrip forecasts={weatherData.daily} />
            </>
        );
    };

    return (
        <Animated.View
            style={[
                styles.sheet,
                { backgroundColor: colors.card, transform: [{ translateY }] },
            ]}
        >
            {/* Drag handle */}
            <View {...panResponder.panHandlers} style={styles.handleArea}>
                <View style={[styles.handle, { backgroundColor: colors.border }]} />
            </View>

            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {renderContent()}
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        // Sheet is SCREEN_H tall, starting from the top — translateY moves it into view
        top: 0,
        height: SCREEN_H,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 12,
    },
    handleArea: {
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    center: {
        padding: 24,
        alignItems: 'center',
        gap: 8,
    },
    msg: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    errIcon: {
        fontSize: 32,
    },
});
