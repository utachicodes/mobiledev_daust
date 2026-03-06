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
            {/* The main tab interface - shows dashboard + home tab */}
            <Stack.Screen name="tabs" options={{ headerShown: false }} />

            {/* Lab screens */}
            <Stack.Screen name="labs/lab1" options={{ title: 'Lab 1: User Profiles', headerShown: true }} />
            <Stack.Screen name="labs/lab2" options={{ title: 'Lab 2: State & Lists', headerShown: true }} />
            <Stack.Screen name="labs/lab3" options={{ title: 'Lab 3: Props & Events', headerShown: true }} />
            <Stack.Screen name="labs/lab4" options={{ title: 'Lab 4: Lifecycle', headerShown: true }} />
            <Stack.Screen name="labs/lab5" options={{ title: 'Lab 5: Context & Auth', headerShown: true }} />
            <Stack.Screen name="labs/lab6" options={{ title: 'Lab 6: Tic-Tac-Toe', headerShown: true }} />
            <Stack.Screen name="labs/lab10" options={{ title: 'Lab 10: Notifications', headerShown: true }} />
            <Stack.Screen name="labs/labtest3" options={{ title: 'Lab Test 3: Hydration Reminder', headerShown: true }} />

            {/* Test screen */}
            <Stack.Screen name="test1" options={{ title: 'Test 1: Project Submission', headerShown: true }} />

            {/* Dynamic route detail */}
            <Stack.Screen name="labs/lab3/[city]" options={{ title: 'City Details', headerShown: true }} />

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
