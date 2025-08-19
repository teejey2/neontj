/* src/app/layout.tsx */
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Inter } from "next/font/google";
import { fontVarsClass } from "@/lib/fonts"; // ✅ add this

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "NeonTJ — Custom LED Neon Signs", template: "%s — NeonTJ" },
  description: "Design a custom LED neon sign with instant preview and fast quotes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fontVarsClass} bg-black text-white`}>
      <body className="font-sans">
        <Header />
        <div className="min-h-[calc(100vh-200px)]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
