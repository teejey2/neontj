import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Poppins } from "next/font/google";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400","600","700"], 
  variable: "--font-sans" 
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://neontj.com"),
  title: "NeonTJ — Custom Neon Signs",
  description: "Design custom neon text or submit a logo for a fast quote.",
  openGraph: {
    title: "NeonTJ — Custom Neon Signs",
    description: "Design custom neon text or submit a logo for a fast quote.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen bg-black text-white">
        <Header />
        {children}
      </body>
    </html>
  );
}