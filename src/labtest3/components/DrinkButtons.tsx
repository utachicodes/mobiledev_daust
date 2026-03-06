import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GLASS_SIZES } from '../types';

interface Props {
  onDrink: (ml: number) => void;
}

export default function DrinkButtons({ onDrink }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Log Water Intake</Text>
      <View style={styles.row}>
        {GLASS_SIZES.map((ml) => (
          <TouchableOpacity key={ml} style={styles.btn} onPress={() => onDrink(ml)}>
            <Text style={styles.icon}>💧</Text>
            <Text style={styles.ml}>{ml}</Text>
            <Text style={styles.unit}>ml</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  btn: {
    flex: 1,
    minWidth: 55,
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  icon: { fontSize: 20 },
  ml: { fontSize: 14, fontWeight: '700', color: '#1565c0', marginTop: 2 },
  unit: { fontSize: 10, color: '#4A90D9' },
});
