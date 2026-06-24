// ─────────────────────────────────────────
//  TESSERA — App Root
//  Phase 1: Foundation skeleton
//  Screens are added in later phases.
// ─────────────────────────────────────────

import { useState } from 'react';

export default function App() {
  const [screen, setScreen] = useState('landing');

  return (
    <div className="app-shell">
      <div className="screen">

        {screen === 'landing' && (
          <LandingPlaceholder onContinue={() => setScreen('onboarding')} />
        )}

        {screen === 'onboarding' && (
          <Placeholder label="Onboarding" note="Phase 2" />
        )}

      </div>
    </div>
  );
}

// ── Temporary landing placeholder ──────
// Full landing screen built in Phase 2
function LandingPlaceholder({ onContinue }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div className="tessera-mark">✦ Tessera ✦</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 400, fontStyle: 'italic' }}>
        Tessera
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--color-violet)', maxWidth: '260px' }}>
        Foundation live. Phase 2 builds the landing screen.
      </p>
      <button className="btn-primary" onClick={onContinue}
        style={{ maxWidth: '280px' }}>
        Continue to onboarding →
      </button>
    </div>
  );
}

// ── Generic placeholder for future screens
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
      <p style={{ fontSize: '13px', color: 'var(--color-violet-dim)' }}>Coming in {note}</p>
    </div>
  );
}
