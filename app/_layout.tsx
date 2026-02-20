import { Drawer } from 'expo-router/drawer';
import { AuthProvider } from '../src/exercises/lab5/contexts/AuthContext';
import { ThemeProvider, useTheme } from '../src/exercises/common/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

// Component to handle the Drawer layout once themes are available
function DrawerLayout() {
    const { colors } = useTheme();

    return (
        <Drawer
            screenOptions={{
                // Styling the top header
                headerShown: false, // Use custom headers in individual screens
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTintColor: colors.text,
                // Styling the side drawer menu
                drawerStyle: {
                    backgroundColor: colors.background,
                    width: 280,
                },
                drawerActiveTintColor: colors.primary,
                drawerInactiveTintColor: colors.secondary,
                drawerLabelStyle: {
                    fontWeight: '600',
                },
            }}
        >
            {/* Home Screen: Tic Tac Toe */}
            <Drawer.Screen
                name="index"
                options={{
                    drawerLabel: 'Tic-Tac-Toe',
                    title: 'Game Center',
                    drawerIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
                }}
            />

            {/* Hidden screens (Authentication groups) */}
            <Drawer.Screen
                name="(auth)"
                options={{
                    drawerItemStyle: { display: 'none' }, // Don't show in the menu
                    headerShown: false,
                }}
            />

            <Drawer.Screen
                name="(app)"
                options={{
                    drawerItemStyle: { display: 'none' }, // Don't show in the menu
                    headerShown: false,
                }}
            />

            {/* Explicitly adding other Lab routes to the drawer for easy switching */}
            <Drawer.Screen
                name="(app)/labs/lab1"
                options={{
                    drawerLabel: 'Lab 1: Profiles',
                    title: 'User Profiles',
                    drawerIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
                }}
            />
            <Drawer.Screen
                name="(app)/labs/lab2"
                options={{
                    drawerLabel: 'Lab 2: Lists',
                    title: 'State & Lists',
                    drawerIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
                }}
            />
            <Drawer.Screen
                name="(app)/labs/lab3"
                options={{
                    drawerLabel: 'Lab 3: Props',
                    title: 'Props & Events',
                    drawerIcon: ({ color, size }) => <Ionicons name="cloudy" size={size} color={color} />,
                }}
            />
            <Drawer.Screen
                name="(app)/labs/lab4"
                options={{
                    drawerLabel: 'Lab 4: Lifecycle',
                    title: 'Lifecycle',
                    drawerIcon: ({ color, size }) => <Ionicons name="flask" size={size} color={color} />,
                }}
            />
            <Drawer.Screen
                name="(app)/labs/lab5"
                options={{
                    drawerLabel: 'Lab 5: Auth',
                    title: 'Context & Auth',
                    drawerIcon: ({ color, size }) => <Ionicons name="lock-closed" size={size} color={color} />,
                }}
            />
            <Drawer.Screen
                name="(app)/labs/lab6"
                options={{
                    drawerLabel: 'Lab 6: Tic-Tac-Toe',
                    title: 'Game Lab',
                    drawerIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
                }}
            />
            <Drawer.Screen
                name="(app)/test1"
                options={{
                    drawerLabel: 'Test 1: Project',
                    title: 'Project Submission',
                    drawerIcon: ({ color, size }) => <Ionicons name="checkmark-circle" size={size} color={color} />,
                }}
            />
        </Drawer>
    );
}

export default function RootLayout() {
    return (
        // GestureHandlerRootView is required for Drawer to work properly
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* AuthProvider handles login session across the app */}
            <AuthProvider>
                {/* ThemeProvider manages light/dark mode state */}
                <ThemeProvider>
                    <DrawerLayout />
                </ThemeProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}
