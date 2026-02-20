/**
 * logic.ts
 * This file contains the core "brain" of the Tic-Tac-Toe game.
 * It handles checking for winners, identifying draws, and the AI logic.
 */

export type Player = 'X' | 'O';
export type SquareValue = Player | null;
export type GameBoard = SquareValue[];

/**
 * All possible ways to win a Tic-Tac-Toe game (3 in a row).
 * Each array represents indices in the 9-element board array.
 */
export const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

/**
 * Determines if there is a winner or a draw on the current board.
 * Returns 'X', 'O', 'Draw', or null if the game is still ongoing.
 */
export const checkWinner = (board: GameBoard): Player | 'Draw' | null => {
    // Check all winning combinations
    for (const [a, b, c] of WINNING_COMBINATIONS) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] as Player;
        }
    }

    // If no winner, check if there are any empty squares left
    if (board.every(square => square !== null)) {
        return 'Draw';
    }

    // Game is still in progress
    return null;
};

/**
 * MINIMAX ALGORITHM
 * This is a recursive function that simulates all possible future moves
 * to find the absolute best move for the computer.
 */
const minimax = (board: GameBoard, depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(board);

    // Base cases: return a score based on the outcome
    if (winner === 'O') return 10 - depth; // Computer wins (higher score is better)
    if (winner === 'X') return depth - 10; // Human wins (lower score is better)
    if (winner === 'Draw') return 0;       // Tie score

    if (isMaximizing) {
        // Computer's turn: try to maximize the score
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O'; // Simulate move
                const score = minimax(board, depth + 1, false);
                board[i] = null; // Undo move
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        // Human's turn: human will try to minimize computer's score
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X'; // Simulate move
                const score = minimax(board, depth + 1, true);
                board[i] = null; // Undo move
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

/**
 * Calculates the best possible move for the computer ('O').
 * It uses the minimax algorithm to guarantee it never loses if played perfectly.
 */
export const getBestMove = (board: GameBoard): number => {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            const score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    // Fallback just in case no move was found (shouldn't happen in a valid game state)
    if (move === -1) {
        move = board.findIndex(s => s === null);
    }

    return move;
};
