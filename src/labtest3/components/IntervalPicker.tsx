import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const INTERVALS = [1, 3, 5, 10, 15, 30];

interface Props {
  value: number;
  onChange: (minutes: number) => void;
}

export default function IntervalPicker({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Reminder Interval</Text>
      <View style={styles.row}>
        {INTERVALS.map((min) => (
          <TouchableOpacity
            key={min}
            style={[styles.chip, value === min && styles.chipActive]}
            onPress={() => onChange(min)}
          >
            <Text style={[styles.chipText, value === min && styles.chipTextActive]}>
              {min}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 14, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingVertical: 6, paddingHorizontal: 14,
    borderRadius: 20, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#ddd',
  },
  chipActive: { backgroundColor: '#4A90D9', borderColor: '#4A90D9' },
  chipText: { fontSize: 13, color: '#555', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
});
