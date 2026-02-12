import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, User } from '../services/authService';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
                const storedUser = await AsyncStorage.getItem(USER_KEY);

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to load auth data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadAuthData();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await authService.login(username, password);
            setToken(response.token);
            setUser(response.user);
            await AsyncStorage.setItem(TOKEN_KEY, response.token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setToken(null);
            setUser(null);
            await AsyncStorage.removeItem(TOKEN_KEY);
            await AsyncStorage.removeItem(USER_KEY);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
