import React, { useState } from 'react';
import { View, Image, StyleSheet, useWindowDimensions, FlatList, TouchableOpacity, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DATA = Array.from({ length: 20 }, (_, i) => ({
    id: i.toString(),
    uri: `https://picsum.photos/400/400?random=${i}`,
}));

const ResponsiveGalleryClickable = () => {
    const { width } = useWindowDimensions();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const getColumns = () => {
        if (width < 375) return 2;
        if (width <= 768) return 3;
        return 4;
    };

    const numColumns = getColumns();
    const spacing = 10;
    const itemWidth = (width - (spacing * (numColumns + 1))) / numColumns;

    return (
        <View style={styles.container}>
            <FlatList
                key={`gallery-${numColumns}`}
                data={DATA}
                numColumns={numColumns}
                contentContainerStyle={{ padding: spacing }}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: spacing }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{ width: itemWidth, height: itemWidth }}
                        onPress={() => setSelectedImage(item.uri)}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={{ uri: item.uri }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
            />

            <Modal
                visible={selectedImage !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedImage(null)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.modalBackground}
                        activeOpacity={1}
                        onPress={() => setSelectedImage(null)}
                    >
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setSelectedImage(null)}
                            >
                                <Ionicons name="close" size={30} color="#fff" />
                            </TouchableOpacity>
                            {selectedImage && (
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={styles.modalImage}
                                    resizeMode="contain"
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        height: '80%',
        position: 'relative',
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: -50,
        right: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 5,
    },
});

export default ResponsiveGalleryClickable;
