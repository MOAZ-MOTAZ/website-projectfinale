import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import "../styles/lock.css";

const createConfetti = () => {
  const confettiCount = 50;
  const colors = ["#D4AF37", "#E8B4C8", "#6B2C3E", "#8B4A5F", "#FFD700"];
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti-piece";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => confetti.remove(), 3000);
  }
};

export default function Lock() {
  const [, setLocation] = useLocation();
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockTime] = useState(() => {
    // Generate a random unlock time between 11 PM April 28 and 1:30 AM April 29
    // Excluding 12 AM and 11:59 PM
    const generateRandomUnlockTime = () => {
      const unlockDate = new Date("2026-04-29T00:00:00");
      
      // Generate random minutes between 0 and 90 (11 PM to 1:30 AM)
      // 11 PM = -60 minutes from midnight
      // 1:30 AM = 90 minutes from midnight
      let randomMinutes = Math.random() * 150 - 60; // -60 to 90
      
      // Exclude 12 AM (0 minutes) and 11:59 PM (-1 minute)
      if (randomMinutes >= -1 && randomMinutes <= 1) {
        randomMinutes = randomMinutes > 0 ? 2 : -2;
      }
      
      unlockDate.setMinutes(Math.floor(randomMinutes));
      return unlockDate;
    };
    
    return generateRandomUnlockTime();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = unlockTime.getTime() - now.getTime();

      if (difference <= 0) {
        // Trigger unlock animation
        setIsUnlocking(true);
        
        // Create confetti effect
        createConfetti();
        
        // Redirect after animation
        setTimeout(() => {
          setLocation("/home");
        }, 1500);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockTime, setLocation]);

  return (
    <div className={`lock-container ${isUnlocking ? "unlocking" : ""}`}>
      <div className={`lock-content ${isUnlocking ? "fade-out" : ""}`}>
        <div className={`lock-icon ${isUnlocking ? "unlock-animation" : ""}`}>🔒</div>
        <h1 className="lock-title">Something Special is Coming</h1>
        <p className="lock-subtitle">This project unlocks soon...</p>
        
        {timeRemaining && (
          <div className="countdown">
            <div className="countdown-item">
              <div className="countdown-number">{String(timeRemaining.days).padStart(2, "0")}</div>
              <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-number">{String(timeRemaining.hours).padStart(2, "0")}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-number">{String(timeRemaining.minutes).padStart(2, "0")}</div>
              <div className="countdown-label">Minutes</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-number">{String(timeRemaining.seconds).padStart(2, "0")}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>
        )}
        
        <p className="lock-message">Thank you for testing this project!</p>
      </div>
    </div>
  );
}
