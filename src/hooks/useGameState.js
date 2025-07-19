import { useState, useCallback } from 'react';
import { checkWinCondition } from '../utils/gameLogic';

const PIECE_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

const PLAYERS = {
  PLAYER1: 1,
  PLAYER2: 2
};

const COLORS = {
  [PLAYERS.PLAYER1]: '#4CAF50', // Green
  [PLAYERS.PLAYER2]: '#FF9800'  // Orange
};

const initialBoard = Array(3).fill(null).map(() => Array(3).fill([]));

const createInitialReserves = () => ({
  [PLAYERS.PLAYER1]: {
    [PIECE_SIZES.SMALL]: 2,
    [PIECE_SIZES.MEDIUM]: 2,
    [PIECE_SIZES.LARGE]: 2
  },
  [PLAYERS.PLAYER2]: {
    [PIECE_SIZES.SMALL]: 2,
    [PIECE_SIZES.MEDIUM]: 2,
    [PIECE_SIZES.LARGE]: 2
  }
});

export const useGameState = () => {
  const [board, setBoard] = useState(initialBoard);
  const [reserves, setReserves] = useState(createInitialReserves());
  const [currentPlayer, setCurrentPlayer] = useState(() => {
    // Randomly choose starting player
    return Math.random() < 0.5 ? PLAYERS.PLAYER1 : PLAYERS.PLAYER2;
  });
  const [gameWon, setGameWon] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [winner, setWinner] = useState(null);

  const canPlacePiece = useCallback((row, col, size, player) => {
    const cell = board[row][col];
    if (cell.length === 0) return true;
    
    const topPiece = cell[cell.length - 1];
    const sizeOrder = [PIECE_SIZES.SMALL, PIECE_SIZES.MEDIUM, PIECE_SIZES.LARGE];
    const currentSizeIndex = sizeOrder.indexOf(size);
    const topSizeIndex = sizeOrder.indexOf(topPiece.size);
    
    return currentSizeIndex > topSizeIndex;
  }, [board]);

  const canMovePiece = useCallback((fromRow, fromCol, toRow, toCol) => {
    const fromCell = board[fromRow][fromCol];
    if (fromCell.length === 0) return false;
    
    const piece = fromCell[fromCell.length - 1];
    if (piece.player !== currentPlayer) return false;
    
    return canPlacePiece(toRow, toCol, piece.size, piece.player);
  }, [board, currentPlayer, canPlacePiece]);

  const placePiece = useCallback((row, col, size, fromReserve = true, fromRow = null, fromCol = null) => {
    if (gameWon) return false;

    const player = currentPlayer;
    
    if (fromReserve) {
      if (reserves[player][size] <= 0) return false;
      if (!canPlacePiece(row, col, size, player)) return false;
      
      setReserves(prev => ({
        ...prev,
        [player]: {
          ...prev[player],
          [size]: prev[player][size] - 1
        }
      }));
    } else {
      if (!canMovePiece(fromRow, fromCol, row, col)) return false;
      
      setBoard(prev => {
        const newBoard = prev.map(row => row.map(cell => [...cell]));
        newBoard[fromRow][fromCol].pop();
        return newBoard;
      });
    }

    setBoard(prev => {
      const newBoard = prev.map(row => row.map(cell => [...cell]));
      newBoard[row][col].push({ size, player, id: Date.now() });
      
      // Check for win condition after placing piece
      const winResult = checkWinCondition(newBoard);
      if (winResult) {
        setGameWon(true);
        setWinningLine(winResult.line);
        setWinner(winResult.player);
      }
      
      return newBoard;
    });

    if (!gameWon) {
      setCurrentPlayer(player === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1);
    }
    return true;
  }, [gameWon, currentPlayer, reserves, canPlacePiece, canMovePiece]);

  const resetGame = useCallback(() => {
    setBoard(initialBoard);
    setReserves(createInitialReserves());
    // Randomly choose starting player for new game
    setCurrentPlayer(Math.random() < 0.5 ? PLAYERS.PLAYER1 : PLAYERS.PLAYER2);
    setGameWon(false);
    setWinningLine(null);
    setWinner(null);
  }, []);

  return {
    board,
    reserves,
    currentPlayer,
    gameWon,
    winningLine,
    winner,
    placePiece,
    canPlacePiece,
    canMovePiece,
    resetGame,
    PIECE_SIZES,
    PLAYERS,
    COLORS
  };
};