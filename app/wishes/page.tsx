import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import ParticleBackground from "@/components/ParticleBackground";
import WishesMasonry from "@/components/wishes/WishesMasonry";
import { getMockWishes, normalizeWishes, WishItem } from "@/lib/wishes";

export const metadata = {
  title: "Sổ Lưu Bút | Lễ Tốt Nghiệp Nguyễn Duy Hưng",
  description: "Những lời chúc ý nghĩa gửi đến Duy Hưng trong ngày tốt nghiệp.",
};

async function fetchWishes(): Promise<WishItem[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return normalizeWishes(getMockWishes());
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("rsvps")
    .select("id, name, message, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return normalizeWishes(getMockWishes());
  }

  return normalizeWishes(data as WishItem[]);
}

export default async function WishesPage() {
  const wishes = await fetchWishes();

  return (
    <>
      <div className="aurora-bg" aria-hidden="true" />
      <ParticleBackground />

      <main className="relative z-10 min-h-screen px-4 py-10 md:px-8 md:py-14 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 flex items-start justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/50 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(125,171,255,0.22)]"
            >
              <span aria-hidden="true">←</span>
              <span>Quay lại trang chủ</span>
            </Link>
          </div>

          <header className="mb-10 text-center">
            <h1
              className="text-4xl font-bold gradient-text md:text-6xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Sổ Lưu Bút
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
              Những lời chúc ý nghĩa gửi đến Duy Hưng trong ngày tốt nghiệp
            </p>
          </header>

          {wishes.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center backdrop-blur-lg">
              <p className="text-sm text-[var(--text-muted)]">Chưa có lời chúc nào được gửi.</p>
            </div>
          ) : (
            <WishesMasonry wishes={wishes} />
          )}
        </div>
      </main>
    </>
  );
}
