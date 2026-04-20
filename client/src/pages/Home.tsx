import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
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
  const [currentSection, setCurrentSection] = useState<"welcome" | "surprise" | "letter" | "comments">("welcome");
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedMessages, setUnlockedMessages] = useState<number[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");

  // Trigger confetti animation on page load (when coming from teaser unlock)
  useEffect(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading } = trpc.comments.list.useQuery();
  const addCommentMutation = trpc.comments.add.useMutation({
    onSuccess: () => {
      setCommentText("");
      setCommentName("");
      // Invalidate and refetch comments
      trpc.useUtils().comments.list.invalidate();
    },
  });

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

  const handleAddComment = async () => {
    if (!commentText.trim() || !commentName.trim()) return;
    
    await addCommentMutation.mutateAsync({
      name: commentName,
      message: commentText,
    });
  };

  const handleViewComments = () => {
    setCurrentSection("comments");
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
                I don't think everything I want to say can truly fit into words, but I'll try.
              </p>
              <p className="letter-text">
                Since we started talking about seven months ago, you've become someone really important to me. You bring a kind of joy and light into my life that I didn't expect, and I genuinely enjoy every moment we spend talking.
              </p>
              <p className="letter-text">
                I admire how strong you are, especially when life isn't easy. You have a way of handling things that's honestly inspiring.
              </p>
              <p className="letter-text">
                I'm really grateful for the memories we've made so far, even the small ones, and I'm looking forward to many more.
              </p>
              <p className="letter-text">
                I know a website isn't enough to show how much I appreciate you, but I wanted to make something a little different for you.
              </p>
              <p className="letter-text">
                Happy 18th birthday. I hope your day is as wonderful as you are — and that nothing (not even sanawya amma) gets in the way of you enjoying it.
              </p>
            </div>
            <Button
              onClick={handleViewComments}
              className="final-button"
              size="lg"
              style={{ marginTop: "2rem" }}
            >
              Leave a Thank You Message 💝
            </Button>
          </div>
        </section>
      )}

      {/* Comments Section */}
      {currentSection === "comments" && (
        <section className="letter-section">
          <div className="letter-card">
            <div className="letter-header">
              <h2 className="letter-title">Leave a Message</h2>
            </div>
            <div className="letter-content" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="Enter your name"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #D4AF37",
                    borderRadius: "0.5rem",
                    fontFamily: "inherit",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Your Message
                </label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your thank you message here..."
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #D4AF37",
                    borderRadius: "0.5rem",
                    fontFamily: "inherit",
                    fontSize: "1rem",
                    resize: "vertical",
                  }}
                />
              </div>
              <Button
                onClick={handleAddComment}
                disabled={addCommentMutation.isPending}
                className="final-button"
                size="lg"
              >
                {addCommentMutation.isPending ? "Sending..." : "Send Message 💌"}
              </Button>

              {/* Display comments */}
              <div style={{ marginTop: "2rem", borderTop: "1px solid #D4AF37", paddingTop: "2rem" }}>
                <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "600" }}>
                  Messages ({comments.length})
                </h3>
                {commentsLoading ? (
                  <p>Loading messages...</p>
                ) : comments.length === 0 ? (
                  <p style={{ color: "#999" }}>No messages yet. Be the first to leave one!</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {comments.map((comment: any) => (
                      <div
                        key={comment.id}
                        style={{
                          padding: "1rem",
                          backgroundColor: "#F5F0E8",
                          borderRadius: "0.5rem",
                          borderLeft: "3px solid #D4AF37",
                        }}
                      >
                        <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                          {comment.name}
                        </p>
                        <p style={{ margin: 0, color: "#333" }}>{comment.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
