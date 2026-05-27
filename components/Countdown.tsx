"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ============================================
   COUNTDOWN TIMER
   -------------------------------------------
   Đếm ngược đến ngày Lễ Tốt Nghiệp.
   🔧 Thay đổi ngày tại TARGET_DATE bên dưới.
   ============================================ */

// ⚠️ Ngày Lễ Tốt Nghiệp - Thay đổi tại đây nếu cần
const TARGET_DATE = new Date("2026-06-10T10:30:00+07:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const diff = TARGET_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/* --- Animation variants --- */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/* --- Shared style tokens --- */
const boxClasses =
  "glass-card rounded-2xl w-[72px] h-[72px] md:w-[88px] md:h-[88px] flex items-center justify-center mb-2 border border-[rgba(37,99,235,0.2)] shadow-[0_0_15px_rgba(37,99,235,0.15),0_0_40px_rgba(37,99,235,0.05)]";
const numberClasses = "text-3xl md:text-4xl font-light gradient-text";
const labelClasses =
  "text-[10px] md:text-xs text-[var(--text-muted)] uppercase tracking-widest";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Set initial time on client side only
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Hiển thị placeholder khi chưa hydrate (tránh mismatch SSR)
  if (!timeLeft) {
    return (
      <div className="flex justify-center gap-3 md:gap-5">
        {["Ngày", "Giờ", "Phút", "Giây"].map((label) => (
          <div key={label} className="text-center">
            <div className={boxClasses}>
              <span className={numberClasses}>--</span>
            </div>
            <span className={labelClasses}>{label}</span>
          </div>
        ))}
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: "Ngày" },
    { value: timeLeft.hours, label: "Giờ" },
    { value: timeLeft.minutes, label: "Phút" },
    { value: timeLeft.seconds, label: "Giây" },
  ];

  return (
    <motion.div
      className="flex justify-center gap-3 md:gap-5"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {units.map((unit) => (
        <motion.div
          key={unit.label}
          className="text-center"
          variants={childVariants}
        >
          <div className={boxClasses}>
            <span className={numberClasses}>
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <span className={labelClasses}>{unit.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
