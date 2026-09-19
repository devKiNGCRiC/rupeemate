/**
 * FOOTER COMPONENT
 */

import { Heart, Github, Twitter, Linkedin, Zap, Mail } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative backdrop-blur-xl bg-black/70 border-t border-cyan-400/15">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-400/20 to-pink-400/20 flex items-center justify-center">
                <Zap className="w-4 h-4 neon-text-cyan" />
              </div>
              <span className="text-lg font-bungee holographic">RUPEEMATE</span>
            </div>
            <p className="font-rajdhani text-cyan-100/70 text-sm leading-relaxed mb-4">
              Track expenses with style. Beautiful, powerful, and completely free.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-cyan-400/5 border border-cyan-400/20 flex items-center justify-center hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all group cursor-pointer" title="GitHub">
                <Github className="w-4 h-4 text-cyan-100/70 group-hover:neon-text-cyan transition-colors" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-pink-400/5 border border-pink-400/20 flex items-center justify-center hover:border-pink-400/50 hover:bg-pink-400/10 transition-all group cursor-pointer" title="Twitter">
                <Twitter className="w-4 h-4 text-cyan-100/70 group-hover:neon-text-pink transition-colors" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-purple-400/5 border border-purple-400/20 flex items-center justify-center hover:border-purple-400/50 hover:bg-purple-400/10 transition-all group cursor-pointer" title="LinkedIn">
                <Linkedin className="w-4 h-4 text-cyan-100/70 group-hover:neon-text-purple transition-colors" />
              </a>
            </div>
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
              Resources
            </h4>
            <ul className="space-y-2.5 font-rajdhani text-sm text-cyan-100/70">
              <li><a href="#" className="hover:text-pink-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">API Docs</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-orbitron text-xs neon-text-purple uppercase tracking-[0.3em] mb-4">
              Stay Updated
            </h4>
            <p className="font-rajdhani text-xs text-cyan-100/60 mb-3">
              Get tips on saving money and new features.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-purple-400/20 text-sm font-rajdhani text-white placeholder:text-cyan-100/30 focus:outline-none focus:border-purple-400/50 transition-colors"
              />
              <button className="p-2 rounded-lg bg-purple-400/10 border border-purple-400/30 hover:bg-purple-400/20 transition-colors cursor-pointer" title="Subscribe">
                <Mail className="w-4 h-4 neon-text-purple" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-cyan-400/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-rajdhani text-xs text-cyan-100/50">
            © 2025 RupeeMate. Crafted with <Heart className="inline w-3 h-3 neon-text-pink" /> in India
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs font-rajdhani text-cyan-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              All systems operational
            </span>
            <span className="font-orbitron text-[10px] text-cyan-400/50 uppercase tracking-wider">
              v2.0 • Cyber Mode
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
