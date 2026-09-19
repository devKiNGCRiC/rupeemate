/**
 * ADVANCED MODE WELCOME POPUP
 * Shows benefits of using advanced expense tracking
 * Only appears on first visit (uses localStorage)
 */

"use client"

import { useState, useEffect } from "react"
import { X, Sparkles, TrendingUp, PieChart, Target, Zap, ArrowRight } from "lucide-react"

interface AdvancedModePopupProps {
  isOpen: boolean
  onClose: () => void
  onTryAdvanced: () => void
}

export default function AdvancedModePopup({ isOpen, onClose, onTryAdvanced }: AdvancedModePopupProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Small delay for animation
      const timer = setTimeout(() => setIsAnimating(true), 10)
      return () => {
        clearTimeout(timer)
        setIsAnimating(false)
      }
    }
    return undefined
  }, [isOpen])

  // Close with Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const benefits = [
    {
      icon: PieChart,
      title: "Detailed Insights",
      description: "See spending patterns by payment method, tags, and locations",
      color: "cyan"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Track recurring expenses and forecast your monthly budget",
      color: "pink"
    },
    {
      icon: Target,
      title: "Better Organization",
      description: "Use tags, notes, and sub-categories for precise tracking",
      color: "purple"
    }
  ]

  const colorClasses: Record<string, { text: string; bg: string; border: string }> = {
    cyan: { text: "neon-text-cyan", bg: "bg-cyan-400/10", border: "border-cyan-400/30" },
    pink: { text: "neon-text-pink", bg: "bg-pink-400/10", border: "border-pink-400/30" },
    purple: { text: "neon-text-purple", bg: "bg-purple-400/10", border: "border-purple-400/30" }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="advanced-popup-title"
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className={`relative w-full max-w-lg transform transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="holo-card rounded-3xl border border-cyan-400/30 overflow-hidden">
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 border border-cyan-400/20 hover:border-cyan-400/40 transition-colors z-10 cursor-pointer"
          >
            <X className="w-4 h-4 text-cyan-100/60" />
          </button>

          {/* Content */}
          <div className="relative p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-cyan-400/20 to-pink-400/20 border border-cyan-400/30 mb-4">
                <Sparkles className="w-8 h-8 neon-text-cyan" />
              </div>
              <h2 id="advanced-popup-title" className="text-2xl md:text-3xl font-bungee holographic mb-2">
                UNLOCK MORE
              </h2>
              <p className="font-rajdhani text-cyan-100/70 text-sm md:text-base">
                Get deeper insights with Advanced Mode
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                const colors = colorClasses[benefit.color]
                return (
                  <div
                    key={benefit.title}
                    className={`flex items-start gap-4 p-4 rounded-xl bg-black/30 border ${colors.border} transition-all duration-300 hover:bg-black/40`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className={`font-orbitron text-sm font-bold ${colors.text} mb-1`}>
                        {benefit.title}
                      </h3>
                      <p className="font-rajdhani text-sm text-cyan-100/60">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onTryAdvanced}
                className="flex-1 py-3.5 px-6 rounded-xl font-orbitron text-sm tracking-wider flex items-center justify-center gap-2 bg-linear-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-400/40 hover:border-cyan-400/70 text-cyan-100 hover:text-white transition-all duration-300 group cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                TRY ADVANCED
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 px-6 rounded-xl font-orbitron text-sm tracking-wider bg-black/40 border border-cyan-400/20 hover:border-cyan-400/40 text-cyan-100/60 hover:text-cyan-100 transition-all duration-300 cursor-pointer"
              >
                MAYBE LATER
              </button>
            </div>

            {/* Footer hint */}
            <p className="text-center mt-4 text-xs font-rajdhani text-cyan-100/40">
              You can switch modes anytime using the toggle
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
