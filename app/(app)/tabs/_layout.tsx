import { Tabs } from 'expo-router';
import { useTheme } from '../../../src/exercises/common/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    const { colors } = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondary,
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTintColor: colors.text,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
