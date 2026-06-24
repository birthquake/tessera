// src/screens/SettingsScreen.jsx
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import './SettingsScreen.css';

export default function SettingsScreen({ user, onBack, onSignOut }) {
  async function handleSignOut() {
    try {
      // Remove from pool before signing out
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          inPool: false,
        });
      }
      await signOut(auth);
      onSignOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }

  return (
    <div className="settings-screen">
      <div className="settings-texture" />

      <div className="settings-header">
        <button className="settings-back" onClick={onBack}>← Back</button>
      </div>

      <div className="settings-content">
        <div className="tessera-mark">✦ Tessera ✦</div>
        <h2 className="settings-title">Settings</h2>

        {user && (
          <div className="settings-card">
            <div className="settings-label">Signed in as</div>
            <div className="settings-value">{user.email}</div>
          </div>
        )}

        <button className="settings-signout" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
