"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ParticleBackground from "@/components/ParticleBackground";
import Fireworks from "@/components/Fireworks";
import Countdown from "@/components/Countdown";
import RSVPForm from "@/components/RSVPForm";
import WishesWall from "@/components/WishesWall";
import Toast, { useToast } from "@/components/Toast";
import { getGuestName } from "@/lib/guests";

/* ============================================
   TRANG CHỦ - THIỆP MỜI LỄ TỐT NGHIỆP
   -------------------------------------------
   Route: /
   Query: ?guest=key (vd: ?guest=tung)
   ============================================ */

/** Stagger container — phần tử con hiện ra lần lượt */
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/** Fade in từ dưới lên */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

/** Fade in tại chỗ */
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

/** Scale fade in */
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

/** Component nội dung chính - cần Suspense cho useSearchParams */
function InvitationContent() {
  const searchParams = useSearchParams();
  const guestKey = searchParams.get("guest");
  const guestName = getGuestName(guestKey);
  const { toast, showToast } = useToast();

  return (
    <>
      {/* Aurora gradient background */}
      <div className="aurora-bg" aria-hidden="true" />

      {/* Hiệu ứng nền */}
      <ParticleBackground />
      <Fireworks />

      {/* Toast notification */}
      <Toast
        message={toast?.message || ""}
        type={toast?.type || "success"}
        visible={!!toast}
      />

      {/* Container chính */}
      <main className="relative z-10 flex flex-col items-center min-h-screen px-4 py-8 md:py-12">
        {/* ========== SECTION: Header - Avatar & Lời mời ========== */}
        <motion.section
          className="text-center max-w-2xl mx-auto mb-8 md:mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Avatar với Glow Ring xoay */}
          <motion.div
            className="flex justify-center mb-6 md:mb-8"
            variants={scaleIn}
          >
            <div className="avatar-ring">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden">
                <Image
                  src="/avatar.jpg"
                  alt="Nguyễn Duy Hưng"
                  fill
                  sizes="(max-width: 768px) 96px, 128px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Dòng chữ "Trân trọng kính mời" */}
          <motion.p
            className="text-xs md:text-sm uppercase tracking-[0.3em] text-[var(--text-muted)] mb-2 md:mb-3"
            variants={fadeInUp}
          >
            Trân trọng kính mời
          </motion.p>

          {/* Tên khách mời — Gold gradient */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold gradient-text mb-4 md:mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
            variants={fadeInUp}
          >
            {guestName}
          </motion.h2>

          {/* Dòng kẻ trang trí */}
          <motion.div className="ornament-divider mb-4 md:mb-6" variants={fadeIn}>
            <span className="text-[var(--gold-400)]">✦</span>
          </motion.div>

          {/* Thông tin chính */}
          <motion.p
            className="text-xs md:text-sm text-[var(--text-secondary)] mb-2"
            variants={fadeInUp}
          >
            đến chung vui tại
          </motion.p>

          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-2 md:mb-4 gradient-text-blue"
            style={{ fontFamily: "var(--font-serif)" }}
            variants={fadeInUp}
          >
            Lễ Tốt Nghiệp
          </motion.h1>

          <motion.h2
            className="text-xl md:text-3xl font-semibold gradient-text mb-6 md:mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
            variants={fadeInUp}
          >
            Nguyễn Duy Hưng
          </motion.h2>

          {/* Trường & Ngành */}
          <motion.div
            className="glass-card inline-block px-8 py-4 mb-3"
            variants={fadeInUp}
          >
            <p className="text-sm md:text-base text-[var(--text-secondary)]">
              🏫 Trường Đại học Công nghệ Thông tin{" "}
              <span className="text-[var(--gold-400)]">(UIT)</span>
            </p>
          </motion.div>

          <motion.p
            className="text-sm text-[var(--text-muted)]"
            variants={fadeInUp}
          >
            Ngành Kỹ thuật Phần mềm
          </motion.p>
        </motion.section>

        {/* ========== SECTION: Thời gian & Địa điểm ========== */}
        <motion.section
          className="w-full max-w-lg mx-auto mb-8 md:mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="glass-card p-6 md:p-8" variants={scaleIn}>
            {/* Thời gian */}
            <motion.div className="text-center mb-8 md:mb-10" variants={fadeInUp}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-2xl">🕗</span>
                <h3
                  className="text-lg md:text-xl font-semibold"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Thời gian
                </h3>
              </div>
              <p className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                10:00 SA
              </p>
              <p className="text-base md:text-lg text-[var(--text-secondary)]">
                Thứ Tư, ngày 10 tháng 06 năm 2026
              </p>
            </motion.div>

            {/* Divider */}
            <motion.div className="ornament-divider mb-8 md:mb-10" variants={fadeIn}>
              <span className="text-[var(--gold-400)]">◆</span>
            </motion.div>

            {/* Địa điểm */}
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-2xl">📍</span>
                <h3
                  className="text-lg md:text-xl font-semibold"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Địa điểm
                </h3>
              </div>
              <p className="text-base md:text-lg text-[var(--text-primary)] font-medium mb-1">
                Trường Đại học Công nghệ Thông tin
              </p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Khu phố 6, Phường Linh Trung, Thành phố Thủ Đức,
                <br />
                Thành phố Hồ Chí Minh
              </p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ========== SECTION: Countdown ========== */}
        <motion.section
          className="w-full max-w-lg mx-auto mb-8 md:mb-10 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.p
            className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8"
            variants={fadeIn}
          >
            Đếm ngược
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Countdown />
          </motion.div>
        </motion.section>

        {/* ========== SECTION: Lời tâm sự ========== */}
        <motion.section
          className="w-full max-w-2xl mx-auto mb-8 md:mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="glass-card p-6 md:p-8" variants={scaleIn}>
            {/* Icon */}
            <motion.div className="text-center mb-6" variants={fadeIn}>
              <span className="text-4xl">💌</span>
            </motion.div>

            {/* Tiêu đề */}
            <motion.h3
              className="text-xl md:text-2xl font-semibold text-center mb-6 md:mb-8 gradient-text"
              style={{ fontFamily: "var(--font-serif)" }}
              variants={fadeInUp}
            >
              Lời tâm sự
            </motion.h3>

            {/* Nội dung - Typography sang trọng */}
            <motion.div
              className="text-center leading-loose md:leading-[2] text-[var(--text-secondary)] text-sm md:text-base"
              style={{ fontFamily: "var(--font-serif)" }}
              variants={fadeInUp}
            >
              <p className="mb-5">
                Hành trình 4 năm tại UIT chuẩn bị khép lại.
              </p>
              <p className="mb-5">
                Từ những ngày đầu bỡ ngỡ bước vào giảng đường, những đêm thức trắng
                cùng deadline, những buổi thuyết trình run run trước lớp, đến những
                dự án đầu tay đầy tự hào — tất cả không chỉ là những con số hay dòng
                code, mà là{" "}
                <span className="text-[var(--text-primary)] font-medium italic">
                  thanh xuân, mồ hôi và những nụ cười.
                </span>
              </p>
              <p className="mb-5">
                Để đi đến được cột mốc hôm nay, Hưng vô cùng biết ơn sự đồng hành,
                dìu dắt từ những người anh, người chị, người bạn trân quý nhất.
              </p>
              <p className="text-base md:text-lg text-[var(--text-primary)]">
                Rất mong{" "}
                <span className="font-bold gradient-text text-lg md:text-xl">
                  {guestName}
                </span>{" "}
                có thể đến chung vui và đánh dấu thời khắc ý nghĩa này cùng Hưng.
              </p>
            </motion.div>

            {/* Chữ ký */}
            <motion.div className="text-center mt-8 md:mt-10" variants={fadeIn}>
              <div className="ornament-divider mb-4">
                <span className="text-[var(--gold-400)]">✦</span>
              </div>
              <p
                className="text-lg italic text-[var(--gold-400)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                — Hưng —
              </p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ========== SECTION: RSVP Form ========== */}
        <motion.section
          className="w-full max-w-lg mx-auto mb-8 md:mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p
            className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)] text-center mb-8"
            variants={fadeIn}
          >
            Phản hồi
          </motion.p>
          <motion.div variants={fadeInUp}>
            <RSVPForm onSuccess={showToast} />
          </motion.div>
        </motion.section>

        {/* ========== SECTION: Wishes Wall ========== */}
        <motion.section
          className="w-full max-w-6xl mx-auto mb-8 md:mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeInUp}>
            <WishesWall />
          </motion.div>
        </motion.section>

        {/* ========== FOOTER ========== */}
        <motion.footer
          className="text-center mt-4 pb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="ornament-divider mb-4">
            <span className="text-[var(--gold-400)]">✦</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Thiệp mời được tạo bằng ❤️ bởi Nguyễn Duy Hưng
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            © 2026 — UIT Graduation
          </p>
        </motion.footer>
      </main>
    </>
  );
}

/** Page component với Suspense boundary cho useSearchParams */
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🎓</div>
            <p className="text-[var(--text-muted)] animate-pulse">
              Đang mở thiệp mời...
            </p>
          </div>
        </div>
      }
    >
      <InvitationContent />
    </Suspense>
  );
}
