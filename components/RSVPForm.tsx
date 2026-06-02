"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

/* ============================================
   RSVP FORM
   -------------------------------------------
   Form xác nhận tham gia Lễ Tốt Nghiệp.
   Gửi dữ liệu lên Supabase.
   ============================================ */

/* ---------- Stagger animation variants ---------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

interface RSVPFormProps {
  /** Callback khi gửi thành công */
  onSuccess: (message: string, type: "success" | "info") => void;
}

export default function RSVPForm({ onSuccess }: RSVPFormProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /** Gửi RSVP lên Supabase */
  const handleSubmit = async (attending: boolean) => {
    // Validate tên
    if (!name.trim()) {
      onSuccess("Vui lòng nhập tên của bạn nhé! 😊", "info");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("rsvps").insert([
        {
          name: name.trim(),
          message: message.trim() || null,
          attending,
        },
      ]);

      if (error) throw error;

      setSubmitted(true);

      if (attending) {
        onSuccess("Cảm ơn bạn! Hưng rất vui được gặp bạn tại buổi lễ! 🎓", "success");
      } else {
        onSuccess("Cảm ơn bạn đã phản hồi. Hy vọng lần sau sẽ gặp nhau nhé! 💙", "info");
      }
    } catch {
      onSuccess("Có lỗi xảy ra, vui lòng thử lại sau.", "info");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hiển thị thông báo khi đã gửi
  if (submitted) {
    return (
      <motion.div
        className="glass-card p-6 md:p-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-5xl mb-4">🎓</div>
        <h3
          className="text-xl md:text-2xl font-semibold mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Đã ghi nhận phản hồi!
        </h3>
        <p className="text-[var(--text-secondary)] text-sm md:text-base">
          Cảm ơn bạn rất nhiều. Hưng trân trọng tình cảm của bạn.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card p-6 md:p-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Tiêu đề form */}
      <motion.div variants={itemVariants}>
        <h3
          className="text-xl md:text-2xl font-semibold text-center mb-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Xác nhận tham dự
        </h3>
        <p className="text-[var(--text-muted)] text-center text-sm mb-8">
          Phản hồi của bạn giúp Hưng chuẩn bị buổi lễ thật chu đáo
        </p>
      </motion.div>

      {/* Input tên */}
      <motion.div className="mb-5" variants={itemVariants}>
        <label
          htmlFor="rsvp-name"
          className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
        >
          Họ và tên
        </label>
        <input
          id="rsvp-name"
          type="text"
          className="input-elegant"
          placeholder="Nhập tên của bạn..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          maxLength={100}
        />
      </motion.div>

      {/* Textarea lời chúc */}
      <motion.div className="mb-8" variants={itemVariants}>
        <label
          htmlFor="rsvp-message"
          className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
        >
          Lời chúc <span className="text-[var(--text-muted)]">(không bắt buộc)</span>
        </label>
        <textarea
          id="rsvp-message"
          className="input-elegant resize-none"
          placeholder="Gửi lời chúc đến Hưng..."
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
          maxLength={500}
        />
      </motion.div>

      {/* Buttons */}
      <motion.div className="flex flex-col sm:flex-row gap-3" variants={itemVariants}>
        <motion.button
          id="btn-attend"
          className="btn-primary flex-1"
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Đang gửi...
            </span>
          ) : (
            "Xác nhận tham gia"
          )}
        </motion.button>

        <motion.button
          id="btn-decline"
          className="btn-outline flex-1"
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Không thể tham gia
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
