import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { WorkingHours } from '../types';

interface Props {
  value: WorkingHours;
  onChange: (hours: WorkingHours) => void;
  onSave: () => void;
}

export default function WorkingHoursInput({ value, onChange, onSave }: Props) {
  const [startInput, setStartInput] = useState(String(value.start));
  const [endInput, setEndInput] = useState(String(value.end));
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const start = parseInt(startInput, 10);
    const end = parseInt(endInput, 10);

    if (isNaN(start) || isNaN(end)) {
      setError('Please enter valid numbers');
      return;
    }

    if (start < 0 || start > 23 || end < 0 || end > 23) {
      setError('Hours must be between 0 and 23');
      return;
    }

    if (end <= start) {
      setError('End time must be after start time');
      return;
    }

    setError(null);
    onChange({ start, end });
    onSave();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Working Hours</Text>

      <View style={styles.inputContainer}>
        <View style={styles.timeField}>
          <Text style={styles.fieldLabel}>Start (24h)</Text>
          <TextInput
            style={styles.input}
            value={startInput}
            onChangeText={setStartInput}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="9"
          />
        </View>

        <Text style={styles.separator}>to</Text>

        <View style={styles.timeField}>
          <Text style={styles.fieldLabel}>End (24h)</Text>
          <TextInput
            style={styles.input}
            value={endInput}
            onChangeText={setEndInput}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="17"
          />
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.displayText}>
        {startInput}:00 - {endInput}:00
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Hours</Text>
      </TouchableOpacity>
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
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  timeField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  separator: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 8,
  },
  displayText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4A90D9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
