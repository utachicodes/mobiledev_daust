import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import UserProfile from './src/exercises/lab1/UserProfile';
import Lab2Showcase from './src/exercises/lab2/Lab2Showcase';
import Lab3Screen from './src/exercises/lab3';
import Lab4Showcase from './src/exercises/lab4';

export default function App() {
  const [currentLab, setCurrentLab] = useState<'lab1' | 'lab2' | 'lab3' | 'lab4'>('lab4');

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mobile Dev Labs</Text>
        </View>

        <View style={styles.nav}>
          <TouchableOpacity
            style={[styles.btn, currentLab === 'lab1' && styles.activeBtn]}
            onPress={() => setCurrentLab('lab1')}
          >
            <Text style={[styles.btnText, currentLab === 'lab1' && styles.activeBtnText]}>Lab 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, currentLab === 'lab2' && styles.activeBtn]}
            onPress={() => setCurrentLab('lab2')}
          >
            <Text style={[styles.btnText, currentLab === 'lab2' && styles.activeBtnText]}>Lab 2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, currentLab === 'lab3' && styles.activeBtn]}
            onPress={() => setCurrentLab('lab3')}
          >
            <Text style={[styles.btnText, currentLab === 'lab3' && styles.activeBtnText]}>Lab 3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, currentLab === 'lab4' && styles.activeBtn]}
            onPress={() => setCurrentLab('lab4')}
          >
            <Text style={[styles.btnText, currentLab === 'lab4' && styles.activeBtnText]}>Lab 4</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {currentLab === 'lab1' && <UserProfile />}
          {currentLab === 'lab2' && <Lab2Showcase />}
          {currentLab === 'lab3' && <Lab3Screen />}
          {currentLab === 'lab4' && <Lab4Showcase />}
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nav: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeBtn: {
    backgroundColor: '#007AFF',
  },
  btnText: {
    fontWeight: '600',
    color: '#333',
  },
  activeBtnText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
});
