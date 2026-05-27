"use client";

import { useEffect, useRef } from "react";

/* ============================================
   PARTICLE BACKGROUND
   -------------------------------------------
   Hiệu ứng 3 lớp parallax với các ngôi sao
   nhấp nháy trên nền tối, tạo cảm giác
   sang trọng và chiều sâu không gian.
   ============================================ */

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  baseOpacity: number;
  hue: number;
  twinklePhase: number;
  twinkleSpeed: number;
  glowRadius: number;
  layer: number;
}

/* ---------- Cấu hình cho từng lớp parallax ---------- */
const LAYER_CONFIG = [
  // Layer 1 (far): nhỏ, chậm, mờ
  { count: 40, sizeMin: 0.5, sizeMax: 1, speedMin: 0.05, speedMax: 0.1, opacityMin: 0.15, opacityMax: 0.3, glowMultiplier: 3 },
  // Layer 2 (mid): trung bình
  { count: 25, sizeMin: 1, sizeMax: 2, speedMin: 0.15, speedMax: 0.25, opacityMin: 0.3, opacityMax: 0.5, glowMultiplier: 3 },
  // Layer 3 (near): lớn, nhanh, rõ
  { count: 15, sizeMin: 2, sizeMax: 3.5, speedMin: 0.2, speedMax: 0.4, opacityMin: 0.5, opacityMax: 0.7, glowMultiplier: 4 },
];

/** Tạo số ngẫu nhiên trong khoảng [min, max] */
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let time = 0;

    // Đặt kích thước canvas theo viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Tạo danh sách hạt cho 3 lớp parallax
    LAYER_CONFIG.forEach((cfg, layerIndex) => {
      for (let i = 0; i < cfg.count; i++) {
        const size = rand(cfg.sizeMin, cfg.sizeMax);
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: -rand(cfg.speedMin, cfg.speedMax),
          baseOpacity: rand(cfg.opacityMin, cfg.opacityMax),
          hue: Math.random() > 0.7 ? 45 : 220, // Vàng gold hoặc xanh dương
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: rand(0.5, 2.5),
          glowRadius: size * cfg.glowMultiplier,
          layer: layerIndex,
        });
      }
    });

    // Vòng lặp animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016; // ~60fps delta

      particles.forEach((p) => {
        // Tính opacity nhấp nháy theo sóng sin
        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.5 + 0.5;
        const opacity = p.baseOpacity * twinkle;

        // Vẽ hạt với hiệu ứng glow
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowRadius);
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${opacity})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Di chuyển hạt (trôi lên trên với lệch ngang nhẹ)
        p.x += p.speedX;
        p.y += p.speedY;

        // Quay vòng nếu ra ngoài biên
        if (p.x < -p.glowRadius) p.x = canvas.width + p.glowRadius;
        if (p.x > canvas.width + p.glowRadius) p.x = -p.glowRadius;
        if (p.y < -p.glowRadius) p.y = canvas.height + p.glowRadius;
        if (p.y > canvas.height + p.glowRadius) p.y = -p.glowRadius;
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
