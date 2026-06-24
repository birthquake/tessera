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
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE"
};

const app  = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
