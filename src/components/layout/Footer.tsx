/* src/components/layout/Footer.tsx */
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3">
        <div className="text-white/80">
          <div className="text-lg font-semibold">NeonTJ</div>
          <p className="mt-2 text-sm text-white/60">Custom LED neon signs — fast quotes, designer help.</p>
        </div>
        <div className="text-sm">
          <div className="mb-2 font-semibold text-white/80">Explore</div>
          <ul className="space-y-1 text-white/70">
            <li><Link href="/custom-sign" className="hover:text-white">Create Text Sign</Link></li>
            <li><Link href="/submit-logo" className="hover:text-white">Submit Logo</Link></li>
            <li><Link href="/portfolio" className="hover:text-white">Portfolio</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-2 font-semibold text-white/80">Legal</div>
          <ul className="space-y-1 text-white/70">
            <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} NeonTJ
      </div>
    </footer>
  );
}
