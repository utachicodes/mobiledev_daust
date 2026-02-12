import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../exercises/lab3/ThemeContext';

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
                name="gallery"
                options={{
                    title: 'Gallery',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="images" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="weather"
                options={{
                    title: 'Weather',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cloudy" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
