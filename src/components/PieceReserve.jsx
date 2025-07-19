import React from 'react';
import './PieceReserve.css';

const PieceReserve = ({ 
  reserves, 
  player, 
  isCurrentPlayer, 
  onPieceSelect,
  selectedPiece,
  PIECE_SIZES,
  COLORS 
}) => {
  const handlePieceClick = (size) => {
    if (!isCurrentPlayer || reserves[size] <= 0) return;
    onPieceSelect({ size, player, fromReserve: true });
  };

  const handleDragStart = (e, size) => {
    if (!isCurrentPlayer || reserves[size] <= 0) {
      e.preventDefault();
      return;
    }
    
    // Immediate drag setup with minimal delay for smooth experience
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.dragImage = e.currentTarget;
    
    // Set drag data in multiple formats for maximum compatibility
    const dragData = JSON.stringify({
      size,
      player,
      fromReserve: true,
      row: null,
      col: null
    });
    e.dataTransfer.setData('text/plain', dragData);
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.setData('text/x-drag-data', dragData);
    
    // Instant visual feedback using requestAnimationFrame for smooth performance
    requestAnimationFrame(() => {
      e.currentTarget.style.opacity = '0.7';
      e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
      e.currentTarget.style.zIndex = '1000';
      e.currentTarget.style.transition = 'none';
    });
  };

  const handleDragEnd = (e) => {
    // Reset visual state with smooth transition
    requestAnimationFrame(() => {
      e.target.style.transition = 'all 0.2s ease';
      e.target.style.opacity = '1';
      e.target.style.transform = '';
      e.target.style.zIndex = '';
    });
  };

  const getPlayerName = (player) => {
    return player === 1 ? 'Grønn' : 'Oransje';
  };

  const getSizeText = (size) => {
    switch(size) {
      case PIECE_SIZES.SMALL: return 'Små';
      case PIECE_SIZES.MEDIUM: return 'Mellom';
      case PIECE_SIZES.LARGE: return 'Store';
      default: return '';
    }
  };

  return (
    <div className={`piece-reserve player-${player} ${isCurrentPlayer ? 'active' : ''}`}>
      <div className="player-header">
        <h3 style={{ color: COLORS[player] }}>
          {getPlayerName(player)}
          {isCurrentPlayer && ' (Din tur)'}
        </h3>
      </div>
      
      <div className="pieces-container">
        {Object.entries(PIECE_SIZES).map(([key, size]) => (
          <div key={size} className="piece-group">
            <div className="piece-label">
              {getSizeText(size)}: {reserves[size]}
            </div>
            <div className="piece-stack">
              {Array.from({ length: reserves[size] }, (_, index) => (
                <div
                  key={index}
                  className={`reserve-piece ${size} player-${player} ${
                    isCurrentPlayer && reserves[size] > 0 ? 'interactive' : 'disabled'
                  } ${
                    selectedPiece?.size === size && selectedPiece?.fromReserve && selectedPiece?.player === player 
                      ? 'selected' 
                      : ''
                  } ${
                    selectedPiece && isCurrentPlayer && reserves[size] > 0 && 
                    !(selectedPiece?.size === size && selectedPiece?.fromReserve && selectedPiece?.player === player)
                      ? 'alternative'
                      : ''
                  }`}
                  onClick={() => handlePieceClick(size)}
                  draggable={isCurrentPlayer && reserves[size] > 0}
                  onDragStart={(e) => handleDragStart(e, size)}
                  onDragEnd={handleDragEnd}
                  style={{
                    transform: `translateY(${index * -2}px)`,
                    zIndex: reserves[size] - index
                  }}
                >
                  <div className="piece-inner">
                    <div className="piece-face">
                      {size === 'large' && '😊'}
                      {size === 'medium' && '🙂'}
                      {size === 'small' && '😄'}
                    </div>
                  </div>
                </div>
              ))}
              {reserves[size] === 0 && (
                <div className="empty-stack">
                  Tom
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieceReserve;