/**
 * HEADER COMPONENT
 * Navigation bar with logo, menu, theme toggle
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, Zap, Home, Wallet, BarChart3, Sun, Moon, Sparkles } from "lucide-react"

interface HeaderProps {
  onMenuToggle?: () => void
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/expenses", label: "Expenses", icon: Wallet },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/85 border-b border-cyan-400/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md group-hover:bg-cyan-400/40 transition-all duration-300"></div>
              <div className="relative icon-glow">
                <Zap className="w-7 h-7 neon-text-cyan group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <span className="text-xl font-bungee holographic hidden sm:block">RUPEEMATE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
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
            {/* Live indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <span className="text-xs font-rajdhani font-semibold text-green-400 uppercase tracking-wider">Live</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-400/5 border border-cyan-400/20 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all duration-300 group cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 neon-text-yellow group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 neon-text-purple group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Upgrade badge (optional CTA) */}
            <button className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 hover:border-pink-400/60 transition-all duration-300 group cursor-pointer">
              <Sparkles className="w-4 h-4 neon-text-pink group-hover:animate-pulse" />
              <span className="text-sm font-rajdhani font-semibold neon-text-pink">Pro</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2.5 rounded-xl bg-pink-400/5 border border-pink-400/20 hover:bg-pink-400/10 transition-all cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-5 h-5 neon-text-pink" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
