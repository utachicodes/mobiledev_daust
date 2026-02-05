import React from 'react';
import { View, Image, StyleSheet, useWindowDimensions, FlatList } from 'react-native';

const DATA = Array.from({ length: 20 }, (_, i) => ({
    id: i.toString(),
    uri: `https://picsum.photos/400/400?random=${i}`,
}));

const ResponsiveGallery = () => {
    const { width } = useWindowDimensions();

    const getColumns = () => {
        if (width < 375) return 2;
        if (width <= 768) return 3;
        return 4;
    };

    const numColumns = getColumns();
    const spacing = 10;
    // (Screen Width - (Space per column including outer edges)) / numColumns
    // Better logic: ItemWidth = (Width - (Spacing * (Columns - 1))) / Columns ?
    // Let's align with the hint: itemWidth = (width - (spacing * (columns + 1))) / columns; (implies outer padding)
    const itemWidth = (width - (spacing * (numColumns + 1))) / numColumns;

    return (
        <View style={styles.container}>
            {/* 
        Key is important! When numColumns changes, FlatList needs a new key 
        to force a full re-render with the new layout structure.
      */}
            <FlatList
                key={`gallery-${numColumns}`}
                data={DATA}
                numColumns={numColumns}
                contentContainerStyle={{ padding: spacing }}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: spacing }}
                renderItem={({ item }) => (
                    <View style={{ width: itemWidth, height: itemWidth }}>
                        <Image
                            source={{ uri: item.uri }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false} // Since we put it in a ScrollView in the main screen
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
});

export default ResponsiveGallery;
