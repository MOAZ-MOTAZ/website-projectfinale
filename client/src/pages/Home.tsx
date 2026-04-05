import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import "../styles/home-v2.css";

// Sample photo data - replace with actual photos
const PHOTOS = [
  { id: 1, title: "Memory 1", description: "A special moment" },
  { id: 2, title: "Memory 2", description: "Happy times together" },
  { id: 3, title: "Memory 3", description: "Unforgettable memories" },
  { id: 4, title: "Memory 4", description: "Precious moments" },
  { id: 5, title: "Memory 5", description: "Beautiful memories" },
  { id: 6, title: "Memory 6", description: "Cherished times" },
];

const MESSAGES = [
  "You light up every room! 🌟",
  "Your smile is contagious! 😊",
  "You're one of a kind! ✨",
  "You deserve all the happiness! 💕",
  "You make the world better! 🌍",
  "You mean a lot to me! 💖",
];

function Confetti() {
  useEffect(() => {
    const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ["#6B2C3E", "#D4AF37", "#E8B4C8", "#B76E79", "#C9A961"];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 5 + 3,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.y += p.vy;
        p.x += p.vx;
        p.vy += 0.1; // gravity
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.y > canvas.height) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return <canvas id="confetti-canvas" className="confetti-canvas" />;
}

export default function Home() {
  const [currentSection, setCurrentSection] = useState<"welcome" | "surprise" | "letter">("welcome");
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedMessages, setUnlockedMessages] = useState<number[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const handleOpenGift = () => {
    setCurrentSection("surprise");
  };

  const handlePhotoClick = (photoId: number) => {
    setSelectedPhoto(photoId);
  };

  const handleUnlockMessage = (index: number) => {
    if (!unlockedMessages.includes(index)) {
      setUnlockedMessages([...unlockedMessages, index]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const handleSurprise = () => {
    setCurrentSection("surprise");
  };

  const handleFinalMessage = () => {
    setCurrentSection("letter");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showConfetti && <Confetti />}

      {/* Welcome Section */}
      {currentSection === "welcome" && (
        <section className="welcome-section">
          <div className="welcome-content">
            <h1 className="welcome-title">Happy Birthday, Mariam! 🎉</h1>
            <p className="welcome-subtitle">I made something special for you...</p>
            <Button
              onClick={handleOpenGift}
              className="welcome-button"
              size="lg"
            >
              Open Gift ✨
            </Button>
          </div>
        </section>
      )}



      {/* Surprise Section */}
      {currentSection === "surprise" && (
        <section className="surprise-section">
          <div className="surprise-container">
            <h2 className="surprise-title">Special Messages For You</h2>
            <div className="messages-grid">
              {MESSAGES.map((message, index) => (
                <div
                  key={index}
                  className={`message-card ${unlockedMessages.includes(index) ? "unlocked" : ""}`}
                  onClick={() => handleUnlockMessage(index)}
                >
                  {unlockedMessages.includes(index) ? (
                    <p className="message-text">{message}</p>
                  ) : (
                    <p className="message-locked">Click to unlock 🎁</p>
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={handleFinalMessage}
              className="final-button"
              size="lg"
            >
              Read My Letter 💌
            </Button>
          </div>
        </section>
      )}

      {/* Letter Section */}
      {currentSection === "letter" && (
        <section className="letter-section">
          <div className="letter-card">
            <div className="letter-header">
              <h2 className="letter-title">A Letter For You</h2>
            </div>
            <div className="letter-content">
              <p className="letter-date">April 29, 2026</p>
              <p className="letter-text">
                Dear Mariam,
              </p>
              <p className="letter-text">
                I want you to know how much you mean to me. You bring joy, laughter, and light into my life. Your kindness, strength, and beautiful spirit inspire me every single day.
              </p>
              <p className="letter-text">
                Thank you for being the amazing person you are. I'm so grateful for all the memories we've shared and excited for all the adventures still to come.
              </p>
              <p className="letter-text">
                Wishing you a day as wonderful as you are. You deserve all the happiness in the world.
              </p>

            </div>
          </div>
        </section>
      )}
    </div>
  );
}
