import Link from "next/link";
import { Zap, Wallet, TrendingUp, Sparkles, ArrowRight, Shield, PieChart, HardDrive, Download, UserX } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* ========================================
          🎮 SIMPLIFIED BACKGROUND (Performance Optimized)
          ======================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        <div className="aurora-layer"></div>
      </div>

      {/* ========================================
          🌟 MAIN HERO SECTION
          ======================================== */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">

          {/* 🎯 Premium Badge with Neon Glow */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/5 border border-cyan-400/20">
              <Sparkles className="w-4 h-4 neon-text-yellow" />
              <span className="text-xs font-orbitron font-medium neon-text-cyan tracking-wider">
                BUILT FOR INDIA • ₹ FIRST
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
              TRACK • BUDGET • SAVE
            </p>
            <p className="text-sm sm:text-base md:text-lg font-rajdhani text-cyan-100/80 max-w-2xl mx-auto leading-relaxed px-4">
              Take control of your money with{" "}
              <span className="neon-text-pink font-semibold">simple tracking</span>, monthly{" "}
              <span className="neon-text-yellow font-semibold">budgets</span>, and{" "}
              <span className="neon-text-purple font-semibold">clear insights</span>
            </p>
          </div>

          {/* 🕹️ CTA Buttons with Neon Effects */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-16 sm:mb-20 w-full max-w-md sm:max-w-none px-4 sm:px-0">
            <Link
              href="/expenses"
              prefetch={true}
              className="group w-full sm:w-auto min-h-12 px-6 py-3.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 font-orbitron text-sm flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 neon-text-cyan" />
              <span className="neon-text-cyan">LAUNCH APP</span>
              <ArrowRight className="w-4 h-4 neon-text-cyan group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              prefetch={true}
              className="w-full sm:w-auto min-h-12 px-6 py-3.5 rounded-xl bg-pink-400/10 border border-pink-400/30 hover:bg-pink-400/20 hover:border-pink-400/50 transition-all duration-300 font-orbitron text-sm flex items-center justify-center gap-2"
            >
              <PieChart className="w-4 h-4 neon-text-pink" />
              <span className="neon-text-pink">VIEW DASHBOARD</span>
            </Link>
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
                    Log every rupee with{" "}
                    <span className="neon-text-pink font-medium">categories</span>, payment methods and{" "}
                    <span className="neon-text-yellow font-medium">search</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - Budgets */}
            <div className="group holo-card p-6 rounded-2xl border border-pink-400/15 hover:border-pink-400/30 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-pink-400/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 neon-text-pink" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-orbitron font-bold neon-text-pink tracking-wider">
                    SET BUDGETS
                  </h3>
                  <p className="font-rajdhani text-cyan-100/70 leading-relaxed text-sm">
                    Set a monthly limit, overall or{" "}
                    <span className="neon-text-cyan font-medium">per category</span>, and see how much is{" "}
                    <span className="neon-text-purple font-medium">left</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 - Insights */}
            <div className="group holo-card p-6 rounded-2xl border border-purple-400/15 hover:border-purple-400/30 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <PieChart className="w-6 h-6 neon-text-purple" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-orbitron font-bold neon-text-purple tracking-wider">
                    CLEAR INSIGHTS
                  </h3>
                  <p className="font-rajdhani text-cyan-100/70 leading-relaxed text-sm">
                    <span className="neon-text-yellow font-medium">Monthly trends</span> and{" "}
                    <span className="neon-text-cyan font-medium">category breakdowns</span> from your own data
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================
              🔒 PRIVACY HIGHLIGHTS
              ======================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 max-w-4xl w-full">
            <div className="holo-card p-5 rounded-2xl border border-cyan-400/15">
              <div className="flex items-center justify-between mb-3">
                <p className="font-orbitron text-[10px] uppercase tracking-[0.3em] text-cyan-400/80">PRIVATE</p>
                <HardDrive className="w-4 h-4 neon-text-cyan" />
              </div>
              <p className="text-xl font-bungee neon-text-cyan mb-2">ON YOUR DEVICE</p>
              <p className="font-rajdhani text-sm text-cyan-100/70">Data is saved in your browser, not on a server</p>
            </div>

            <div className="holo-card p-5 rounded-2xl border border-pink-400/15">
              <div className="flex items-center justify-between mb-3">
                <p className="font-orbitron text-[10px] uppercase tracking-[0.3em] text-pink-400/80">NO SIGNUP</p>
                <UserX className="w-4 h-4 neon-text-pink" />
              </div>
              <p className="text-xl font-bungee neon-text-pink mb-2">JUST START</p>
              <p className="font-rajdhani text-sm text-cyan-100/70">No account, no email, no tracking</p>
            </div>

            <div className="holo-card p-5 rounded-2xl border border-purple-400/15">
              <div className="flex items-center justify-between mb-3">
                <p className="font-orbitron text-[10px] uppercase tracking-[0.3em] text-purple-300/80">PORTABLE</p>
                <Download className="w-4 h-4 neon-text-purple" />
              </div>
              <p className="text-xl font-bungee neon-text-purple mb-2">EXPORT ANYTIME</p>
              <p className="font-rajdhani text-sm text-cyan-100/70">Download CSV or a full JSON backup</p>
            </div>
          </div>

          <p className="mt-12 font-rajdhani text-xs text-cyan-100/50 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
            Read exactly what happens to your data on the{" "}
            <Link href="/privacy" className="neon-text-cyan underline underline-offset-2">privacy page</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
