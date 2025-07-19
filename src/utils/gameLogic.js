export const checkWinCondition = (board) => {
  const getTopPiece = (row, col) => {
    const cell = board[row][col];
    return cell.length > 0 ? cell[cell.length - 1] : null;
  };

  const checkLine = (positions) => {
    const pieces = positions.map(([row, col]) => getTopPiece(row, col));
    
    if (pieces.some(piece => piece === null)) return null;
    
    const firstPlayer = pieces[0].player;
    if (pieces.every(piece => piece.player === firstPlayer)) {
      return { player: firstPlayer, line: positions };
    }
    
    return null;
  };

  // Check rows
  for (let row = 0; row < 3; row++) {
    const result = checkLine([[row, 0], [row, 1], [row, 2]]);
    if (result) return result;
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    const result = checkLine([[0, col], [1, col], [2, col]]);
    if (result) return result;
  }

  // Check diagonals
  const diagonal1 = checkLine([[0, 0], [1, 1], [2, 2]]);
  if (diagonal1) return diagonal1;

  const diagonal2 = checkLine([[0, 2], [1, 1], [2, 0]]);
  if (diagonal2) return diagonal2;

  return null;
};

export const getValidMoves = (board, reserves, currentPlayer, selectedPiece) => {
  const validMoves = [];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = board[row][col];
      
      if (selectedPiece.fromReserve) {
        // Placing from reserve
        if (cell.length === 0) {
          validMoves.push({ row, col });
        } else {
          const topPiece = cell[cell.length - 1];
          const sizeOrder = ['small', 'medium', 'large'];
          const selectedSizeIndex = sizeOrder.indexOf(selectedPiece.size);
          const topSizeIndex = sizeOrder.indexOf(topPiece.size);
          
          if (selectedSizeIndex > topSizeIndex) {
            validMoves.push({ row, col });
          }
        }
      } else {
        // Moving from board
        if (selectedPiece.row === row && selectedPiece.col === col) {
          continue; // Can't move to same position
        }
        
        if (cell.length === 0) {
          validMoves.push({ row, col });
        } else {
          const topPiece = cell[cell.length - 1];
          const sizeOrder = ['small', 'medium', 'large'];
          const selectedSizeIndex = sizeOrder.indexOf(selectedPiece.size);
          const topSizeIndex = sizeOrder.indexOf(topPiece.size);
          
          if (selectedSizeIndex > topSizeIndex) {
            validMoves.push({ row, col });
          }
        }
      }
    }
  }

  return validMoves;
};