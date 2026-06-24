// src/firebase/matching.js
import { db } from './config';
import {
  collection, doc, getDoc, getDocs,
  updateDoc, setDoc, query, where, serverTimestamp
} from 'firebase/firestore';

export async function findMatch(userId) {
  const userRef  = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) throw new Error('User profile not found');

  const user = userSnap.data();

  // Mark as in the pool — also ensures matched field exists
  await updateDoc(userRef, {
    inPool:  true,
    matched: user.matched ?? false,
  });

  // Fetch all users and filter manually
  // This avoids query failures from missing fields on older documents
  const allUsersSnap = await getDocs(collection(db, 'users'));

  let bestMatch = null;

  for (const docSnap of allUsersSnap.docs) {
    const candidate = docSnap.data();

    // Skip self
    if (candidate.uid === userId) continue;

    // Skip already matched users
    if (candidate.matched === true) continue;

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

  // Get activity suggestion from Claude
  const response = await fetch('/api/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user1: user, user2: bestMatch }),
  });

  const { suggestion } = await response.json();

  // Create the match record
  const matchRef = doc(collection(db, 'matches'));
  await setDoc(matchRef, {
    matchId:    matchRef.id,
    users:      [userId, bestMatch.uid],
    user1:      { uid: user.uid,      name: user.name,      interests: user.interests },
    user2:      { uid: bestMatch.uid, name: bestMatch.name, interests: bestMatch.interests },
    suggestion: suggestion,
    status:     'pending',
    createdAt:  serverTimestamp(),
  });

  // Update both users as matched
  await updateDoc(doc(db, 'users', userId), {
    matched: true,
    matchId: matchRef.id,
    inPool:  false,
  });

  await updateDoc(doc(db, 'users', bestMatch.uid), {
    matched: true,
    matchId: matchRef.id,
    inPool:  false,
  });

  return { matchId: matchRef.id, matchedUser: bestMatch, suggestion };
}
