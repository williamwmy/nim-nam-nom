import React, { useEffect, useRef } from 'react';
import './ConfettiEffect.css';

const ConfettiEffect = ({ isActive, duration = 3000 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const confettiPieces = [];
    const colors = ['#FFD700', '#FF6B6B', '#4CAF50', '#FF9800', '#9C27B0', '#2196F3'];
    const shapes = ['circle', 'square', 'triangle'];

    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 8 + 4; // 4-12px
      const initialX = Math.random() * window.innerWidth;
      const initialY = -20;
      const fallDuration = Math.random() * 2000 + 2000; // 2-4 seconds
      const horizontalDrift = (Math.random() - 0.5) * 200; // -100px to +100px
      const rotation = Math.random() * 720; // 0-720 degrees

      piece.className = `confetti-piece confetti-${shape}`;
      piece.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        left: ${initialX}px;
        top: ${initialY}px;
        pointer-events: none;
        z-index: 10000;
        animation: 
          confetti-fall ${fallDuration}ms linear forwards,
          confetti-rotate ${fallDuration}ms linear forwards;
        --horizontal-drift: ${horizontalDrift}px;
        --rotation-end: ${rotation}deg;
      `;

      container.appendChild(piece);
      confettiPieces.push(piece);

      // Remove piece after animation
      setTimeout(() => {
        if (piece.parentNode) {
          piece.parentNode.removeChild(piece);
        }
      }, fallDuration);
    }

    // Cleanup all pieces after duration
    const cleanup = setTimeout(() => {
      confettiPieces.forEach(piece => {
        if (piece.parentNode) {
          piece.parentNode.removeChild(piece);
        }
      });
    }, duration);

    return () => {
      clearTimeout(cleanup);
      confettiPieces.forEach(piece => {
        if (piece.parentNode) {
          piece.parentNode.removeChild(piece);
        }
      });
    };
  }, [isActive, duration]);

  if (!isActive) return null;

  return <div ref={containerRef} className="confetti-container" />;
};

export default ConfettiEffect;