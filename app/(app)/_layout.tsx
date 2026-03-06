import { Stack } from 'expo-router';
import { useTheme } from '../../src/exercises/common/ThemeContext';

export default function AppLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTintColor: colors.text,
                headerShadowVisible: false,
            }}
        >
            {/* The main tab interface */}
            <Stack.Screen name="tabs" options={{ headerShown: false }} />

            {/* Dynamic route detail */}
            <Stack.Screen name="labs/lab3/[city]" options={{ title: 'City Details' }} />

            {/* Modal Settings */}
            <Stack.Screen
                name="settings"
                options={{
                    presentation: 'modal',
                    title: 'Settings',
                    headerShown: true
                }}
            />
        </Stack>
    );
}
