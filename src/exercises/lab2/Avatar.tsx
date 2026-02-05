import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface AvatarProps {
    source: any;
    size?: number;
}

export default function Avatar({ source, size = 50 }: AvatarProps) {
    return (
        <View style={[styles.container, { width: size + 4, height: size + 4, borderRadius: (size + 4) / 2 }]}>
            <Image
                source={source}
                style={{ width: size, height: size, borderRadius: size / 2 }}
                resizeMode="cover"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginRight: 12,
    },
});
