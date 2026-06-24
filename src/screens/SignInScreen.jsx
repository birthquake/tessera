// src/screens/SignInScreen.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import './SignInScreen.css';

export default function SignInScreen({ onSuccess, onBack }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSignIn() {
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err) {
      setError(friendlyError(err.code));
      setLoading(false);
    }
  }

  function friendlyError(code) {
    switch (code) {
      case 'auth/invalid-email':       return 'Please enter a valid email address.';
      case 'auth/user-not-found':      return 'No account found with that email.';
      case 'auth/wrong-password':      return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':  return 'Incorrect email or password.';
      case 'auth/too-many-requests':   return 'Too many attempts. Please try again later.';
      default:                         return 'Something went wrong. Please try again.';
    }
  }

  function canSignIn() {
    return email.trim().length > 0 && password.length >= 6;
  }

  return (
    <div className="signin">
      <div className="signin-texture" />

      <div className="signin-header">
        <button className="signin-back" onClick={onBack}>← Back</button>
      </div>

      <div className="signin-content">
        <div className="signin-mark">✦ Tessera ✦</div>
        <h2 className="signin-title">Welcome back.</h2>
        <p className="signin-sub">Sign in to find your match.</p>

        <div className="signin-fields">
          <div className="signin-field-group">
            <label className="signin-label">Email</label>
            <input
              className="signin-input"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div className="signin-field-group">
            <label className="signin-label">Password</label>
            <input
              className="signin-input"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canSignIn() && handleSignIn()}
            />
          </div>
          {error && <p className="signin-error">{error}</p>}
        </div>
      </div>

      <div className="signin-footer">
        <button
          className="btn-gold"
          onClick={handleSignIn}
          disabled={!canSignIn() || loading}
          style={{ opacity: canSignIn() && !loading ? 1 : 0.4 }}
        >
          {loading ? 'Signing in…' : 'Sign in ✦'}
        </button>
      </div>
    </div>
  );
}
