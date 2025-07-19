import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { checkWinCondition, getValidMoves } from './utils/gameLogic';
import GameBoard from './components/GameBoard';
import PieceReserve from './components/PieceReserve';
import UpdatePrompt from './components/UpdatePrompt';
import ConfettiEffect from './components/ConfettiEffect';
import packageJson from '../package.json';
import './App.css';

function App() {
  const {
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
  } = useGameState();

  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Check for win condition after each move
  useEffect(() => {
    const result = checkWinCondition(board);
    if (result) {
      setGameResult(result);
      setShowConfetti(true);
      // Stop confetti after 4 seconds
      setTimeout(() => setShowConfetti(false), 4000);
    } else {
      setGameResult(null);
      setShowConfetti(false);
    }
  }, [board]);

  // Update valid moves when a piece is selected
  useEffect(() => {
    if (selectedPiece) {
      const moves = getValidMoves(board, reserves, currentPlayer, selectedPiece);
      setValidMoves(moves);
    } else {
      setValidMoves([]);
    }
  }, [selectedPiece, board, reserves, currentPlayer]);

  const handlePieceSelect = (piece) => {
    if (piece.player !== currentPlayer) return;
    
    // Allow switching between pieces - always update selection
    setSelectedPiece(piece);
  };


  const handleCellClick = (row, col) => {
    // If we have a selected piece, try to place it
    if (selectedPiece) {
      const canPlace = selectedPiece.fromReserve 
        ? canPlacePiece(row, col, selectedPiece.size, selectedPiece.player)
        : canMovePiece(selectedPiece.row, selectedPiece.col, row, col);

      if (canPlace) {
        const success = placePiece(
          row, 
          col, 
          selectedPiece.size, 
          selectedPiece.fromReserve,
          selectedPiece.row,
          selectedPiece.col
        );
        
        if (success) {
          setSelectedPiece(null);
        }
      } else {
        // If can't place here, deselect the piece to allow new selection
        setSelectedPiece(null);
      }
      return;
    }

    // If no piece selected, try to select a piece from this cell
    const cell = board[row][col];
    if (cell.length > 0) {
      const topPiece = cell[cell.length - 1];
      if (topPiece.player === currentPlayer) {
        setSelectedPiece({
          ...topPiece,
          fromReserve: false,
          row,
          col
        });
      }
    }
  };

  const handleDrop = (row, col, event) => {
    const dragData = event?.dataTransfer?.getData('text/plain');
    if (!dragData) return;
    
    let piece;
    try {
      piece = JSON.parse(dragData);
    } catch {
      return;
    }
    
    if (piece.player !== currentPlayer) return;
    
    const canPlace = piece.fromReserve 
      ? canPlacePiece(row, col, piece.size, piece.player)
      : canMovePiece(piece.row, piece.col, row, col);

    if (canPlace) {
      const success = placePiece(
        row, 
        col, 
        piece.size, 
        piece.fromReserve,
        piece.row,
        piece.col
      );
      
      if (success) {
        setSelectedPiece(null);
      }
    }
  };

  const handleNewGame = () => {
    resetGame();
    setSelectedPiece(null);
    setGameResult(null);
    setShowConfetti(false);
  };

  const handleCancelSelection = () => {
    setSelectedPiece(null);
  };

  const getPlayerName = (player) => {
    return player === PLAYERS.PLAYER1 ? 'Grønn' : 'Oransje';
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎮 Nim-Nam-Nom</h1>
        <div className="header-buttons">
          {selectedPiece && (
            <button className="cancel-btn" onClick={handleCancelSelection}>
              Avbryt valg
            </button>
          )}
          <button className="new-game-btn" onClick={handleNewGame}>
            Nytt spill
          </button>
        </div>
      </header>

      <main className="game-container">
        {/* Player 1 pieces - top */}
        <PieceReserve
          reserves={reserves[PLAYERS.PLAYER1]}
          player={PLAYERS.PLAYER1}
          isCurrentPlayer={currentPlayer === PLAYERS.PLAYER1}
          onPieceSelect={handlePieceSelect}
          selectedPiece={selectedPiece}
          PIECE_SIZES={PIECE_SIZES}
          COLORS={COLORS}
        />

        {/* Game board */}
        <div className="board-container">
          <GameBoard
            board={board}
            onCellClick={handleCellClick}
            validMoves={validMoves}
            winningLine={gameResult?.line}
            onDrop={handleDrop}
            currentPlayer={currentPlayer}
            selectedPiece={selectedPiece}
          />
        </div>

        {/* Player 2 pieces - bottom */}
        <PieceReserve
          reserves={reserves[PLAYERS.PLAYER2]}
          player={PLAYERS.PLAYER2}
          isCurrentPlayer={currentPlayer === PLAYERS.PLAYER2}
          onPieceSelect={handlePieceSelect}
          selectedPiece={selectedPiece}
          PIECE_SIZES={PIECE_SIZES}
          COLORS={COLORS}
        />
      </main>


      {/* Version number */}
      <div className="version-info">
        v{packageJson.version}
      </div>

      {/* Update prompt */}
      <UpdatePrompt />
      
      {/* Confetti effect */}
      <ConfettiEffect isActive={showConfetti} duration={4000} />
    </div>
  );
}

export default App;