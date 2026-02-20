import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { Player, GameBoard } from './logic';
import { useTheme } from '../common/ThemeContext';

interface TicTacToeBoardProps {
    board: GameBoard;
    onPress: (index: number) => void;
    winningLine: number[] | null;
}

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.9;
const SQUARE_SIZE = BOARD_SIZE / 3;

// TicTacToeBoard Component: Renders the 3x3 grid and handles square animations
const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({ board, onPress, winningLine }) => {
    // Access theme colors for styling
    const { colors } = useTheme();

    // Helper function to render an individual square on the board
    const renderSquare = (index: number) => {
        // Check if this square is part of the winning combination
        const isWinningSquare = winningLine?.includes(index);
        // Get the value of the square ('X', 'O', or null)
        const value = board[index];

        // Animation reference for the appearance of X or O
        // useRef ensures the animation state persists across re-renders
        const scaleAnim = useRef(new Animated.Value(0)).current;

        // Trigger animation when the square gets a value
        useEffect(() => {
            if (value) {
                // Animated.spring creates a "bouncy" effect
                Animated.spring(scaleAnim, {
                    toValue: 1,         // Target scale is 100%
                    useNativeDriver: true, // Offload animation to the native thread for performance
                    friction: 5,        // Controls how much the bounce "resists"
                    tension: 40,       // Controls the "speed" of the bounce
                }).start();
            } else {
                // Reset scale to 0 if square is cleared
                scaleAnim.setValue(0);
            }
        }, [value]); // Re-run effect only when 'value' changes

        return (
            <TouchableOpacity
                key={index}
                style={[
                    styles.square,
                    {
                        backgroundColor: colors.card, // Square color matches the theme card color
                    },
                    // If it's a winning square, give it a subtle highlight
                    isWinningSquare && { backgroundColor: colors.primary + '22' }
                ]}
                onPress={() => onPress(index)} // Trigger the move selection in parent
                // Disable button if cell is already filled or game is over
                disabled={value !== null || winningLine !== null}
            >
                {/* Only render X or O if value is not null */}
                {value && (
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Text
                            style={[
                                styles.squareText,
                                // Red color for X, Blue color for O
                                { color: value === 'X' ? '#FF3B30' : '#007AFF' }
                            ]}
                        >
                            {value}
                        </Text>
                    </Animated.View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        // Main container for the board with a subtle border/shadow effect
        <View style={[styles.boardContainer, { backgroundColor: colors.border + '50' }]}>
            <View style={styles.board}>
                {/* Loop through the 9-element array and render each square */}
                {board.map((_, index) => renderSquare(index))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    boardContainer: {
        padding: 10,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    board: {
        width: BOARD_SIZE - 20,
        height: BOARD_SIZE - 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 16,
        overflow: 'hidden',
    },
    square: {
        width: (BOARD_SIZE - 20) / 3 - 2,
        height: (BOARD_SIZE - 20) / 3 - 2,
        margin: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    squareText: {
        fontSize: 48,
        fontWeight: 'bold',
    },
});

export default TicTacToeBoard;
