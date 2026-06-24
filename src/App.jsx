// src/App.jsx
import { useState } from 'react';
import LandingScreen from './screens/LandingScreen';

export default function App() {
  const [screen, setScreen] = useState('landing');

  return (
    <div className="app-shell">
      <div className="screen">

        {screen === 'landing' && (
          <LandingScreen
            onGetStarted={() => setScreen('onboarding')}
            onSignIn={() => setScreen('signin')}
          />
        )}

        {screen === 'onboarding' && (
          <Placeholder label="Onboarding" note="Phase 2 — next step" />
        )}

        {screen === 'signin' && (
          <Placeholder label="Sign in" note="Phase 2" />
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
      <p style={{ fontSize: '13px', color: 'var(--color-violet-dim)' }}>{note}</p>
    </div>
  );
}
