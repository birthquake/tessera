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
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    matched:  false,
    matchId:  null,
    inPool:   false,
  });
}
