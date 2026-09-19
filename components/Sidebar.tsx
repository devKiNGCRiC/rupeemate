/**
 * SIDEBAR COMPONENT
 * Navigation sidebar with menu items and a live monthly-budget summary
 */

"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Tag,
  Settings,
  X,
  TrendingUp,
  Receipt,
  Home,
  HardDrive,
} from "lucide-react"
import { useAppData } from "@/components/AppDataProvider"
import { budgetUsage, dashboardStats, formatINR } from "@/lib/expenses"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const { ready, expenses, budget } = useAppData()

  // Close the mobile drawer with Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  const menuItems = [
    ...(!isHomePage ? [{ icon: Home, label: "Home", href: "/", color: "cyan", soon: false }] : []),
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", color: "cyan", soon: false },
    { icon: Wallet, label: "Expenses", href: "/expenses", color: "pink", soon: false },
    { icon: PieChart, label: "Analytics", href: "/analytics", color: "purple", soon: false },
    { icon: Tag, label: "Categories", href: "/categories", color: "yellow", soon: false },
    { icon: TrendingUp, label: "Budget", href: "/budget", color: "green", soon: false },
    { icon: Receipt, label: "Receipts", href: "/receipts", color: "cyan", soon: true },
    { icon: Settings, label: "Settings", href: "/settings", color: "purple", soon: false },
  ]

  const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
    cyan: { border: "border-cyan-400/60", bg: "bg-cyan-400/10", text: "neon-text-cyan", glow: "shadow-[0_0_12px_rgba(0,245,255,0.4)]" },
    pink: { border: "border-pink-400/60", bg: "bg-pink-400/10", text: "neon-text-pink", glow: "shadow-[0_0_12px_rgba(255,0,110,0.4)]" },
    purple: { border: "border-purple-400/60", bg: "bg-purple-400/10", text: "neon-text-purple", glow: "shadow-[0_0_12px_rgba(139,0,255,0.4)]" },
    yellow: { border: "border-yellow-400/60", bg: "bg-yellow-400/10", text: "neon-text-yellow", glow: "shadow-[0_0_12px_rgba(255,234,0,0.4)]" },
    green: { border: "border-green-400/60", bg: "bg-green-400/10", text: "text-green-400", glow: "shadow-[0_0_12px_rgba(57,255,20,0.4)]" },
  }

  const spent = ready ? dashboardStats(expenses).thisMonth : 0
  const usage = budgetUsage(spent, budget.monthly)
  const percent = usage === null ? 0 : Math.min(100, Math.round(usage * 100))

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="app-sidebar"
        className={`
          fixed top-16 left-0 bottom-0 w-64 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          backdrop-blur-xl bg-black/70 border-r border-cyan-400/15
          overflow-y-auto
        `}
      >
        {/* Close button (mobile only) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-pink-400/10 border border-pink-400/30 hover:bg-pink-400/20 md:hidden transition-colors cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 neon-text-pink" />
        </button>

        {/* Menu Items */}
        <nav className="p-4 space-y-1 mt-2" aria-label="Sidebar">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const colors = colorMap[item.color] || colorMap.cyan

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl
                  font-rajdhani font-semibold text-base
                  transition-all duration-300 group
                  ${isActive
                    ? `${colors.bg} ${colors.border} border ${colors.text} ${colors.glow}`
                    : 'text-cyan-100/80 hover:bg-cyan-400/5 hover:text-cyan-100'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-linear-to-b from-cyan-400 to-pink-400" />
                )}
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                {item.label}
                {item.soon && (
                  <span className="ml-auto px-1.5 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/30 text-[9px] font-orbitron uppercase tracking-wider text-yellow-300">
                    Soon
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Monthly budget summary (real data) */}
        <div className="px-4 mt-6">
          <div className="glass-card p-4 rounded-xl border border-cyan-400/20">
            <div className="flex items-center justify-between mb-2">
              <p className="font-orbitron text-xs text-cyan-400 uppercase tracking-wider">Monthly Budget</p>
              {usage !== null && (
                <span className={`text-xs font-rajdhani ${usage > 1 ? "text-red-400" : "text-pink-400"}`}>
                  {Math.round(usage * 100)}%
                </span>
              )}
            </div>
            {usage !== null ? (
              <>
                <div
                  className="h-2 rounded-full bg-black/40 overflow-hidden"
                  role="progressbar"
                  aria-label="Monthly budget used"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                >
                  <div
                    className="h-full rounded-full bg-linear-to-r from-cyan-400 via-pink-400 to-purple-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-rajdhani text-cyan-100/70">
                  {formatINR(spent)} of {formatINR(budget.monthly)} spent
                </p>
              </>
            ) : (
              <p className="text-xs font-rajdhani text-cyan-100/70">
                No budget set yet.{" "}
                <Link href="/budget" onClick={onClose} className="neon-text-cyan underline underline-offset-2">
                  Set one
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Storage note */}
        <div className="px-4 mt-4 pb-6">
          <div className="glass-card p-4 rounded-xl border border-purple-400/30">
            <div className="flex items-start gap-3">
              <HardDrive className="w-4 h-4 neon-text-purple mt-0.5 shrink-0" />
              <p className="font-rajdhani text-xs text-cyan-100/70 leading-relaxed">
                Your data is saved only in this browser.{" "}
                <Link href="/settings" onClick={onClose} className="neon-text-purple underline underline-offset-2">
                  Back it up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
