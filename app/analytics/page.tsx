/**
 * ANALYTICS PAGE (Coming Soon)
 */

"use client"

import { PieChart, TrendingUp, BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden cyber-grid">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 cyber-grid animate-grid-pulse"></div>
        <div className="scanline-overlay"></div>
      </div>

      <main className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="holo-card p-12 rounded-2xl neon-border-cyan text-center max-w-2xl">
            <div className="flex items-center justify-center gap-6 mb-6">
              <PieChart className="w-16 h-16 neon-text-cyan animate-float" />
              <BarChart3 className="w-16 h-16 neon-text-pink animate-float" style={{ animationDelay: '0.2s' }} />
              <TrendingUp className="w-16 h-16 neon-text-purple animate-float" style={{ animationDelay: '0.4s' }} />
            </div>
            <h1 className="text-5xl font-bungee holographic mb-4">ANALYTICS</h1>
            <p className="text-2xl font-orbitron font-bold neon-text-cyan mb-6">COMING SOON</p>
            <p className="font-rajdhani text-lg text-cyan-100 leading-relaxed">
              Detailed spending insights, charts, and financial reports are on the way!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
