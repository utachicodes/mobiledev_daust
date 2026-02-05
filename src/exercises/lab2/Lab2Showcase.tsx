import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Lab1Profile from '../lab1/UserProfile';
import StatCard from './StatCard';
import Avatar from './Avatar';
import RecipeCard from './RecipeCard';
import ResponsiveGallery from './ResponsiveGallery';

const RECIPES = [
    {
        id: '1',
        title: 'Spaghetti Carbonara',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
        cookTime: 25,
        difficulty: 'Medium',
        rating: 4.5,
        tags: ['Italian', 'Pasta', 'Quick'],
    },
    {
        id: '2',
        title: 'Greek Salad',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
        cookTime: 10,
        difficulty: 'Easy',
        rating: 4.8,
        tags: ['Vegetarian', 'Healthy', 'Quick'],
    },
    {
        id: '3',
        title: 'Beef Tacos',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
        cookTime: 30,
        difficulty: 'Easy',
        rating: 4.6,
        tags: ['Mexican', 'Spicy'],
    },
];

export default function Lab2Showcase() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Lab 1: Components</Text>
            <View style={styles.section}>
                <Lab1Profile />
            </View>

            <Text style={styles.sectionTitle}>Lab 2.1: Avatar</Text>
            <View style={[styles.section, styles.row]}>
                <Avatar source={{ uri: 'https://i.pravatar.cc/150?img=1' }} size={60} />
                <Avatar source={{ uri: 'https://i.pravatar.cc/150?img=2' }} size={80} />
                <Avatar source={{ uri: 'https://i.pravatar.cc/150?img=3' }} size={40} />
            </View>

            <Text style={styles.sectionTitle}>Lab 2.2: Responsive Gallery</Text>
            <View style={styles.section}>
                <ResponsiveGallery />
            </View>

            <Text style={styles.sectionTitle}>Lab 2.3: Stats</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <StatCard value="2,847" label="Total Users" icon="👥" change={12.5} />
                <StatCard value="$45.2k" label="Revenue" icon="💰" change={-2.4} />
                <StatCard value="156" label="Active Now" icon="⚡" change={5.0} />
            </ScrollView>

            <Text style={styles.sectionTitle}>Lab 2.4: Recipes</Text>
            <View style={styles.section}>
                {RECIPES.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#000',
        marginTop: 30,
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    section: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    horizontalScroll: {
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
});
