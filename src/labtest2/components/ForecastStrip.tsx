import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../exercises/common/ThemeContext';
import { DailyForecast } from '../types';

interface Props {
  forecasts: DailyForecast[];
}

export default function ForecastStrip({ forecasts }: Props) {
  const { colors } = useTheme();

  return (
    <View style={{ paddingTop: 12, paddingBottom: 20 }}>
      <Text style={[styles.title, { color: colors.text }]}>7-Day Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {forecasts.map((day, i) => (
          <View
            key={day.date}
            style={[
              styles.card,
              {
                backgroundColor: colors.background,
                borderColor: i === 0 ? colors.primary : colors.border,
                borderWidth: i === 0 ? 2 : 1,
              },
            ]}
          >
            <Text style={[styles.dayName, { color: i === 0 ? colors.primary : colors.text }]}>
              {i === 0 ? 'Today' : day.dayName}
            </Text>
            <Text style={styles.icon}>{day.icon}</Text>
            <Text style={[styles.max, { color: colors.text }]}>{day.maxTemp}°</Text>
            <Text style={[styles.min, { color: colors.secondary }]}>{day.minTemp}°</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  scroll: { paddingHorizontal: 12, gap: 8 },
  card: {
    width: 72,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  dayName: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  icon: { fontSize: 22, marginBottom: 6 },
  max: { fontSize: 15, fontWeight: '600' },
  min: { fontSize: 12, marginTop: 2 },
});
