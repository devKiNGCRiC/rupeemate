/**
 * DASHBOARD PAGE
 * Overview of expenses with stats and charts
 */

"use client"

import { TrendingUp, TrendingDown, Wallet, Calendar, DollarSign, PieChart } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"

export default function DashboardPage() {
  // Mock data - in real app, fetch from API
  const stats = {
    totalExpenses: 45670,
    thisMonth: 12340,
    lastMonth: 10890,
    avgPerDay: 411,
  }

  const categoryBreakdown = [
    { name: "Food", amount: 5200, percent: 42, color: "cyan" },
    { name: "Transport", amount: 2800, percent: 23, color: "pink" },
    { name: "Entertainment", amount: 2100, percent: 17, color: "purple" },
    { name: "Shopping", amount: 1400, percent: 11, color: "yellow" },
    { name: "Others", amount: 840, percent: 7, color: "green" },
  ]

  const recentTransactions = [
    { id: 1, desc: "Dinner at Pizza Hut", amount: 850, category: "Food", date: "Dec 9" },
    { id: 2, desc: "Uber to office", amount: 180, category: "Transport", date: "Dec 9" },
    { id: 3, desc: "Movie tickets", amount: 600, category: "Entertainment", date: "Dec 8" },
    { id: 4, desc: "Grocery shopping", amount: 1200, category: "Food", date: "Dec 8" },
  ]

  const progressGradients: Record<string, string> = {
    cyan: "linear-gradient(90deg, rgba(0,245,255,0.9), rgba(0,245,255,0.2))",
    pink: "linear-gradient(90deg, rgba(255,0,110,0.85), rgba(255,0,110,0.2))",
    purple: "linear-gradient(90deg, rgba(139,0,255,0.85), rgba(139,0,255,0.25))",
    yellow: "linear-gradient(90deg, rgba(255,234,0,0.85), rgba(255,234,0,0.25))",
    green: "linear-gradient(90deg, rgba(57,255,20,0.85), rgba(57,255,20,0.25))",
  }

  return (
    <div className="relative overflow-hidden min-h-full">
      {/* Background - Simplified */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        <div className="aurora-layer"></div>
      </div>

      <main className="container mx-auto px-6 py-12 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb />
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bungee holographic mb-2">DASHBOARD</h1>
          <p className="text-lg font-rajdhani text-cyan-100/80">
            Your financial overview at a glance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Total Expenses */}
          <div className="group holo-card p-5 rounded-2xl border border-cyan-400/15 hover:border-cyan-400/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5 neon-text-cyan" />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs font-rajdhani">
                <TrendingUp className="w-3 h-3" />
                <span>12%</span>
              </div>
            </div>
            <p className="text-[10px] font-orbitron text-cyan-400/80 uppercase tracking-[0.3em] mb-1">
              TOTAL EXPENSES
            </p>
            <p className="text-2xl font-bungee neon-text-cyan">
              ₹{stats.totalExpenses.toLocaleString()}
            </p>
          </div>

          {/* This Month */}
          <div className="group holo-card p-5 rounded-2xl border border-pink-400/15 hover:border-pink-400/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-pink-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 neon-text-pink" />
              </div>
              <span className="text-xs font-rajdhani text-pink-300/80">+13%</span>
            </div>
            <p className="text-[10px] font-orbitron text-pink-300/80 uppercase tracking-[0.3em] mb-1">
              THIS MONTH
            </p>
            <p className="text-2xl font-bungee neon-text-pink">
              ₹{stats.thisMonth.toLocaleString()}
            </p>
          </div>

          {/* Last Month */}
          <div className="group holo-card p-5 rounded-2xl border border-purple-400/15 hover:border-purple-400/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingDown className="w-5 h-5 neon-text-purple" />
              </div>
              <span className="text-xs font-rajdhani text-purple-300/60">baseline</span>
            </div>
            <p className="text-[10px] font-orbitron text-purple-300/80 uppercase tracking-[0.3em] mb-1">
              LAST MONTH
            </p>
            <p className="text-2xl font-bungee neon-text-purple">
              ₹{stats.lastMonth.toLocaleString()}
            </p>
          </div>

          {/* Avg Per Day */}
          <div className="group holo-card p-5 rounded-2xl border border-yellow-400/15 hover:border-yellow-400/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5 neon-text-yellow" />
              </div>
            </div>
            <p className="text-[10px] font-orbitron text-yellow-300/80 uppercase tracking-[0.3em] mb-1">
              AVG PER DAY
            </p>
            <p className="text-2xl font-bungee neon-text-yellow">
              ₹{stats.avgPerDay}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="holo-card p-6 rounded-2xl border border-cyan-400/15">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                  <PieChart className="w-5 h-5 neon-text-cyan" />
                </div>
                <h2 className="text-lg font-orbitron font-bold neon-text-cyan">
                  BY CATEGORY
                </h2>
              </div>
              <span className="text-xs font-rajdhani text-cyan-100/50">This month</span>
            </div>

            <div className="space-y-4">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-rajdhani text-sm text-cyan-100 font-medium">
                      {cat.name}
                    </span>
                    <span className="font-rajdhani text-xs text-cyan-100/70">
                      ₹{cat.amount.toLocaleString()} <span className="text-cyan-400/60">({cat.percent}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 group-hover:brightness-125"
                      style={{
                        width: `${cat.percent}%`,
                        background: progressGradients[cat.color] || progressGradients.cyan,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="holo-card p-6 rounded-2xl border border-pink-400/15">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-orbitron font-bold neon-text-pink">
                RECENT ACTIVITY
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span className="font-rajdhani text-xs text-cyan-100/50">Live</span>
              </div>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="group flex items-center justify-between p-3 rounded-xl bg-black/30 border border-cyan-400/5 hover:border-pink-400/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-pink-400/10 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                      {tx.category === "Food" && "🍔"}
                      {tx.category === "Transport" && "🚗"}
                      {tx.category === "Entertainment" && "🎬"}
                      {tx.category === "Shopping" && "🛒"}
                    </div>
                    <div>
                      <p className="font-rajdhani text-sm text-cyan-100 font-medium">
                        {tx.desc}
                      </p>
                      <p className="text-[10px] font-rajdhani text-cyan-400/60">
                        {tx.category} • {tx.date}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bungee neon-text-pink">
                    ₹{tx.amount}
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full mt-5 py-2.5 rounded-xl bg-pink-400/10 border border-pink-400/20 text-sm font-orbitron neon-text-pink hover:bg-pink-400/20 transition-all duration-300 cursor-pointer">
              VIEW ALL EXPENSES
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
