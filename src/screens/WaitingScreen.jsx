// src/screens/WaitingScreen.jsx
import { useEffect, useState } from 'react';
import { findMatch } from '../firebase/matching';
import './WaitingScreen.css';

export default function WaitingScreen({ userId, onMatchFound }) {
  const [status, setStatus] = useState('searching');

  useEffect(() => {
    let interval;

    async function search() {
      try {
        const result = await findMatch(userId);
        if (result) {
          clearInterval(interval);
          onMatchFound(result);
        }
      } catch (err) {
        console.error('Matching error:', err);
      }
    }

    // Search immediately, then every 10 seconds
    search();
    interval = setInterval(search, 10000);

    return () => clearInterval(interval);
  }, [userId, onMatchFound]);

  return (
    <div className="waiting">
      <div className="waiting-texture" />
      <div className="waiting-content">
        <div className="waiting-mark">✦ Tessera ✦</div>
        <div className="waiting-pulse">
          <div className="pulse-ring ring-1" />
          <div className="pulse-ring ring-2" />
          <div className="pulse-ring ring-3" />
          <div className="pulse-core">✦</div>
        </div>
        <h2 className="waiting-title">Finding your match.</h2>
        <p className="waiting-sub">
          We're looking for someone whose world overlaps with yours.
          This won't take long.
        </p>
      </div>
    </div>
  );
}
