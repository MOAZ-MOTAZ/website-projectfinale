import { useState, useEffect } from "react";

import "../styles/teaser.css";

export default function Teaser() {
  const [showDetails, setShowDetails] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  // Generate random unlock time between 11 PM Apr 28 and 1:30 AM Apr 29, 2026
  const [targetDate] = useState(() => {
    const unlockDate = new Date('2026-04-29T00:00:00Z');
    // Random time between 11 PM (23:00) and 1:30 AM (01:30) next day
    // Avoid exactly 12 AM (00:00) and 11:59 PM (23:59)
    const minHour = 23; // 11 PM
    const maxHour = 1; // 1 AM next day
    
    let randomHour = Math.random() < 0.5 ? 
      minHour + Math.random() * 1 : // 11 PM - 12 AM
      maxHour + Math.random() * 0.5; // 12 AM - 1:30 AM
    
    // Avoid exactly 12 AM and 11:59 PM
    if (randomHour >= 23.98) randomHour = 23.5;
    if (randomHour >= 24) randomHour = 0.5;
    
    const targetTime = new Date('2026-04-28T23:00:00Z').getTime() + (randomHour * 60 * 60 * 1000);
    return targetTime;
  });



  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // When countdown reaches zero, redirect to home page
        window.location.href = '/home';
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="teaser-container">
      <div className="teaser-content">
        <div className="teaser-header">
          <h1 className="teaser-title">I'm Working on Something</h1>
          <p className="teaser-subtitle">A Personal Project Just For You</p>
        </div>

        <div className="teaser-message">
          <p className="teaser-text">
            I've been spending time on a special personal project that I think you'll really enjoy. 
            It's something I'm creating with care and attention to detail.
          </p>
          <p className="teaser-text">
            I can't reveal what it is yet, but I wanted you to know that something exciting is coming your way soon!
          </p>
        </div>

        <div className="teaser-hints">
          <button 
            className="teaser-button"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Hints" : "Want a Hint?"}
          </button>

          {showDetails && (
            <div className="hints-container">
              <div className="hint">
                <span className="hint-icon">✨</span>
                <p>It's something interactive and fun</p>
              </div>
              <div className="hint">
                <span className="hint-icon">💝</span>
                <p>It's personalized just for you</p>
              </div>
              <div className="hint">
                <span className="hint-icon">🎉</span>
                <p>It will make you smile</p>
              </div>
            </div>
          )}
        </div>

        <div className="countdown-container">
          <p className="countdown-label">The Big Reveal In:</p>
          <div className="countdown-timer">
            <div className="countdown-item">
              <span className="countdown-value">{countdown.days}</span>
              <span className="countdown-label-small">Days</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-item">
              <span className="countdown-value">{countdown.hours.toString().padStart(2, '0')}</span>
              <span className="countdown-label-small">Hours</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-item">
              <span className="countdown-value">{countdown.minutes.toString().padStart(2, '0')}</span>
              <span className="countdown-label-small">Minutes</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-item">
              <span className="countdown-value">{countdown.seconds.toString().padStart(2, '0')}</span>
              <span className="countdown-label-small">Seconds</span>
            </div>
          </div>
        </div>

        <div className="teaser-cta">
          <p className="teaser-cta-text">
            Stay tuned! The big reveal is coming soon...
          </p>
          <div className="teaser-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        <div className="teaser-footer">
          <p className="footer-text">
            In the meantime, keep an eye on your inbox for updates! 👀
          </p>
        </div>
      </div>
    </div>
  );
}
