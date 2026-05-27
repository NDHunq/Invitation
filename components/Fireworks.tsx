"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/* ============================================
   FIREWORKS EFFECT
   -------------------------------------------
   Hiệu ứng pháo hoa bắn lên khi mới load.
   Canvas hoàn toàn trong suốt — clear mỗi frame.
   Tự ẩn khỏi DOM khi kết thúc.
   ============================================ */

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
}

const COLORS = [
  "#4a8aff",
  "#7dabff",
  "#fbbf24",
  "#fcd34d",
  "#60a5fa",
  "#818cf8",
  "#c084fc",
  "#f0abfc",
];

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [finished, setFinished] = useState(false);

  const createExplosion = useCallback(
    (x: number, y: number, color: string, particles: FireworkParticle[]) => {
      const count = 60 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 1.5,
          color,
          alpha: 1,
          decay: 0.015 + Math.random() * 0.01,
          gravity: 0.04,
        });
      }
    },
    []
  );

  useEffect(() => {
    if (finished) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: FireworkParticle[] = [];
    const rockets: Rocket[] = [];
    let rocketTimer = 0;
    let totalRockets = 0;
    const maxRockets = 8;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const launchRocket = () => {
      if (totalRockets >= maxRockets) return;
      totalRockets++;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      rockets.push({
        x: canvas.width * (0.2 + Math.random() * 0.6),
        y: canvas.height,
        vy: -(8 + Math.random() * 4),
        targetY: canvas.height * (0.15 + Math.random() * 0.35),
        color,
      });
    };

    launchRocket();
    setTimeout(launchRocket, 300);

    const animate = () => {
      // ✅ Clear hoàn toàn mỗi frame — canvas luôn trong suốt
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Vẽ rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];

        // Vẽ đầu rocket sáng
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();

        // Vẽ glow nhẹ quanh rocket
        const glow = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, 12);
        glow.addColorStop(0, "rgba(200, 220, 255, 0.4)");
        glow.addColorStop(1, "rgba(200, 220, 255, 0)");
        ctx.beginPath();
        ctx.arc(r.x, r.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        r.y += r.vy;
        r.vy *= 0.98;

        if (r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color, particles);
          rockets.splice(i, 1);
        }
      }

      // Vẽ particles (mỗi hạt tự quản lý alpha)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Vẽ hạt với glow effect
        ctx.globalAlpha = p.alpha;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Điểm sáng ở tâm
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = p.alpha * 0.6;
        ctx.fill();

        ctx.globalAlpha = 1;
      }

      // Bắn thêm pháo hoa
      rocketTimer++;
      if (rocketTimer % 45 === 0 && totalRockets < maxRockets) {
        launchRocket();
      }

      // Khi hết tất cả → unmount canvas khỏi DOM
      if (
        particles.length === 0 &&
        rockets.length === 0 &&
        totalRockets >= maxRockets
      ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
        setFinished(true);
        return;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [createExplosion, finished]);

  // Khi xong → gỡ hoàn toàn khỏi DOM
  if (finished) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      aria-hidden="true"
    />
  );
}
