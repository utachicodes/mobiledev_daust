import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useTheme } from '../exercises/common/ThemeContext';
import SearchBar from './components/SearchBar';
import WeatherBottomSheet from './components/WeatherBottomSheet';
import LeafletMap, { LeafletMapRef } from './components/LeafletMap';
import { fetchWeather } from './services/weather';
import { searchLocation } from './services/geocoding';
import { Coordinates, WeatherData } from './types';

const DEFAULT_COORDS: Coordinates = { latitude: 36.7372, longitude: 3.0865 };
const DEFAULT_NAME = 'Algiers, Algeria';

export default function LabTest2() {
    const { theme, colors } = useTheme();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const mapRef = useRef<LeafletMapRef>(null);

    const [location, setLocation]                = useState<Coordinates>(DEFAULT_COORDS);
    const [locationName, setLocationName]         = useState(DEFAULT_NAME);
    const [weatherData, setWeatherData]           = useState<WeatherData | null>(null);
    const [isLoadingWeather, setIsLoadingWeather] = useState(false);
    const [weatherError, setWeatherError]         = useState<string | null>(null);
    const [isSearching, setIsSearching]           = useState(false);
    const [searchError, setSearchError]           = useState<string | undefined>();
    const [permDenied, setPermDenied]             = useState(false);

    const loadWeather = useCallback(async (coords: Coordinates, name: string) => {
        setIsLoadingWeather(true);
        setWeatherError(null);
        try {
            setWeatherData(await fetchWeather(coords, name));
        } catch {
            setWeatherError('Weather unavailable. Check your connection.');
        } finally {
            setIsLoadingWeather(false);
        }
    }, []);

    // Sync theme changes live into the Leaflet map
    useEffect(() => {
        mapRef.current?.setTheme(theme === 'dark');
    }, [theme]);

    // On mount: request GPS, move map, fetch weather
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setPermDenied(true);
                loadWeather(DEFAULT_COORDS, DEFAULT_NAME);
                return;
            }
            try {
                const pos = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                const coords: Coordinates = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                };
                const [place] = await Location.reverseGeocodeAsync(coords);
                const name =
                    [place?.city, place?.country].filter(Boolean).join(', ') || 'Your Location';

                setLocation(coords);
                setLocationName(name);
                // Small delay so the map WebView finishes loading before we fly to location
                setTimeout(() => {
                    mapRef.current?.moveToLocation(coords, name);
                }, 1200);
                loadWeather(coords, name);
            } catch {
                loadWeather(DEFAULT_COORDS, DEFAULT_NAME);
            }
        })();
    }, [loadWeather]);

    const handleSearch = async (query: string) => {
        setIsSearching(true);
        setSearchError(undefined);
        try {
            const result = await searchLocation(query);
            if (!result) {
                setSearchError('Location not found. Try another search.');
                return;
            }
            setLocation(result.coordinates);
            setLocationName(result.displayName);
            mapRef.current?.moveToLocation(
                result.coordinates,
                result.displayName.split(',')[0]
            );
            await loadWeather(result.coordinates, result.displayName);
        } catch {
            setSearchError('Search failed. Check your connection.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* OpenStreetMap rendered via WebView + Leaflet.js (Expo Go compatible) */}
            <LeafletMap
                ref={mapRef}
                initialCoords={location}
                isDark={theme === 'dark'}
                markerTitle={locationName.split(',')[0]}
            />

            {/* Location permission denied banner */}
            {permDenied && (
                <View style={[styles.banner, { backgroundColor: colors.primary }]}>
                    <Text style={styles.bannerText}>
                        Location access denied — showing Algiers
                    </Text>
                </View>
            )}

            {/* Search bar overlaid on the map */}
            <SearchBar
                onSearch={handleSearch}
                isSearching={isSearching}
                errorMessage={searchError}
                onMenuPress={() => navigation.openDrawer()}
            />

            {/* Sliding weather bottom sheet */}
            <WeatherBottomSheet
                weatherData={weatherData}
                isLoading={isLoadingWeather}
                error={weatherError}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        position: 'absolute',
        top: 110,
        left: 12,
        right: 12,
        padding: 8,
        borderRadius: 8,
        zIndex: 9,
        alignItems: 'center',
    },
    bannerText: {
        color: '#fff',
        fontSize: 13,
    },
});
