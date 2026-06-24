// src/screens/WaitingScreen.jsx
import { useEffect, useState } from 'react';
import { findMatch } from '../firebase/matching';
import './WaitingScreen.css';

export default function WaitingScreen({ userId, onMatchFound }) {
  const [debugMsg, setDebugMsg] = useState('Searching…');

  useEffect(() => {
    let interval;

    async function search() {
      try {
        setDebugMsg('Checking for matches…');
        const result = await findMatch(userId);
        if (result) {
          clearInterval(interval);
          setDebugMsg('Match found!');
          onMatchFound(result);
        } else {
          setDebugMsg('No match yet — checking again in 10s');
        }
      } catch (err) {
        setDebugMsg('Error: ' + err.message);
        console.error('Matching error:', err);
      }
    }

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
        <p style={{
          fontSize: '11px',
          color: 'var(--color-violet-dim)',
          fontFamily: 'var(--font-body)',
          marginTop: '8px',
        }}>
          {debugMsg}
        </p>
      </div>
    </div>
  );
}
