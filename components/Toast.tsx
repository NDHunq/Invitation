"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================
   TOAST NOTIFICATION
   -------------------------------------------
   Hiển thị thông báo đẹp mắt khi submit RSVP.
   Tự động ẩn sau 4 giây.
   ============================================ */

interface ToastProps {
  message: string;
  type: "success" | "info";
  visible: boolean;
}

export default function Toast({ message, type, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`toast ${type === "success" ? "toast-success" : "toast-info"}`}
          initial={{ opacity: 0, y: 40, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 40, x: "-50%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <span>
            {type === "success" ? "🎉 " : "💙 "}
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================
   TOAST HOOK - Sử dụng trong component cha
   ============================================ */
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(
    null
  );

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return { toast, showToast };
}
