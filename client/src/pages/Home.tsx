import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import '../styles/home.css';

/**
 * Birthday Gift Website - Ethereal Romance Design
 * 
 * Design Philosophy:
 * - Soft, warm color palette (blush pink, champagne gold, ivory)
 * - Delicate animations that feel organic and magical
 * - Elegant serif typography (Playfair Display + Lora)
 * - Generous whitespace and breathing room
 * - Floating hearts and sparkles as ambient decoration
 */

export default function Home() {
  const [currentSection, setCurrentSection] = useState<'welcome' | 'cake' | 'letter'>('welcome');
  const [candlesBlown, setCandlesBlown] = useState(0);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  // Create floating hearts and sparkles
  useEffect(() => {
    const createFloatingElements = () => {
      const container = document.getElementById('floating-elements');
      if (!container) return;

      for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.className = 'floating-heart';
        element.innerHTML = '💗';
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 5 + 's';
        element.style.animationDuration = (Math.random() * 8 + 12) + 's';
        container.appendChild(element);
      }
    };

    createFloatingElements();
  }, []);

  const handleCandleClick = (index: number) => {
    const candle = document.getElementById(`candle-${index}`);
    if (candle) {
      candle.classList.add('blown');
      setCandlesBlown(prev => {
        const newCount = prev + 1;
        if (newCount === 3) {
          // Trigger confetti burst
          createConfetti();
          setTimeout(() => {
            setCurrentSection('letter');
          }, 1200);
        }
        return newCount;
      });
    }
  };

  const createConfetti = () => {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    for (let i = 0; i < 80; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = ['#F5E6E0', '#E8D5C4', '#C9A961', '#B76E79', '#D4A5A5'][Math.floor(Math.random() * 5)];
      confetti.style.animationDelay = Math.random() * 0.3 + 's';
      container.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }
  };

  return (
    <div className="birthday-container">
      <div id="floating-elements" className="floating-elements"></div>
      <div id="confetti-container" className="confetti-container"></div>

      {/* Welcome Section */}
      <section className={`section welcome-section ${currentSection === 'welcome' ? 'active' : ''}`}>
        <div className="hero-background"></div>
        <div className="welcome-content">
          <h1 className="welcome-title">Happy Birthday 🌸</h1>
          <p className="welcome-subtitle">I made something special for you...</p>
          <Button
            onClick={() => setCurrentSection('cake')}
            className="welcome-button"
          >
            Open Gift
          </Button>
        </div>
      </section>

      {/* Cake Section */}
      <section className={`section cake-section ${currentSection === 'cake' ? 'active' : ''}`}>
        <div className="cake-content">
          <h2 className="cake-title">Make a wish and blow the candles ✨</h2>
          
          <div className="cake-container">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663148350671/XWJVkUigXWKbAJZqtn4imp/cake-illustration-PusQkCc87UXXsoZLkXxnct.webp"
              alt="Birthday Cake"
              className="cake-image"
            />
            
            <div className="candles-wrapper">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  id={`candle-${index}`}
                  className="candle"
                  onClick={() => handleCandleClick(index)}
                >
                  <div className="candle-flame"></div>
                </div>
              ))}
            </div>
          </div>

          <p className="cake-hint">Click each candle to blow them out</p>
        </div>
      </section>

      {/* Letter Section */}
      <section className={`section letter-section ${currentSection === 'letter' ? 'active' : ''}`}>
        <div className="letter-wrapper">
          <div className="letter-box">
            <h2 className="letter-title">💌 A Letter For You</h2>

            {/* Music Player */}
            <div className="music-section">
              <button
                className="music-button"
                onClick={() => setShowMusicPlayer(!showMusicPlayer)}
              >
                🎧 I picked a song for you
              </button>

              {showMusicPlayer && (
                <div className="music-player">
                  <iframe
                    style={{ borderRadius: '12px' }}
                    src="https://open.spotify.com/embed/track/3Fzlg5r1IjhLk2qRw667od?utm_source=generator"
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </div>
              )}
            </div>

            {/* Letter Meta */}
            <div className="letter-meta">
              <span>October 20, 1:00 AM — the night we started talking</span>
            </div>

            {/* Letter Body */}
            <div className="letter-body">
              <p>
                This is where your heartfelt message will go... Write something meaningful and personal here. Share your favorite memories, inside jokes, or what makes this person special to you.
              </p>

              <div className="signature">
                <p>Happy Birthday,</p>
                <p className="signature-name">Mariam</p>
              </div>

              <p className="closing">
                I'm really glad I got to know you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
