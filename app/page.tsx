import Link from "next/link";
import { Zap, Wallet, Users, TrendingUp, Sparkles, ArrowRight, Shield, Activity, Clock, Gauge } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* ========================================
          🎮 SIMPLIFIED BACKGROUND (Performance Optimized)
          ======================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        <div className="aurora-layer"></div>
      </div>

      {/* ========================================
          🌟 MAIN HERO SECTION
          ======================================== */}
      <main className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
          
          {/* 🎯 Premium Badge with Neon Glow */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/5 border border-cyan-400/20">
              <Sparkles className="w-4 h-4 neon-text-yellow" />
              <span className="text-xs font-orbitron font-medium neon-text-cyan tracking-wider">
                INDIA&apos;S SMARTEST EXPENSE TRACKER
              </span>
            </div>
          </div>
          
          {/* 🎮 Hero Title with Holographic Effect */}
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bungee mb-4 sm:mb-6 holographic tracking-wider leading-tight">
            RUPEEMATE
          </h1>
          
          {/* ⚡ Glitch Subtitle */}
          <div className="mb-8 sm:mb-10">
            <p className="text-lg sm:text-xl md:text-2xl font-orbitron font-bold neon-text-cyan mb-2 sm:mb-3">
              TRACK • SPLIT • SAVE
            </p>
            <p className="text-sm sm:text-base md:text-lg font-rajdhani text-cyan-100/80 max-w-2xl mx-auto leading-relaxed px-4">
              Take control of your money with{" "}
              <span className="neon-text-pink font-semibold">smart tracking</span>, easy{" "}
              <span className="neon-text-yellow font-semibold">bill splitting</span>, and{" "}
              <span className="neon-text-purple font-semibold">helpful insights</span>
            </p>
          </div>

          {/* 🕹️ CTA Buttons with Neon Effects */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-16 sm:mb-20 w-full max-w-md sm:max-w-none px-4 sm:px-0">
            <Link href="/expenses" prefetch={true} className="w-full sm:w-auto">
              <button className="group w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 font-orbitron text-sm flex items-center justify-center gap-2 cursor-pointer">
                <Zap className="w-4 h-4 neon-text-cyan" />
                <span className="neon-text-cyan">LAUNCH APP</span>
                <ArrowRight className="w-4 h-4 neon-text-cyan group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl bg-pink-400/10 border border-pink-400/30 hover:bg-pink-400/20 hover:border-pink-400/50 transition-all duration-300 font-orbitron text-sm flex items-center justify-center gap-2 cursor-pointer">
              <Shield className="w-4 h-4 neon-text-pink" />
              <span className="neon-text-pink">VIEW DEMO</span>
            </button>
          </div>

          {/* ========================================
              💎 FEATURE CARDS - Holographic Design
              ======================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full">
            {/* Card 1 - Track Expenses */}
            <div className="group holo-card p-6 rounded-2xl border border-cyan-400/15 hover:border-cyan-400/30 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-6 h-6 neon-text-cyan" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-orbitron font-bold neon-text-cyan tracking-wider">
                    TRACK EXPENSES
                  </h3>
                  <p className="font-rajdhani text-cyan-100/70 leading-relaxed text-sm">
                    Monitor every rupee with{" "}
                    <span className="neon-text-pink font-medium">smart categories</span> and{" "}
                    <span className="neon-text-yellow font-medium">instant insights</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - Split Bills */}
            <div className="group holo-card p-6 rounded-2xl border border-pink-400/15 hover:border-pink-400/30 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-pink-400/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 neon-text-pink" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-orbitron font-bold neon-text-pink tracking-wider">
                    SPLIT BILLS
                  </h3>
                  <p className="font-rajdhani text-cyan-100/70 leading-relaxed text-sm">
                    Share expenses with friends using{" "}
                    <span className="neon-text-cyan font-medium">easy calculations</span> and{" "}
                    <span className="neon-text-purple font-medium">quick settlement</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 - Smart Insights */}
            <div className="group holo-card p-6 rounded-2xl border border-purple-400/15 hover:border-purple-400/30 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 neon-text-purple" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-orbitron font-bold neon-text-purple tracking-wider">
                    SMART INSIGHTS
                  </h3>
                  <p className="font-rajdhani text-cyan-100/70 leading-relaxed text-sm">
                    Get{" "}
                    <span className="neon-text-yellow font-medium">spending reports</span> and{" "}
                    <span className="neon-text-cyan font-medium">money-saving tips</span> for better decisions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================
              📊 STATS SECTION - Cyberpunk Style
              ======================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 max-w-4xl w-full">
            <div className="group holo-card p-5 rounded-2xl border border-cyan-400/15 hover:border-cyan-400/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="font-orbitron text-[10px] uppercase tracking-[0.3em] text-cyan-400/80">ADOPTION</p>
                <Activity className="w-4 h-4 neon-text-cyan" />
              </div>
              <p className="text-3xl font-bungee neon-text-cyan mb-2">10K+</p>
              <p className="font-rajdhani text-sm text-cyan-100/70">Users tracking daily</p>
            </div>

            <div className="group holo-card p-5 rounded-2xl border border-pink-400/15 hover:border-pink-400/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="font-orbitron text-[10px] uppercase tracking-[0.3em] text-pink-400/80">IMPACT</p>
                <Gauge className="w-4 h-4 neon-text-pink" />
              </div>
              <p className="text-3xl font-bungee neon-text-pink mb-2">₹50M+</p>
              <p className="font-rajdhani text-sm text-cyan-100/70">Expenses tracked</p>
            </div>

            <div className="group holo-card p-5 rounded-2xl border border-purple-400/15 hover:border-purple-400/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="font-orbitron text-[10px] uppercase tracking-[0.3em] text-purple-300/80">UPTIME</p>
                <Clock className="w-4 h-4 neon-text-purple" />
              </div>
              <p className="text-3xl font-bungee neon-text-purple mb-2">99.9%</p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <p className="font-rajdhani text-sm text-cyan-100/70">All systems online</p>
              </div>
            </div>
          </div>

          {/* ========================================
              🎪 FOOTER TAGLINE
              ======================================== */}
          <div className="mt-16 text-center">
            <p className="font-rajdhani text-xs text-cyan-400/50">
              Built with Next.js • Cyberpunk Aesthetics
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
