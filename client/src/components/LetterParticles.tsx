import { useEffect } from "react";

interface LetterParticlesProps {
  isActive: boolean;
}

export function LetterParticles({ isActive }: LetterParticlesProps) {
  useEffect(() => {
    if (!isActive) return;

    const canvas = document.getElementById("letter-particles-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    // Golden and rose gold colors that match the theme
    const colors = ["#D4AF37", "#E8B4C8", "#FFD700", "#FFA500", "#FF69B4", "#DEB887"];

    // Create particles that emanate from the center of the screen
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 2 + Math.random() * 4;
      
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        life: 1,
        maxLife: 2000 + Math.random() * 1000, // 2-3 seconds
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
      });
    }

    let animationId: number;
    let startTime = Date.now();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = Date.now() - startTime;

      particles.forEach((p, index) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Apply gravity
        p.vy += 0.08;
        
        // Fade out over time
        p.life = Math.max(0, 1 - elapsed / p.maxLife);
        p.opacity = p.life;

        // Rotation
        p.rotation += p.rotationSpeed;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        
        // Draw as small star/diamond shape
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size / 2, -p.size / 2);
        ctx.lineTo(p.size, 0);
        ctx.lineTo(p.size / 2, p.size / 2);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size / 2, p.size / 2);
        ctx.lineTo(-p.size, 0);
        ctx.lineTo(-p.size / 2, -p.size / 2);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();

        // Remove dead particles
        if (p.life <= 0) {
          particles.splice(index, 1);
        }
      });

      // Continue animation if particles remain or time hasn't elapsed
      if (particles.length > 0 && elapsed < 3500) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      id="letter-particles-canvas"
      className="letter-particles-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 40,
      }}
    />
  );
}
