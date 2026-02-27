import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../exercises/common/ThemeContext';
import { CurrentWeather } from '../types';

interface Props {
  weather: CurrentWeather;
  locationName: string;
}

export default function CurrentWeatherCard({ weather, locationName }: Props) {
  const { colors } = useTheme();
  const shortName = locationName.split(',')[0].trim();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.topRow}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={[styles.city, { color: colors.text }]} numberOfLines={1}>
            {shortName}
          </Text>
          <Text style={[styles.condition, { color: colors.secondary }]}>
            {weather.icon} {weather.condition}
          </Text>
        </View>
        <Text style={[styles.temp, { color: colors.text }]}>{weather.temperature}°C</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.detail}>
          <Ionicons name="speedometer-outline" size={16} color={colors.secondary} />
          <Text style={[styles.detailText, { color: colors.secondary }]}> {weather.windSpeed} km/h</Text>
        </View>
        <View style={styles.detail}>
          <Ionicons name="water-outline" size={16} color={colors.secondary} />
          <Text style={[styles.detailText, { color: colors.secondary }]}> {weather.humidity}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  city: { fontSize: 18, fontWeight: '700' },
  condition: { fontSize: 14, marginTop: 2 },
  temp: { fontSize: 42, fontWeight: '200' },
  details: { flexDirection: 'row', gap: 20 },
  detail: { flexDirection: 'row', alignItems: 'center' },
  detailText: { fontSize: 13 },
});
