// src/screens/MatchProfileScreen.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './MatchProfileScreen.css';

export default function MatchProfileScreen({ matchData, currentUser, onBack }) {
  const [matchedUser, setMatchedUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const matchRef  = doc(db, 'matches', matchData.matchId);
        const matchSnap = await getDoc(matchRef);
        if (matchSnap.exists()) {
          const data    = matchSnap.data();
          const isUser1 = data.user1.uid === currentUser.uid;
          setMatchedUser(isUser1 ? data.user2 : data.user1);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [matchData.matchId, currentUser.uid]);

  if (loading) {
    return (
      <div className="mp-loading">
        <div className="tessera-mark">✦ Tessera ✦</div>
      </div>
    );
  }

  if (!matchedUser) {
    return (
      <div className="mp-loading">
        <div className="tessera-mark">✦ Tessera ✦</div>
        <p style={{ color: 'var(--color-violet)', fontSize: '14px', marginTop: '16px' }}>
          Couldn't load this profile.
        </p>
      </div>
    );
  }

  const initials = matchedUser.name
    ? matchedUser.name.charAt(0).toUpperCase()
    : '?';

  return (
    <div className="mp-screen">
      <div className="mp-bg" />

      {/* Back button */}
      <button className="mp-back" onClick={onBack}>←</button>

      {/* Avatar */}
      <div className="mp-hero">
        <div className="mp-rings">
          <div className="mp-ring ring-outer" />
          <div className="mp-ring ring-inner" />
          <div className="mp-avatar">{initials}</div>
        </div>
      </div>

      {/* Info */}
      <div className="mp-overlay">
        <div className="mp-pill">Your match</div>
        <h2 className="mp-name">{matchedUser.name}</h2>

        {matchedUser.age && (
          <p className="mp-age">{matchedUser.age} years old</p>
        )}

        {matchedUser.interests?.length > 0 && (
          <>
            <p className="mp-section-label">Interests</p>
            <div className="mp-tags">
              {matchedUser.interests.map(interest => (
                <span key={interest} className="mp-tag">{interest}</span>
              ))}
            </div>
          </>
        )}

        {matchedUser.availability?.length > 0 && (
          <>
            <p className="mp-section-label">Usually free</p>
            <div className="mp-tags">
              {matchedUser.availability.map(day => (
                <span key={day} className="mp-tag">{day}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
