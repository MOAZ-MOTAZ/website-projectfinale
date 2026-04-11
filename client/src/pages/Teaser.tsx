import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import "../styles/teaser.css";

export default function Teaser() {
  const [showDetails, setShowDetails] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const trackVisit = trpc.visitors.trackTeaserVisit.useMutation();

  useEffect(() => {
    // Track teaser visit
    trackVisit.mutate();
  }, []);

  useEffect(() => {
    const calculateCountdown = () => {
      // Calculate time until April 29, 2026 at 11:59 PM (or use the actual unlock time)
      const targetDate = new Date('2026-04-29T23:59:59').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

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
