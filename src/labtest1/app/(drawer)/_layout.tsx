import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { ThemeProvider, useTheme } from '../../../exercises/lab3/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

function DrawerLayout() {
    const { colors } = useTheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: colors.card,
                    },
                    drawerActiveTintColor: colors.primary,
                    drawerInactiveTintColor: colors.secondary,
                    headerStyle: {
                        backgroundColor: colors.card,
                    },
                    headerTintColor: colors.text,
                }}
            >
                <Drawer.Screen
                    name="(tabs)"
                    options={{
                        drawerLabel: 'Home',
                        title: 'Lab Test 1',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="settings"
                    options={{
                        drawerLabel: 'Settings',
                        title: 'Settings',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="settings" size={size} color={color} />
                        ),
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}

export default function Layout() {
    return (
        <ThemeProvider>
            <DrawerLayout />
        </ThemeProvider>
    );
}
