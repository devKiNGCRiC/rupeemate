/**
 * FLOATING ACTION BUTTON (FAB)
 * Quick actions menu for mobile
 */

"use client"

import { useState } from "react"
import { Plus, X, Wallet, TrendingUp, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Don't show on homepage
  if (pathname === "/") return null

  const actions = [
    { icon: Wallet, label: "Add Expense", href: "/expenses", color: "cyan" },
    { icon: TrendingUp, label: "Dashboard", href: "/dashboard", color: "pink" },
    { icon: Search, label: "Analytics", href: "/analytics", color: "purple" },
  ]

  const colorClasses: Record<string, string> = {
    cyan: "bg-cyan-400/20 border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/30",
    pink: "bg-pink-400/20 border-pink-400/40 text-pink-400 hover:bg-pink-400/30",
    purple: "bg-purple-400/20 border-purple-400/40 text-purple-400 hover:bg-purple-400/30",
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2 animate-slide-in-right">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={action.href}
                href={action.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl border ${colorClasses[action.color]} transition-all duration-300 shadow-lg cursor-pointer`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-rajdhani font-semibold text-sm whitespace-nowrap">
                  {action.label}
                </span>
              </Link>
            )
          })}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full backdrop-blur-xl border-2 flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
          isOpen
            ? "bg-pink-400/20 border-pink-400/50 rotate-45"
            : "bg-cyan-400/20 border-cyan-400/50 hover:bg-cyan-400/30"
        }`}
        aria-label="Quick actions menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-pink-400" />
        ) : (
          <Plus className="w-6 h-6 text-cyan-400" />
        )}
      </button>
    </div>
  )
}
