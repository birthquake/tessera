// src/screens/WaitingScreen.jsx
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { findMatch } from '../firebase/matching';
import './WaitingScreen.css';

export default function WaitingScreen({ userId, onMatchFound }) {
  const [debugMsg, setDebugMsg] = useState('Looking for your match…');

  useEffect(() => {
    // First — listen in real time to the user's own document
    // If matched becomes true, move to match screen immediately
    const userRef = doc(db, 'users', userId);

    const unsub = onSnapshot(userRef, async (snap) => {
      if (!snap.exists()) return;
      const userData = snap.data();

      if (userData.matched === true && userData.matchId) {
        setDebugMsg('Match found!');
        onMatchFound({ matchId: userData.matchId });
        return;
      }

      // Not matched yet — try to find one
      setDebugMsg('Searching for a match…');
    });

    // Also actively try to find a match every 10 seconds
    // in case this user is the first one in the pool
    let interval;

    async function tryMatch() {
      try {
        const result = await findMatch(userId);
        if (result) {
          setDebugMsg('Match found!');
          // onMatchFound will also be triggered by the snapshot above
          // but call it here too in case of timing
          onMatchFound(result);
        } else {
          setDebugMsg('No match yet — checking again in 10s');
        }
      } catch (err) {
        setDebugMsg('Error: ' + err.message);
        console.error('Matching error:', err);
      }
    }

    tryMatch();
    interval = setInterval(tryMatch, 10000);

    return () => {
      unsub();
      clearInterval(interval);
    };
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
