import React from 'react';
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
    if (onDrop) {
      onDrop(row, col, e);
    }
  };

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`board-cell ${isValidMove(rowIndex, colIndex) ? `valid-move player-${currentPlayer}` : ''} ${isWinningCell(rowIndex, colIndex) ? 'winning-cell' : ''}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
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
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('text/plain', JSON.stringify({
                            size: piece.size,
                            player: piece.player,
                            fromReserve: false,
                            row: rowIndex,
                            col: colIndex
                          }));
                          e.target.style.opacity = '0.7';
                        }
                      }}
                      onDragEnd={(e) => {
                        if (isTopPiece) {
                          e.target.style.opacity = '1';
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