"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { getMockWishes, normalizeWishes, WishItem } from "@/lib/wishes";

const CARD_FALLBACK_NAME = "Khách mời";

function getInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "K";
  return trimmed.charAt(0).toUpperCase();
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function splitRows(items: WishItem[]): [WishItem[], WishItem[]] {
  if (items.length < 8) return [items, []];

  const midpoint = Math.ceil(items.length / 2);
  return [items.slice(0, midpoint), items.slice(midpoint)];
}

function WishCard({ item }: { item: WishItem }) {
  const displayName = item.name?.trim() || CARD_FALLBACK_NAME;
  const displayMessage = item.message?.trim() || "Chúc mừng bạn trong chặng đường mới.";

  return (
    <article
      className="wish-card group relative w-[280px] shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:border-blue-300/40 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(125,171,255,0.25)]"
      title={displayMessage}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-300 via-blue-500 to-cyan-300 text-sm font-bold text-slate-950 shadow-lg shadow-blue-400/20">
          {getInitial(displayName)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{displayName}</p>
          <p className="text-xs text-[var(--text-muted)]">{formatTime(item.created_at)}</p>
        </div>
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">{displayMessage}</p>
    </article>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: WishItem[];
  reverse?: boolean;
}) {
  if (!items.length) return null;

  const duplicated = [...items, ...items];

  return (
    <div className="marquee-row">
      <div className={`marquee-track ${reverse ? "marquee-track-reverse" : ""}`}>
        {duplicated.map((item, index) => (
          <WishCard key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function WishesWall() {
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setWishes(normalizeWishes(getMockWishes()));
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchWishes = async () => {
      const { data, error } = await supabase
        .from("rsvps")
        .select("id, name, message, created_at")
        .order("created_at", { ascending: false })
        .limit(40);

      if (!mounted) {
        return;
      }

      if (error) {
        setWishes(normalizeWishes(getMockWishes()));
        setLoading(false);
        return;
      }

      const normalized = normalizeWishes((data ?? []) as WishItem[]);
      setWishes(normalized);
      setLoading(false);
    };

    fetchWishes();

    const channel = supabase
      .channel("wishes-live-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "rsvps" },
        (payload) => {
          const newWish = payload.new as WishItem;

          setWishes((current) => {
            const withoutDuplicate = current.filter((item) => item.id !== newWish.id);
            return [newWish, ...withoutDuplicate].slice(0, 40);
          });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const [topRow, bottomRow] = useMemo(() => splitRows(wishes), [wishes]);

  return (
    <motion.div
      className="glass-card overflow-hidden p-6 md:p-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">Sổ lưu bút</p>
        <h3
          className="mt-2 text-2xl font-semibold gradient-text"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Lời chúc từ bạn bè
        </h3>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-[var(--text-muted)]">Đang tải lời chúc...</p>
      ) : wishes.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--text-muted)]">
          Chưa có lời chúc nào. Hãy là người đầu tiên để lại vài dòng nhé.
        </p>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <MarqueeRow items={topRow} />
            {bottomRow.length > 0 && <MarqueeRow items={bottomRow} reverse />}
          </div>

          <div className="flex justify-center">
            <Link
              href="/wishes"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-[var(--text-primary)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/50 hover:bg-white/10 hover:shadow-[0_0_28px_rgba(125,171,255,0.25)]"
            >
              Xem tất cả lời chúc
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}
