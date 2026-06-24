// src/screens/OnboardingScreen.jsx
import { useState } from 'react';
import { createUserProfile } from '../firebase/auth';
import './OnboardingScreen.css';

const INTERESTS = [
  'Hiking', 'Photography', 'Coffee', 'Reading', 'Cooking',
  'Music', 'Art', 'Running', 'Film', 'Gaming', 'Yoga',
  'Travel', 'Cycling', 'Foodie', 'Volunteering', 'Dancing',
];

const DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday', 'Sunday',
];

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep]           = useState(1);
  const [name, setName]           = useState('');
  const [age, setAge]             = useState('');
  const [interests, setInterests] = useState([]);
  const [availability, setAvail]  = useState([]);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const totalSteps = 4;

  function toggleInterest(item) {
    setInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }

  function toggleDay(day) {
    setAvail(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  async function handleContinue() {
    setError('');
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        await createUserProfile(email, password, {
          name, age, interests, availability
        });
        onComplete();
      } catch (err) {
        setError(friendlyError(err.code));
        setLoading(false);
      }
    }
  }

  function canContinue() {
    if (step === 1) return name.trim().length > 0 && age.trim().length > 0;
    if (step === 2) return interests.length > 0;
    if (step === 3) return availability.length > 0;
    if (step === 4) return email.trim().length > 0 && password.length >= 6;
    return false;
  }

  function friendlyError(code) {
    switch (code) {
      case 'auth/email-already-in-use': return 'That email is already registered.';
      case 'auth/invalid-email':        return 'Please enter a valid email address.';
      case 'auth/weak-password':        return 'Password must be at least 6 characters.';
      default:                          return 'Something went wrong. Please try again.';
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding-texture" />

      <div className="ob-header">
        <div className="ob-progress">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`ob-progress-dot ${i < step ? 'active' : ''}`}
            />
          ))}
        </div>
        {step > 1 && (
          <button className="ob-back" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        )}
      </div>

      <div className="ob-content">

        {step === 1 && (
          <div className="ob-step-wrap">
            <div className="ob-eyebrow">Step 1 of 4</div>
            <h2 className="ob-title">Let's start with the basics.</h2>
            <p className="ob-sub">Just your first name and age — nothing more.</p>
            <div className="ob-fields">
              <div className="ob-field-group">
                <label className="ob-label">First name</label>
                <input
                  className="ob-input"
                  type="text"
                  placeholder="Your first name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="ob-field-group">
                <label className="ob-label">Age</label>
                <input
                  className="ob-input"
                  type="number"
                  placeholder="Your age"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  min="18"
                  max="99"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="ob-step-wrap">
            <div className="ob-eyebrow">Step 2 of 4</div>
            <h2 className="ob-title">What do you love doing?</h2>
            <p className="ob-sub">Pick as many as you like. This is how we find your match.</p>
            <div className="ob-chips">
              {INTERESTS.map(item => (
                <button
                  key={item}
                  className={`ob-chip ${interests.includes(item) ? 'active' : ''}`}
                  onClick={() => toggleInterest(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="ob-step-wrap">
            <div className="ob-eyebrow">Step 3 of 4</div>
            <h2 className="ob-title">When are you generally free?</h2>
            <p className="ob-sub">Pick the days that usually work for you.</p>
            <div className="ob-days">
              {DAYS.map(day => (
                <button
                  key={day}
                  className={`ob-day ${availability.includes(day) ? 'active' : ''}`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="ob-step-wrap">
            <div className="ob-eyebrow">Step 4 of 4</div>
            <h2 className="ob-title">Almost there.</h2>
            <p className="ob-sub">Create your account to save your profile.</p>
            <div className="ob-fields">
              <div className="ob-field-group">
                <label className="ob-label">Email</label>
                <input
                  className="ob-input"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="ob-field-group">
                <label className="ob-label">Password</label>
                <input
                  className="ob-input"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="ob-error">{error}</p>}
            </div>
          </div>
        )}

      </div>

      <div className="ob-footer">
        <button
          className="btn-gold"
          onClick={handleContinue}
          disabled={!canContinue() || loading}
          style={{ opacity: canContinue() && !loading ? 1 : 0.4 }}
        >
          {loading ? 'Creating your profile…' : step === totalSteps ? 'Find my match ✦' : 'Continue'}
        </button>
      </div>

    </div>
  );
}
