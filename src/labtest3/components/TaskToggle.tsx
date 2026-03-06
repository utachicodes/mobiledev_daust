import React from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator } from 'react-native';

interface Props {
  enabled: boolean;
  onToggle: (value: boolean) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function TaskToggle({ enabled, onToggle, loading = false, error = null }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Background Reminder</Text>
          <Text style={styles.status}>{enabled ? 'Active' : 'Inactive'}</Text>
        </View>
        <View style={styles.toggleContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#4A90D9" />
          ) : (
            <Switch
              value={enabled}
              onValueChange={onToggle}
              trackColor={{ false: '#767577', true: '#4A90D9' }}
              thumbColor={enabled ? '#fff' : '#f4f3f4'}
            />
          )}
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {enabled && (
        <Text style={styles.info}>
          Reminders will be sent during working hours every 3 minutes.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  toggleContainer: {
    width: 50,
    alignItems: 'center',
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 8,
  },
  info: {
    fontSize: 12,
    color: '#4A90D9',
    marginTop: 8,
    lineHeight: 16,
  },
});
