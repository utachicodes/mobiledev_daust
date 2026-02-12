import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
export const themes = {
    light: {
        background: '#f8f9fa',
        text: '#212529',
        card: '#ffffff',
        primary: '#007AFF',
        secondary: '#6c757d',
        border: '#dee2e6',
    },
    dark: {
        background: '#121212',
        text: '#f8f9fa',
        card: '#1e1e1e',
        primary: '#0a84ff',
        secondary: '#adb5bd',
        border: '#2c2c2c',
    },
};

export type ThemeType = 'light' | 'dark';
export type ThemeColors = typeof themes.light;

export interface ThemeContextType {
    theme: ThemeType;
    colors: ThemeColors;
    toggleTheme: () => void;
    isLoaded: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>('light');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme === 'light' || savedTheme === 'dark') {
                    setTheme(savedTheme as ThemeType);
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const value = {
        theme,
        colors: themes[theme],
        toggleTheme,
        isLoaded,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
