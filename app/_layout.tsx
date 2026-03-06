import { Stack, Redirect } from 'expo-router';
import { AuthProvider } from '../src/exercises/lab5/contexts/AuthContext';
import { ThemeProvider, useTheme } from '../src/exercises/common/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/exercises/lab5/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import '../src/suppressWebWarnings';

function RootLayoutContent() {
    const { colors } = useTheme();
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Handle notification clicks only on native
        if (typeof window === 'undefined') {
            const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
                const data = response.notification.request.content.data;
                if (data?.screen === 'water-reminder') {
                    router.push('/reminder');
                } else if (data?.screen === 'stats') {
                    router.push({
                        pathname: '/stats',
                        params: {
                            steps: data.steps as string,
                            goal: data.goal as string
                        },
                    });
                }
            });

            return () => subscription.remove();
        }
    }, [router]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <ThemeProvider>
                    <RootLayoutContent />
                </ThemeProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}
