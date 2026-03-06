import { Stack } from 'expo-router';
import { useTheme } from '../../src/exercises/common/ThemeContext';

export default function AppLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.card },
                headerTintColor: colors.text,
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />

            <Stack.Screen name="labs/lab1" options={{ title: 'Lab 1: User Profiles' }} />
            <Stack.Screen name="labs/lab2" options={{ title: 'Lab 2: State & Lists' }} />
            <Stack.Screen name="labs/lab3" options={{ title: 'Lab 3: Props & Events' }} />
            <Stack.Screen name="labs/lab4" options={{ title: 'Lab 4: Lifecycle' }} />
            <Stack.Screen name="labs/lab5" options={{ title: 'Lab 5: Context & Auth' }} />
            <Stack.Screen name="labs/lab6" options={{ title: 'Lab 6: Tic-Tac-Toe' }} />
            <Stack.Screen name="labs/lab10" options={{ title: 'Lab 10: Notifications' }} />
            <Stack.Screen name="labs/labtest3" options={{ title: 'Lab Test 3: Hydration Reminder' }} />
            <Stack.Screen name="labs/lab3/[city]" options={{ title: 'City Details' }} />

            <Stack.Screen name="test1" options={{ title: 'Test 1: Project Submission' }} />

            <Stack.Screen
                name="settings"
                options={{ presentation: 'modal', title: 'Settings' }}
            />
        </Stack>
    );
}
