import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../exercises/common/ThemeContext';

interface Props {
  onSearch: (query: string) => Promise<void>;
  isSearching: boolean;
  errorMessage?: string;
  onMenuPress: () => void;
}

export default function SearchBar({ onSearch, isSearching, errorMessage, onMenuPress }: Props) {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  const submit = () => {
    if (query.trim() && !isSearching) onSearch(query.trim());
  };

  return (
    <View style={styles.container}>
      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity onPress={onMenuPress} style={styles.btn}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Search location..."
          placeholderTextColor={colors.secondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={submit}
          returnKeyType="search"
          autoCorrect={false}
        />
        {isSearching ? (
          <ActivityIndicator style={styles.btn} color={colors.primary} />
        ) : (
          <TouchableOpacity onPress={submit} style={styles.btn}>
            <Ionicons name="search" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage ? (
        <View style={[styles.error, { backgroundColor: colors.card }]}>
          <Text style={{ color: '#FF3B30', fontSize: 13 }}>{errorMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 12,
    right: 12,
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    paddingHorizontal: 8,
  },
  btn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    marginTop: 4,
    padding: 8,
    borderRadius: 8,
    elevation: 2,
  },
});
