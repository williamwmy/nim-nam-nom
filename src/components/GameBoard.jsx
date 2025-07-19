import React, { useState, useEffect } from 'react';
import './GameBoard.css';

const GameBoard = ({ 
  board, 
  onCellClick, 
  validMoves = [], 
  winningLine = null,
  onDragOver,
  onDrop,
  currentPlayer,
  selectedPiece
}) => {
  const [placingPieces, setPlacingPieces] = useState(new Set());
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  
  // Track when new pieces are added to trigger animation
  useEffect(() => {
    const currentPieceIds = new Set();
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        cell.forEach(piece => {
          currentPieceIds.add(piece.id);
        });
      });
    });
    
    // Clear old placing animations
    setPlacingPieces(prev => {
      const newSet = new Set();
      prev.forEach(id => {
        if (currentPieceIds.has(id)) {
          newSet.add(id);
        }
      });
      return newSet;
    });
  }, [board]);
  const isValidMove = (row, col) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  const isWinningCell = (row, col) => {
    if (!winningLine) return false;
    return winningLine.some(([winRow, winCol]) => winRow === row && winCol === col);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.target.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.target.classList.remove('drag-over');
  };

  const handleDrop = (e, row, col) => {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    // Add highlight animation to cell
    const cellKey = `${row}-${col}`;
    setHighlightedCells(prev => new Set(prev).add(cellKey));
    setTimeout(() => {
      setHighlightedCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });
    }, 300);
    
    if (onDrop) {
      onDrop(row, col, e);
    }
  };
  
  const handleCellClick = (row, col) => {
    // Add highlight animation to cell
    const cellKey = `${row}-${col}`;
    setHighlightedCells(prev => new Set(prev).add(cellKey));
    setTimeout(() => {
      setHighlightedCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });
    }, 300);
    
    onCellClick(row, col);
  };

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`board-cell ${isValidMove(rowIndex, colIndex) ? `valid-move player-${currentPlayer}` : ''} ${isWinningCell(rowIndex, colIndex) ? 'winning-cell' : ''} ${highlightedCells.has(`${rowIndex}-${colIndex}`) ? 'highlight' : ''}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
            >
              <div className="cell-pieces">
                {cell.map((piece, pieceIndex) => {
                  const isTopPiece = pieceIndex === cell.length - 1;
                  const isSelectedPiece = selectedPiece && !selectedPiece.fromReserve && 
                    selectedPiece.row === rowIndex && selectedPiece.col === colIndex && 
                    selectedPiece.size === piece.size && selectedPiece.player === piece.player;
                  const canSelectPiece = isTopPiece && piece.player === currentPlayer && 
                    selectedPiece && !isSelectedPiece;
                    
                  return (
                    <div
                      key={piece.id}
                      className={`piece ${piece.size} player-${piece.player} ${isTopPiece ? 'clickable' : ''} ${isSelectedPiece ? 'selected' : ''} ${canSelectPiece ? 'alternative' : ''}`}
                      style={{
                        zIndex: pieceIndex + 1,
                        transform: `scale(${1 - pieceIndex * 0.05})`,
                        pointerEvents: isTopPiece ? 'auto' : 'none'
                      }}
                      draggable={isTopPiece}
                      onDragStart={(e) => {
                        if (isTopPiece) {
                          // Immediate drag setup with minimal delay
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.dropEffect = 'move';
                          e.dataTransfer.dragImage = e.currentTarget;
                          
                          // Set drag data immediately in multiple formats
                          const dragData = JSON.stringify({
                            size: piece.size,
                            player: piece.player,
                            fromReserve: false,
                            row: rowIndex,
                            col: colIndex
                          });
                          e.dataTransfer.setData('text/plain', dragData);
                          e.dataTransfer.setData('application/json', dragData);
                          e.dataTransfer.setData('text/x-drag-data', dragData);
                          
                          // Instant visual feedback without transform to prevent revealing pieces below
                          requestAnimationFrame(() => {
                            e.currentTarget.style.opacity = '0.7';
                            e.currentTarget.style.zIndex = '1000';
                            e.currentTarget.style.transition = 'none';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
                          });
                        }
                      }}
                      onDragEnd={(e) => {
                        if (isTopPiece) {
                          // Reset visual state immediately with smooth transition
                          requestAnimationFrame(() => {
                            e.currentTarget.style.transition = 'all 0.2s ease';
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.zIndex = pieceIndex + 1;
                            e.currentTarget.style.boxShadow = '';
                          });
                        }
                      }}
                    >
                      <div className="piece-inner">
                        <div className="piece-face">
                          {piece.size === 'large' && '😊'}
                          {piece.size === 'medium' && '🙂'}
                          {piece.size === 'small' && '😄'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {isValidMove(rowIndex, colIndex) && (
                <div className={`valid-move-indicator player-${currentPlayer}`}></div>
              )}
            </div>
          ))}
        </div>
      ))}
      {winningLine && (
        <div className="winning-line">
          <div className="line-overlay"></div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;