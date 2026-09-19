/**
 * CATEGORIES PAGE (Coming Soon)
 */

"use client"

import { Tag } from "lucide-react"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen relative overflow-hidden cyber-grid">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 cyber-grid animate-grid-pulse"></div>
        <div className="scanline-overlay"></div>
      </div>

      <main className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="holo-card p-12 rounded-2xl neon-border-pink text-center max-w-2xl">
            <Tag className="w-16 h-16 neon-text-pink mx-auto mb-6 animate-float" />
            <h1 className="text-5xl font-bungee holographic mb-4">CATEGORIES</h1>
            <p className="text-2xl font-orbitron font-bold neon-text-pink mb-6">COMING SOON</p>
            <p className="font-rajdhani text-lg text-cyan-100 leading-relaxed">
              Create custom categories, set budgets, and organize your spending!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
