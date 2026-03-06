import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  total: number;
  goal: number;
}

export default function ProgressRing({ total, goal }: Props) {
  const pct = Math.min(total / goal, 1);
  const radius = 70;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (1 - pct);
  const color = pct >= 1 ? '#4caf50' : pct >= 0.5 ? '#4A90D9' : '#ff9800';

  return (
    <View style={styles.container}>
      <Svg width={170} height={170}>
        <Circle
          cx={85} cy={85} r={radius}
          stroke="#e0e0e0" strokeWidth={stroke} fill="none"
        />
        <Circle
          cx={85} cy={85} r={radius}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={progress}
          strokeLinecap="round"
          rotation="-90" origin="85,85"
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.amount, { color }]}>{total}</Text>
        <Text style={styles.unit}>ml</Text>
        <Text style={styles.goal}>/ {goal} ml</Text>
        <Text style={styles.pct}>{Math.round(pct * 100)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  center: {
    position: 'absolute',
    alignItems: 'center',
  },
  amount: { fontSize: 28, fontWeight: '800' },
  unit: { fontSize: 13, color: '#888', marginTop: -2 },
  goal: { fontSize: 11, color: '#aaa', marginTop: 2 },
  pct: { fontSize: 13, fontWeight: '700', color: '#666', marginTop: 2 },
});
