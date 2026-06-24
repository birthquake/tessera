// src/App.jsx
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import LandingScreen from './screens/LandingScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import SignInScreen from './screens/SignInScreen';
import WaitingScreen from './screens/WaitingScreen';
import MatchScreen from './screens/MatchScreen';
import ChatScreen from './screens/ChatScreen';

export default function App() {
  const [screen, setScreen]       = useState('loading');
  const [user, setUser]           = useState(null);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const fallback = setTimeout(() => {
      setScreen(prev => prev === 'loading' ? 'landing' : prev);
    }, 5000);

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      clearTimeout(fallback);
      if (firebaseUser) {
        setUser(firebaseUser);
        setScreen('waiting');
      } else {
        setScreen('landing');
      }
    });

    return () => {
      clearTimeout(fallback);
      unsub();
    };
  }, []);

  function handleMatchFound(result) {
    setMatchData(result);
    setScreen('match');
  }

  function handleBothAccepted() {
    setScreen('chat');
  }

  function handlePass() {
    setMatchData(null);
    setScreen('waiting');
  }

  return (
    <div className="app-shell">
      <div className="screen">

        {screen === 'loading' && (
          <LoadingScreen />
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

        {screen === 'waiting' && user && (
          <WaitingScreen
            userId={user.uid}
            onMatchFound={handleMatchFound}
          />
        )}

        {screen === 'match' && matchData && user && (
          <MatchScreen
            matchData={matchData}
            currentUser={user}
            onBothAccepted={handleBothAccepted}
            onPass={handlePass}
          />
        )}

        {screen === 'chat' && matchData && user && (
          <ChatScreen
            matchData={matchData}
            currentUser={user}
          />
        )}

      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A0E05 0%, #0D0B14 50%, #0A1A0E 100%)',
    }}>
      <div className="tessera-mark">✦ Tessera ✦</div>
    </div>
  );
}
