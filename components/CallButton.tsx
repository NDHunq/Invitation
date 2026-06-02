"use client";

import React from "react";

export default function CallButton() {
  const phone = "0345664024";

  return (
    <div className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8">
      <a
        href={`tel:${phone}`}
        aria-label={`Gọi ${phone}`}
        className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg bg-[var(--text-primary)] text-white hover:scale-105 transition-transform"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-6 h-6"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12 1.05.36 2.07.72 3.03a2 2 0 0 1-.45 2.11L9.91 11.09a15.05 15.05 0 0 0 6 6l1.23-1.39a2 2 0 0 1 2.11-.45c.96.36 1.98.6 3.03.72A2 2 0 0 1 22 16.92z"
          />
        </svg>
      </a>
    </div>
  );
}
