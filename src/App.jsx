// src/App.jsx
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import LandingScreen from './screens/LandingScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import SignInScreen from './screens/SignInScreen';

export default function App() {
  const [screen, setScreen]   = useState('loading');
  const [user, setUser]       = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setScreen('waiting');
      } else {
        setScreen('landing');
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="app-shell">
      <div className="screen">

        {screen === 'loading' && (
          <Placeholder label="✦" note="" />
        )}

        {screen === 'landing' && (
          <LandingScreen
            onGetStarted={() => setScreen('onboarding')}
            onSignIn={() => setScreen('signin')}
          />
        )}

        {screen === 'onboarding' && (
          <OnboardingScreen onComplete={() => setScreen('waiting')} />
        )}

        {screen === 'signin' && (
          <SignInScreen
            onSuccess={() => setScreen('waiting')}
            onBack={() => setScreen('landing')}
          />
        )}

        {screen === 'waiting' && (
          <Placeholder label="Finding your match…" note="Phase 3" />
        )}

      </div>
    </div>
  );
}

function Placeholder({ label, note }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      textAlign: 'center',
      padding: '40px 24px',
    }}>
      <div className="tessera-mark">✦ Tessera ✦</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontStyle: 'italic' }}>{label}</h2>
      {note && <p style={{ fontSize: '13px', color: 'var(--color-violet-dim)' }}>{note}</p>}
    </div>
  );
}
