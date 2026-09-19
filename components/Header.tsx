/**
 * HEADER COMPONENT
 * Navigation bar with logo and menu
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Zap, Home, Wallet, BarChart3, PieChart, TrendingUp } from "lucide-react"

interface HeaderProps {
  onMenuToggle?: () => void
  isMenuOpen?: boolean
}

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/expenses", label: "Expenses", icon: Wallet },
  { href: "/analytics", label: "Analytics", icon: PieChart },
  { href: "/budget", label: "Budget", icon: TrendingUp },
]

export default function Header({ onMenuToggle, isMenuOpen = false }: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/85 border-b border-cyan-400/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="RupeeMate home">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md group-hover:bg-cyan-400/40 transition-all duration-300"></div>
              <div className="relative icon-glow">
                <Zap className="w-7 h-7 neon-text-cyan group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <span className="text-xl font-bungee holographic hidden sm:block">RUPEEMATE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Main">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-rajdhani font-semibold transition-all duration-300 group
                    ${isActive
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-cyan-100 hover:bg-cyan-400/5 hover:text-cyan-400"
                    }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`} />
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-linear-to-r from-cyan-400 to-pink-400" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={onMenuToggle}
              className="md:hidden p-2.5 rounded-xl bg-pink-400/5 border border-pink-400/20 hover:bg-pink-400/10 transition-all cursor-pointer"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
              aria-controls="app-sidebar"
            >
              <Menu className="w-5 h-5 neon-text-pink" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
