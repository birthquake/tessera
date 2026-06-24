// src/screens/OnboardingScreen.jsx
import { useState } from 'react';
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
  const [step, setStep]             = useState(1);
  const [name, setName]             = useState('');
  const [age, setAge]               = useState('');
  const [interests, setInterests]   = useState([]);
  const [availability, setAvail]    = useState([]);

  const totalSteps = 3;

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

  function handleContinue() {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({ name, age, interests, availability });
    }
  }

  function canContinue() {
    if (step === 1) return name.trim().length > 0 && age.trim().length > 0;
    if (step === 2) return interests.length > 0;
    if (step === 3) return availability.length > 0;
    return false;
  }

  return (
    <div className="onboarding">
      <div className="onboarding-texture" />

      {/* Progress bar */}
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

      {/* Step content */}
      <div className="ob-content">

        {step === 1 && (
          <div className="ob-step-wrap">
            <div className="ob-eyebrow">Step 1 of 3</div>
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
            <div className="ob-eyebrow">Step 2 of 3</div>
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
            <div className="ob-eyebrow">Step 3 of 3</div>
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

      </div>

      {/* Continue button */}
      <div className="ob-footer">
        <button
          className="btn-gold"
          onClick={handleContinue}
          disabled={!canContinue()}
          style={{ opacity: canContinue() ? 1 : 0.4 }}
        >
          {step === totalSteps ? 'Find my match ✦' : 'Continue'}
        </button>
      </div>

    </div>
  );
}
