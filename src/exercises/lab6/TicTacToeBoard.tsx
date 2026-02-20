import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { Player, GameBoard } from './logic';
import { useTheme } from '../common/ThemeContext';

interface TicTacToeBoardProps {
    board: GameBoard;
    onPress: (index: number) => void;
    winningLine: number[] | null;
}

const { width, height } = Dimensions.get('window');
// Responsive board size: Use slightly less of the width (80% instead of 90%)
// and also cap it based on height to ensure it fits comfortably on all screens.
const BOARD_SIZE = Math.min(width * 0.8, height * 0.45, 400);
const SQUARE_SIZE = BOARD_SIZE / 3;

// TicTacToeBoard Component: Renders the 3x3 grid and handles square animations
// Props:
// - board: Current state of the game (array of 9)
// - onPress: Function called when a square is clicked
// - winningLine: Array of indices that won the game (or null)
const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({ board, onPress, winningLine }) => {
    // Access theme colors so the board stays visible in both light and dark mode
    const { colors } = useTheme();

    /**
     * renderSquare: Creates an individual clickable square
     * We define it inside to have access to props and local state easily.
     */
    const renderSquare = (index: number) => {
        const isWinningSquare = winningLine?.includes(index);
        const value = board[index];

        // Animated value for the smooth pop-in effect of X and O
        const scaleAnim = useRef(new Animated.Value(0)).current;

        // UseEffect listens for changes in the square's value
        useEffect(() => {
            if (value) {
                // When a value (X or O) is set, animate its scale from 0 to 1
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 5,
                    tension: 40,
                }).start();
            } else {
                scaleAnim.setValue(0);
            }
        }, [value]);

        return (
            <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                style={[
                    styles.square,
                    {
                        backgroundColor: colors.card, // Individual squares use theme's card color
                        width: SQUARE_SIZE,
                        height: SQUARE_SIZE,
                    },
                    // Give winning squares a subtle primary-colored background tint
                    isWinningSquare && { backgroundColor: colors.primary + '33' }
                ]}
                onPress={() => onPress(index)}
                disabled={value !== null || winningLine !== null}
            >
                {value && (
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Text
                            style={[
                                styles.squareText,
                                // Color markers: Red for player, Blue for computer
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
        // The container provides the background for the "grid lines" (spacing between squares)
        <View style={[styles.boardContainer, {
            backgroundColor: colors.border,
            width: BOARD_SIZE + 4, // Extra 4 pixels for the border/spacing
            height: BOARD_SIZE + 4,
            borderRadius: 16,
            overflow: 'hidden'
        }]}>
            <View style={styles.board}>
                {/* map through the board array and render each item as a Square */}
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
