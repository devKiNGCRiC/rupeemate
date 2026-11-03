/**
 * FOOTER COMPONENT
 */

import { Heart, Zap } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative backdrop-blur-xl bg-black/70 border-t border-cyan-400/15">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-400/20 to-pink-400/20 flex items-center justify-center">
                <Zap className="w-4 h-4 neon-text-cyan" />
              </div>
              <span className="text-lg font-bungee holographic">RUPEEMATE</span>
            </div>
            <p className="font-rajdhani text-cyan-100/70 text-sm leading-relaxed">
              A private expense tracker for India. Free to use, no signup, and your data never leaves your browser.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-orbitron text-xs neon-text-cyan uppercase tracking-[0.3em] mb-4">
              Navigate
            </h4>
            <ul className="space-y-2.5 font-rajdhani text-sm text-cyan-100/70">
              <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/expenses" className="hover:text-cyan-400 transition-colors">Expenses</Link></li>
              <li><Link href="/analytics" className="hover:text-cyan-400 transition-colors">Analytics</Link></li>
              <li><Link href="/budget" className="hover:text-cyan-400 transition-colors">Budget</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-orbitron text-xs neon-text-pink uppercase tracking-[0.3em] mb-4">
              Your Data
            </h4>
            <ul className="space-y-2.5 font-rajdhani text-sm text-cyan-100/70">
              <li><Link href="/privacy" className="hover:text-pink-400 transition-colors">Privacy</Link></li>
              <li><Link href="/settings" className="hover:text-pink-400 transition-colors">Export &amp; backup</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-cyan-400/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-rajdhani text-xs text-cyan-100/50">
            © {new Date().getFullYear()} RupeeMate. Crafted with <Heart className="inline w-3 h-3 neon-text-pink" aria-label="love" /> in India
          </p>
        </div>
      </div>
    </footer>
  )
}
