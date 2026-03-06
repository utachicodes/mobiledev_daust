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
            <Tabs.Screen
                name="labs/lab1"
                options={{
                    title: 'Lab 1',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="labs/lab2"
                options={{
                    title: 'Lab 2',
                    tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="labs/lab3"
                options={{
                    title: 'Lab 3',
                    tabBarIcon: ({ color, size }) => <Ionicons name="cloudy" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="labs/lab4"
                options={{
                    title: 'Lab 4',
                    tabBarIcon: ({ color, size }) => <Ionicons name="flask" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="labs/lab5"
                options={{
                    title: 'Lab 5',
                    tabBarIcon: ({ color, size }) => <Ionicons name="lock-closed" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="labs/lab6"
                options={{
                    title: 'Lab 6',
                    tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="labs/lab10"
                options={{
                    title: 'Lab 10',
                    tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="labs/labtest3"
                options={{
                    title: 'LabTest 3',
                    tabBarIcon: ({ color, size }) => <Ionicons name="water" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="test1"
                options={{
                    title: 'Test 1',
                    tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
