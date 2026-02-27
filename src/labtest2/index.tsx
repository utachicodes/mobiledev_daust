import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import MapView, { UrlTile, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useTheme } from '../exercises/common/ThemeContext';
import SearchBar from './components/SearchBar';
import WeatherBottomSheet from './components/WeatherBottomSheet';
import { fetchWeather } from './services/weather';
import { searchLocation } from './services/geocoding';
import { Coordinates, WeatherData } from './types';

// CartoDB tiles — free, no API key, powered by OpenStreetMap data
const TILE_LIGHT = 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png';
const TILE_DARK  = 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png';

const DEFAULT_COORDS: Coordinates = { latitude: 36.7372, longitude: 3.0865 };
const DEFAULT_NAME = 'Algiers, Algeria';

export default function LabTest2() {
    const { theme, colors } = useTheme();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const mapRef = useRef<MapView>(null);

    const [location, setLocation]               = useState<Coordinates>(DEFAULT_COORDS);
    const [locationName, setLocationName]        = useState(DEFAULT_NAME);
    const [weatherData, setWeatherData]          = useState<WeatherData | null>(null);
    const [isLoadingWeather, setIsLoadingWeather] = useState(false);
    const [weatherError, setWeatherError]        = useState<string | null>(null);
    const [isSearching, setIsSearching]          = useState(false);
    const [searchError, setSearchError]          = useState<string | undefined>();
    const [permDenied, setPermDenied]            = useState(false);

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

    // On mount: request GPS, center map, fetch weather
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
                const name = [place?.city, place?.country].filter(Boolean).join(', ') || 'Your Location';

                setLocation(coords);
                setLocationName(name);
                mapRef.current?.animateToRegion(
                    { ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 },
                    600
                );
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
            mapRef.current?.animateToRegion(
                { ...result.coordinates, latitudeDelta: 0.05, longitudeDelta: 0.05 },
                800
            );
            await loadWeather(result.coordinates, result.displayName);
        } catch {
            setSearchError('Search failed. Check your connection.');
        } finally {
            setIsSearching(false);
        }
    };

    const tileUrl = theme === 'dark' ? TILE_DARK : TILE_LIGHT;

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Native map — mapType="none" means no base tiles, only our UrlTile overlay */}
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                provider={PROVIDER_DEFAULT}
                mapType="none"
                initialRegion={{
                    ...DEFAULT_COORDS,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                showsUserLocation
                showsMyLocationButton={false}
                rotateEnabled={false}
            >
                {/* OpenStreetMap tiles via CartoDB — switches with theme */}
                <UrlTile
                    urlTemplate={tileUrl}
                    maximumZ={19}
                    flipY={false}
                    tileSize={256}
                />
                <Marker
                    coordinate={location}
                    title={locationName.split(',')[0]}
                    pinColor={colors.primary}
                />
            </MapView>

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
