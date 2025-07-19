import React, { useEffect, useState } from 'react';
import './UpdatePrompt.css';

const UpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [newWorker, setNewWorker] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newSW = registration.installing;
          if (newSW) {
            newSW.addEventListener('statechange', () => {
              if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                setNewWorker(newSW);
                setShowPrompt(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (newWorker) {
      newWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="update-prompt">
      <div className="update-content">
        <p>🎮 Ny versjon av Nim-Nam-Nom er tilgjengelig!</p>
        <div className="update-buttons">
          <button onClick={handleUpdate} className="update-btn">
            Oppdater nå
          </button>
          <button onClick={() => setShowPrompt(false)} className="dismiss-btn">
            Senere
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;