import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Be_Vietnam_Pro,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { PlatformProvider } from "@/lib/platform-store";
import { AppShell } from "@/components/AppShell";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "All Your Life (OYLG) — Hướng Nghiệp, Cố Vấn Cuộc Sống & Đồng Hành Học Sinh",
  description:
    "Hệ sinh thái đồng hành 3 tầng dịch vụ: Hướng nghiệp khám phá bản thân, Cố vấn cuộc sống tầm soát 3 mặt và Chuyên gia bộ môn kèm sát (Lớp 1–12).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen bg-[#FBF9F5] text-[#141413] font-sans antialiased selection:bg-[#141413] selection:text-[#FBF9F5]">
        <PlatformProvider>
          <AppShell>{children}</AppShell>
        </PlatformProvider>
      </body>
    </html>
  );
}
