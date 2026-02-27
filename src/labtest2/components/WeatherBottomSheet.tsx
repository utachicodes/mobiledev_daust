import React, { useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useTheme } from '../../exercises/common/ThemeContext';
import CurrentWeatherCard from './CurrentWeatherCard';
import ForecastStrip from './ForecastStrip';
import { WeatherData } from '../types';

interface Props {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}

const SNAP_POINTS = [130, '45%', '82%'];

export default function WeatherBottomSheet({ weatherData, isLoading, error }: Props) {
  const { colors } = useTheme();
  const ref = useRef<BottomSheet>(null);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.msg, { color: colors.secondary }]}>Fetching weather...</Text>
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
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={SNAP_POINTS}
      backgroundStyle={{ backgroundColor: colors.card }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
      enablePanDownToClose={false}
    >
      <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {renderContent()}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  center: { padding: 24, alignItems: 'center', gap: 8 },
  msg: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  errIcon: { fontSize: 32 },
});
