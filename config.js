// ─────────────────────────────────────────
//  TESSERA — Firebase Configuration
//
//  HOW TO SET THIS UP:
//  1. Go to console.firebase.google.com
//  2. Create a new project called "tessera"
//  3. Click "Add app" → Web
//  4. Copy your config values below
//  5. Enable Authentication (Email/Password)
//  6. Create a Firestore database
// ─────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyD20XtFQyxHxkiD_hP8cEs4wHb-_Ec1a4s",
  authDomain:        "tiletalk-723ad.firebaseapp.com",
  projectId:         "tiletalk-723ad",
  storageBucket:     "tiletalk-723ad.firebasestorage.app",
  messagingSenderId: "422643503965",
  appId:             "1:422643503965:web:1a2b5e33935e70b61f0eb4"
};

const app  = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
