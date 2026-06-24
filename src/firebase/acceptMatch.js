// src/firebase/acceptMatch.js
import { db } from './config';
import { doc, updateDoc } from 'firebase/firestore';

export async function acceptMatch(matchId, userId) {
  const matchRef = doc(db, 'matches', matchId);
  await updateDoc(matchRef, {
    [`accepted_${userId}`]: true,
  });
}

export async function passMatch(matchId, userId) {
  const response = await fetch('/api/resetMatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId, userId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to reset match');
  }
}
