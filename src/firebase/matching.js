// src/firebase/matching.js
import { db } from './config';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

export async function findMatch(userId) {
  const userRef  = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error('User profile not found');
  const user = userSnap.data();

  // Mark as in the pool
  await updateDoc(userRef, {
    inPool:  true,
    matched: user.matched ?? false,
  });

  // Fetch all users and filter manually
  const allUsersSnap = await getDocs(collection(db, 'users'));
  let bestMatch = null;

  for (const docSnap of allUsersSnap.docs) {
    const candidate = docSnap.data();
    if (candidate.uid === userId) continue;
    if (candidate.matched === true) continue;
    if (candidate.matchId) continue;        // skip anyone with a stale matchId

    const sharedInterests = (user.interests || []).filter(i =>
      (candidate.interests || []).includes(i)
    );
    const sharedDays = (user.availability || []).filter(d =>
      (candidate.availability || []).includes(d)
    );

    if (sharedInterests.length > 0 && sharedDays.length > 0) {
      bestMatch = candidate;
      break;
    }
  }

  if (!bestMatch) return null;

  // Call suggest API — backend handles Claude + all Firestore writes
  const response = await fetch('/api/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user1: user, user2: bestMatch }),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error || 'Suggest API failed');
  }

  if (!json.matchId || !json.suggestion) {
    throw new Error('Incomplete response from suggest API');
  }

  return {
    matchId:     json.matchId,
    matchedUser: bestMatch,
    suggestion:  json.suggestion,
  };
}
