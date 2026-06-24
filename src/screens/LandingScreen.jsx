// src/screens/LandingScreen.jsx
import './LandingScreen.css';

export default function LandingScreen({ onGetStarted, onSignIn }) {
  return (
    <div className="landing">
      <div className="landing-texture" />
      <div className="landing-mark">✦ Tessera ✦</div>
      <div className="landing-content">
        <div className="landing-rule" />
        <h1 className="landing-headline">
          The world is full of{' '}
          <span className="landing-highlight">people</span>{' '}
          you haven't met yet.
        </h1>
        <p className="landing-body">
          Tessera finds one. Suggests something real to do. Then gets out of the way.
        </p>
        <div className="landing-actions">
          <button className="btn-primary" onClick={onGetStarted}>
            Find my match
          </button>
          <button className="btn-ghost" onClick={onSignIn}>
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
