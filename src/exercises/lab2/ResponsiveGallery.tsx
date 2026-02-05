import React, { useState } from 'react';
import { View, Image, StyleSheet, useWindowDimensions, FlatList, Modal, TouchableOpacity, Text } from 'react-native';

const DATA = Array.from({ length: 20 }, (_, i) => ({
    id: i.toString(),
    uri: `https://picsum.photos/seed/lab2-${i}/600/600`,
}));

export default function ResponsiveGallery() {
    const { width } = useWindowDimensions();
    const [selected, setSelected] = useState<string | null>(null);

    const getColumns = () => {
        if (width < 375) return 2;
        if (width <= 768) return 3;
        return 4;
    };

    const numColumns = getColumns();
    const spacing = 10;
    const gap = 12;
    const itemWidth = (width - (gap * (numColumns - 1)) - (spacing * 2)) / numColumns;

    return (
        <View style={styles.container}>
            <FlatList
                key={`gallery-${numColumns}`}
                data={DATA}
                numColumns={numColumns}
                contentContainerStyle={{ padding: spacing }}
                columnWrapperStyle={{ gap, justifyContent: 'center' }}
                renderItem={({ item }) => (
                    <TouchableOpacity activeOpacity={0.9} onPress={() => setSelected(item.uri)}>
                        <View style={[styles.item, { width: itemWidth, height: itemWidth }] }>
                            <Image
                                source={{ uri: item.uri }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                initialNumToRender={8}
                maxToRenderPerBatch={8}
                windowSize={5}
                removeClippedSubviews={true}
            />

            <Modal
                visible={!!selected}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelected(null)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setSelected(null)}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>

                    <View style={styles.modalContent}>
                        {selected && (
                            <Image source={{ uri: selected }} style={styles.modalImage} resizeMode="contain" />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    item: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#eee',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    modalContent: {
        width: '100%',
        alignItems: 'center',
    },
    modalImage: {
        width: '100%',
        height: '80%'
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 20,
        padding: 8,
    },
    closeText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
