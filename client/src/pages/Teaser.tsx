import { useState } from "react";
import "../styles/teaser.css";

export default function Teaser() {
  const [showDetails, setShowDetails] = useState(false);

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
