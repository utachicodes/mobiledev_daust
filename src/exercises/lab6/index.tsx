import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useTheme } from '../common/ThemeContext';
import TicTacToeBoard from './TicTacToeBoard';
import { checkWinner, getBestMove, GameBoard, Player, WINNING_COMBINATIONS } from './logic';
import { Ionicons } from '@expo/vector-icons';

type GameMode = 'Friend' | 'Computer' | null;

// TicTacToe Game Main Component
// This file handles the game state, AI logic coordination, and the overall UI layout.
export default function Lab6() {
    // Access the current theme colors (light/dark)
    const { theme, colors, toggleTheme } = useTheme();

    // gameMode: null (landing), 'Friend' (2-player), 'Computer' (vs AI)
    const [gameMode, setGameMode] = useState<GameMode>(null);

    // board: 9-element array representing the 3x3 grid
    const [board, setBoard] = useState<GameBoard>(Array(9).fill(null));

    // currentPlayer: 'X' always starts
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X');

    // winner: tracks who won ('X', 'O') or if it's a 'Draw'
    const [winner, setWinner] = useState<Player | 'Draw' | null>(null);

    // winningLine: the array of 3 indices that won the game
    const [winningLine, setWinningLine] = useState<number[] | null>(null);

    // scores: persistent score tracking during the session
    const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });

    // Function to reset the board for a new round
    const resetGame = () => {
        setBoard(Array(9).fill(null)); // Clear all squares
        setCurrentPlayer('X');        // Reset to first player
        setWinner(null);              // Clear winner
        setWinningLine(null);         // Clear winning highlight
    };

    // Main interaction handler when a square is pressed
    const handlePress = (index: number) => {
        // Ignore if square is taken or game is over
        if (board[index] || winner) return;

        // Create a copy of the board and update the clicked square
        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        // Check if this move resulted in a win
        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result);
            updateScores(result);
            // If it's a win (not draw), find the winning indices for highlighting
            if (result !== 'Draw') {
                const line = WINNING_COMBINATIONS.find(([a, b, c]) =>
                    newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]
                );
                setWinningLine(line || null);
            }
        } else {
            // Switch to the other player if no win yet
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
    };

    // Update the scoreboard based on the game result
    const updateScores = (result: Player | 'Draw') => {
        setScores(prev => ({
            ...prev,
            [result]: prev[result] + 1
        }));
    };

    // Computer Move Logic: Automatically triggers when it's 'O's turn in Computer mode
    useEffect(() => {
        if (gameMode === 'Computer' && currentPlayer === 'O' && !winner) {
            const timeout = setTimeout(() => {
                // Use Minimax algorithm to find the best possible move
                const move = getBestMove(board);
                if (move !== -1) handlePress(move);
            }, 600); // 600ms delay to make it feel more "human"
            return () => clearTimeout(timeout);
        }
    }, [currentPlayer, gameMode, winner, board]);

    // Navigation hook to control the drawer side-menu
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    // View for the Landing Screen (Initial state)
    if (!gameMode) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Landing Header: Contains the Menu button to switch labs */}
                <View style={styles.landingHeader}>
                    <TouchableOpacity
                        style={[styles.headerButton, { backgroundColor: colors.card }]}
                        onPress={() => navigation.openDrawer()}
                    >
                        <Ionicons name="menu" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Main scrollable area to handle different screen heights */}
                <ScrollView contentContainerStyle={styles.centerScroll}>
                    <View style={styles.landingContent}>
                        {/* Decorative icon container with subtle primary color background */}
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                            <Ionicons name="grid" size={80} color={colors.primary} />
                        </View>

                        <Text style={[styles.title, { color: colors.text }]}>Tic Tac Toe</Text>
                        <Text style={[styles.subtitle, { color: colors.secondary }]}>Master the game of strategy</Text>

                        {/* Mode selection buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.modeButton, { backgroundColor: colors.primary }]}
                                onPress={() => setGameMode('Friend')}
                            >
                                <Ionicons name="people" size={24} color="#fff" />
                                <Text style={styles.modeButtonText}>Play with Friend</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modeButton, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.primary }]}
                                onPress={() => setGameMode('Computer')}
                            >
                                <Ionicons name="hardware-chip" size={24} color={colors.primary} />
                                <Text style={[styles.modeButtonText, { color: colors.primary }]}>Play with AI</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.themeToggle, { backgroundColor: colors.card }]}
                            onPress={toggleTheme}
                        >
                            <Ionicons
                                name={theme === 'dark' ? "sunny" : "moon"}
                                size={20}
                                color={colors.primary}
                            />
                            <Text style={[styles.themeToggleText, { color: colors.text }]}>
                                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // View for the Active Game Screen
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Wrapper to center core content on large screens (Web) */}
            <View style={styles.webWrapper}>
                {/* Header with Back, Title, and Theme Toggle */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.headerButton, { backgroundColor: colors.card }]}
                        onPress={() => setGameMode(null)}
                    >
                        <Ionicons name="chevron-back" size={24} color={colors.primary} />
                    </TouchableOpacity>

                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {gameMode === 'Friend' ? 'Local PvP' : 'Vs Computer'}
                    </Text>

                    <TouchableOpacity
                        style={[styles.headerButton, { backgroundColor: colors.card }]}
                        onPress={toggleTheme}
                    >
                        <Ionicons
                            name={theme === 'dark' ? "sunny" : "moon"}
                            size={20}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Scoreboard displaying wins for X, O, and Draws */}
                <View style={[styles.scoreBoard, { backgroundColor: colors.card }]}>
                    <View style={styles.scoreItem}>
                        <Text style={[styles.scoreLabel, { color: colors.secondary }]}>Player X</Text>
                        <Text style={[styles.scoreValue, { color: colors.text }]}>{scores.X}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <View style={styles.scoreItem}>
                        <Text style={[styles.scoreLabel, { color: colors.secondary }]}>Draws</Text>
                        <Text style={[styles.scoreValue, { color: colors.text }]}>{scores.Draw}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <View style={styles.scoreItem}>
                        <Text style={[styles.scoreLabel, { color: colors.secondary }]}>
                            {gameMode === 'Computer' ? 'AI' : 'Player O'}
                        </Text>
                        <Text style={[styles.scoreValue, { color: colors.text }]}>{scores.O}</Text>
                    </View>
                </View>

                {/* Turn indicator or Winner announcement badge */}
                <View style={styles.statusContainer}>
                    {winner ? (
                        <View style={[styles.winnerBadge, { backgroundColor: colors.primary }]}>
                            <Text style={[styles.statusText, { color: '#fff' }]}>
                                {winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}
                            </Text>
                        </View>
                    ) : (
                        <Text style={[styles.statusText, { color: colors.text }]}>
                            {currentPlayer}'s Turn
                        </Text>
                    )}
                </View>

                {/* The 3x3 Tic Tac Toe Grid component */}
                <View style={styles.gameArea}>
                    <TicTacToeBoard
                        board={board}
                        onPress={handlePress}
                        winningLine={winningLine}
                    />
                </View>

                {/* New Round button to clear the board */}
                <TouchableOpacity
                    style={[styles.resetBtn, { backgroundColor: colors.primary }]}
                    onPress={resetGame}
                >
                    <Text style={styles.resetBtnText}>New Round</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Web wrapper to constrain width on large screens
    webWrapper: {
        flex: 1,
        width: '100%',
        maxWidth: 500, // Maximum width for better TV/Monitor experience
        alignSelf: 'center', // Centers the content horizontal
    },
    // Centers content within the scroll view for the landing page
    centerScroll: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    landingContent: {
        alignItems: 'center',
        padding: 40,
        maxWidth: 500,
        alignSelf: 'center',
        width: '100%',
    },
    title: {
        fontSize: 40,
        fontWeight: '900',
        marginTop: 20,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 60,
        opacity: 0.6,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    modeButton: {
        width: '100%',
        flexDirection: 'row',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    modeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
        color: '#fff',
    },
    // Theme toggle button styles
    themeToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    themeToggleText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '600',
    },
    // Styles for the very top of the landing screen
    landingHeader: {
        paddingHorizontal: 20,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    scoreBoard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
        marginHorizontal: 20,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    divider: {
        width: 1,
        height: '60%',
        opacity: 0.3,
    },
    scoreItem: {
        alignItems: 'center',
        flex: 1,
    },
    scoreLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 5,
    },
    scoreValue: {
        fontSize: 24,
        fontWeight: '900',
    },
    statusContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    winnerBadge: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 20,
        fontWeight: '800',
    },
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetBtn: {
        marginHorizontal: 30,
        marginBottom: 30,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    resetBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
