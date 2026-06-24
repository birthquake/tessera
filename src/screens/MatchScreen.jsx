// src/screens/MatchScreen.jsx
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { acceptMatch, passMatch } from '../firebase/acceptMatch';
import './MatchScreen.css';

export default function MatchScreen({ matchData, currentUser, onBothAccepted, onPass, onOpenSettings }) {
  const [match, setMatch]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [waiting, setWaiting]   = useState(false);

  // Watch the match doc for status changes
  useEffect(() => {
    const matchRef = doc(db, 'matches', matchData.matchId);

    const unsub = onSnapshot(matchRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      setMatch(data);
      setLoading(false);

      if (data.status === 'passed') {
        onPass();
        return;
      }

      if (data[`accepted_${currentUser.uid}`]) {
        setAccepted(true);
        setWaiting(true);
      }

      const [uid1, uid2] = data.users || [];
      if (data[`accepted_${uid1}`] && data[`accepted_${uid2}`]) {
        onBothAccepted();
      }
    });

    return () => unsub();
  }, [matchData.matchId, currentUser.uid, onBothAccepted, onPass]);

  // Also watch the user's own doc — if matched flips to false, go back to waiting
  useEffect(() => {
    const userRef = doc(db, 'users', currentUser.uid);

    const unsub = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      if (data.matched === false && data.matchId === null) {
        onPass();
      }
    });

    return () => unsub();
  }, [currentUser.uid, onPass]);

  async function handleAccept() {
    setAccepted(true);
    setWaiting(true);
    try {
      await acceptMatch(matchData.matchId, currentUser.uid);
    } catch (err) {
      console.error('Accept error:', err);
      setAccepted(false);
      setWaiting(false);
    }
  }

  async function handlePass() {
    try {
      await passMatch(matchData.matchId, currentUser.uid);
      onPass();
    } catch (err) {
      console.error('Pass error:', err);
    }
  }

  if (loading) {
    return (
      <div className="match-loading">
        <div className="tessera-mark">✦ Tessera ✦</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="match-loading">
        <div className="tessera-mark">✦ Tessera ✦</div>
        <p style={{ color: 'var(--color-violet)', fontSize: '14px', marginTop: '16px' }}>
          Something went wrong loading your match.
        </p>
      </div>
    );
  }

  const isUser1     = match.user1.uid === currentUser.uid;
  const matchedUser = isUser1 ? match.user2 : match.user1;
  const suggestion  = match.suggestion;
  const initials    = matchedUser.name ? matchedUser.name.charAt(0).toUpperCase() : '?';

  const sharedInterests = (match.user1.interests || []).filter(i =>
    (match.user2.interests || []).includes(i)
  );

  return (
    <div className="match-screen">
      <div className="match-bg" />

      <button className="match-settings" onClick={onOpenSettings}>✦</button>

      <div className="match-hero">
        <div className="match-rings">
          <div className="match-ring ring-outer" />
          <div className="match-ring ring-inner" />
          <div className="match-avatar">{initials}</div>
        </div>
      </div>

      <div className="match-overlay">
        <div className="match-pill">Your match</div>
        <h2 className="match-name">{matchedUser.name}</h2>

        {sharedInterests.length > 0 && (
          <div className="match-tags">
            {sharedInterests.map(interest => (
              <span key={interest} className="match-tag">{interest}</span>
            ))}
          </div>
        )}

        {suggestion && (
          <div className="match-suggestion">
            <div className="suggestion-eyebrow">✦ Tessera suggests</div>
            <p className="suggestion-activity">{suggestion.activity}</p>
            <p className="suggestion-meta">{suggestion.time}</p>
            {suggestion.reason && (
              <p className="suggestion-reason">{suggestion.reason}</p>
            )}
          </div>
        )}

        {waiting ? (
          <div className="match-waiting-other">
            <div className="tessera-mark" style={{ marginBottom: '8px' }}>✦</div>
            <p className="match-waiting-text">
              You're in. Waiting for {matchedUser.name} to accept.
            </p>
          </div>
        ) : (
          <div className="match-actions">
            <button className="match-pass" onClick={handlePass}>
              Pass
            </button>
            <button className="match-accept" onClick={handleAccept}>
              I'm in ✦
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
