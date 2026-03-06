import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { WaterLog } from '../types';

interface Props {
  logs: WaterLog[];
  onClear: () => void;
}

const fmt = (ts: number) => {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

export default function WaterLogList({ logs, onClear }: Props) {
  if (logs.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No water logged yet today.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Log ({logs.length} entries)</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clear}>Clear</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.list} nestedScrollEnabled>
        {[...logs].reverse().map((log) => (
          <View key={log.id} style={styles.row}>
            <Text style={styles.time}>{fmt(log.timestamp)}</Text>
            <Text style={styles.amount}>+{log.amount} ml</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 14, marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontSize: 14, fontWeight: '700', color: '#333' },
  clear: { fontSize: 13, color: '#e53935', fontWeight: '600' },
  list: { maxHeight: 160 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  time: { fontSize: 13, color: '#666' },
  amount: { fontSize: 13, fontWeight: '700', color: '#1565c0' },
  empty: { alignItems: 'center', paddingVertical: 12 },
  emptyText: { color: '#aaa', fontSize: 13 },
});
