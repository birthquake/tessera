// src/firebase/auth.js
import { auth, db } from './config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function createUserProfile(email, password, userData) {
  // 1. Create the auth account
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // 2. Save profile to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid:          user.uid,
    email:        email,
    name:         userData.name,
    age:          Number(userData.age),
    interests:    userData.interests,
    availability: userData.availability,
    matched:      false,
    matchId:      null,
    createdAt:    serverTimestamp(),
  });

  return user;
}
