// 3) src/components/Header.tsx
// ================================
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={`rounded px-2 py-1 text-sm transition-colors hover:text-neon.ice ${pathname===href?"text-neon.ice":"text-white/85"}`}
      aria-current={pathname===href?"page":undefined}
    >{label}</Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-wide">NeonTJ</Link>
        <nav className="flex items-center gap-2">
          {link("/custom-sign","Create Text Sign")}
          {link("/submit-logo","Submit Logo")}
        </nav>
      </div>
    </header>
  );
}