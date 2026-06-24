// src/screens/MatchScreen.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './MatchScreen.css';

export default function MatchScreen({ matchData, currentUser, onAccept, onPass }) {
  const [match, setMatch]           = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    async function loadMatch() {
      try {
        // Load full match record from Firestore
        const matchRef  = doc(db, 'matches', matchData.matchId);
        const matchSnap = await getDoc(matchRef);

        if (matchSnap.exists()) {
          setMatch(matchSnap.data());
        }
      } catch (err) {
        console.error('Error loading match:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMatch();
  }, [matchData.matchId]);

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

  // Figure out which user is the match (not the current user)
  const isUser1      = match.user1.uid === currentUser.uid;
  const matchedUser  = isUser1 ? match.user2 : match.user1;
  const suggestion   = match.suggestion;

  // Get initials for avatar
  const initials = matchedUser.name
    ? matchedUser.name.charAt(0).toUpperCase()
    : '?';

  // Shared interests
  const sharedInterests = (match.user1.interests || []).filter(i =>
    (match.user2.interests || []).includes(i)
  );

  return (
    <div className="match-screen">

      {/* Background glow */}
      <div className="match-bg" />

      {/* Top section — avatar */}
      <div className="match-hero">
        <div className="match-rings">
          <div className="match-ring ring-outer" />
          <div className="match-ring ring-inner" />
          <div className="match-avatar">{initials}</div>
        </div>
      </div>

      {/* Bottom overlay — info */}
      <div className="match-overlay">

        <div className="match-pill">Your match</div>
        <h2 className="match-name">
          {matchedUser.name}
        </h2>

        {/* Shared interest tags */}
        {sharedInterests.length > 0 && (
          <div className="match-tags">
            {sharedInterests.map(interest => (
              <span key={interest} className="match-tag">{interest}</span>
            ))}
          </div>
        )}

        {/* Tessera suggestion */}
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

        {/* Actions */}
        <div className="match-actions">
          <button className="match-pass" onClick={onPass}>
            Pass
          </button>
          <button className="match-accept" onClick={onAccept}>
            I'm in ✦
          </button>
        </div>

      </div>
    </div>
  );
}
