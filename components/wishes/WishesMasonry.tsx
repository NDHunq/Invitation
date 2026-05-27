import { WishItem } from "@/lib/wishes";

function formatDisplayDate(timestamp: string): string {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day} Tháng ${month}, ${year}`;
}

function getInitial(name: string | null): string {
  const safeName = (name ?? "Khách mời").trim();
  return safeName ? safeName.charAt(0).toUpperCase() : "K";
}

function getDisplayName(name: string | null): string {
  const safeName = (name ?? "").trim();
  return safeName || "Khách mời";
}

function getDisplayMessage(message: string | null): string {
  const safeMessage = (message ?? "").trim();
  return safeMessage || "Chúc mừng tốt nghiệp và chúc bạn thật nhiều thành công.";
}

export default function WishesMasonry({ wishes }: { wishes: WishItem[] }) {
  return (
    <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
      {wishes.map((wish) => (
        <article
          key={wish.id}
          className="mb-5 break-inside-avoid rounded-2xl border border-white/12 bg-white/5 p-5 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/8 hover:shadow-[0_8px_28px_rgba(37,99,235,0.2)]"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-300 via-blue-500 to-cyan-300 text-sm font-bold text-slate-950 shadow-lg shadow-blue-500/20">
              {getInitial(wish.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                {getDisplayName(wish.name)}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{formatDisplayDate(wish.created_at)}</p>
            </div>
          </div>

          <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">
            {getDisplayMessage(wish.message)}
          </p>
        </article>
      ))}
    </div>
  );
}
