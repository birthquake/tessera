// src/screens/WaitingScreen.jsx
import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { findMatch } from '../firebase/matching';
import './WaitingScreen.css';

export default function WaitingScreen({ userId, onMatchFound, onOpenSettings }) {
  useEffect(() => {
    const userRef = doc(db, 'users', userId);
    const unsub = onSnapshot(userRef, async (snap) => {
      if (!snap.exists()) return;
      const userData = snap.data();
      if (userData.matched === true && userData.matchId) {
        onMatchFound({ matchId: userData.matchId });
        return;
      }
    });

    async function tryMatch() {
      try {
        const result = await findMatch(userId);
        if (result) {
          onMatchFound(result);
        }
      } catch (err) {
        console.error('Matching error:', err);
      }
    }

    tryMatch();
    const interval = setInterval(tryMatch, 10000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [userId, onMatchFound]);

  return (
    <div className="waiting">
      <div className="waiting-texture" />
      <button className="waiting-settings" onClick={onOpenSettings}>
        ✦
      </button>
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
