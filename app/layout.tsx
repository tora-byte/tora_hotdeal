import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToraHotDeal",
  description: "Community-powered hot deal discovery"
};

const navItems = [
  { href: "/", label: "홈" },
  { href: "/submit", label: "등록" },
  { href: "/mypage", label: "마이" },
  { href: "/admin", label: "관리" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/95 backdrop-blur">
          <div className="container flex h-14 items-center justify-between gap-4">
            <Link href="/" className="text-lg font-black tracking-normal text-[var(--brand)]">
              ToraHotDeal
            </Link>
            <nav className="flex items-center gap-1 text-sm font-semibold text-slate-700">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring rounded px-3 py-2 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
