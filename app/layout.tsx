import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import CallButton from "@/components/CallButton";

/* ============================================
   METADATA - SEO tối ưu cho thiệp mời
   ============================================ */
export const metadata: Metadata = {
  title: "Lễ Tốt Nghiệp - Nguyễn Duy Hưng | UIT 2026",
  description:
    "Thiệp mời tham dự Lễ Tốt Nghiệp Đại học Công nghệ Thông tin (UIT) - Nguyễn Duy Hưng, Ngành Kỹ thuật Phần mềm. 8h00 ngày 10/06/2026.",
  keywords: ["tốt nghiệp", "UIT", "Nguyễn Duy Hưng", "thiệp mời", "graduation"],
  openGraph: {
    title: "Lễ Tốt Nghiệp - Nguyễn Duy Hưng | UIT 2026",
    description:
      "Trân trọng kính mời bạn đến chung vui tại Lễ Tốt Nghiệp của Nguyễn Duy Hưng, Đại học Công nghệ Thông tin.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen">
        <Script id="zalo-jsv2-guard" strategy="beforeInteractive">
          {`window.zaloJSV2 = window.zaloJSV2 || {};`}
        </Script>
        {children}
        <CallButton />
      </body>
    </html>
  );
}
