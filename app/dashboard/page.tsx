/**
 * DASHBOARD PAGE
 * Overview of your expenses: totals, month-over-month change, category split
 * and recent activity. Everything is calculated from the expenses you saved.
 */

"use client"

import Link from "next/link"
import { TrendingUp, TrendingDown, Wallet, Calendar, IndianRupee, PieChart, Plus } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"
import { useAppData } from "@/components/AppDataProvider"
import {
  NEON_GRADIENTS,
  categoryMeta,
  categoryTotals,
  dashboardStats,
  formatDisplayDate,
  formatINR,
  recentExpenses,
} from "@/lib/expenses"

export default function DashboardPage() {
  const { ready, expenses } = useAppData()

  const stats = dashboardStats(expenses)
  const categoryBreakdown = categoryTotals(stats.thisMonthExpenses)
  const recentTransactions = recentExpenses(expenses, 5)

  const change = stats.monthChange
  const changeUp = change !== null && change > 0

  return (
    <div className="relative overflow-hidden min-h-full">
      {/* Background - Simplified */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        <div className="aurora-layer"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">

        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bungee holographic mb-2">DASHBOARD</h1>
          <p className="text-lg font-rajdhani text-cyan-100/80">
            Your financial overview at a glance
          </p>
        </div>

        {!ready ? (
          <p className="text-center font-rajdhani text-cyan-100/50 py-12" role="status">Loading your dashboard…</p>
        ) : expenses.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="holo-card p-8 sm:p-10 rounded-3xl border border-cyan-400/20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-cyan-400/10 to-pink-400/10 flex items-center justify-center">
                <span className="text-4xl" aria-hidden="true">📊</span>
              </div>
              <h2 className="text-2xl font-orbitron font-bold neon-text-cyan mb-3 tracking-wider">NOTHING TO SHOW YET</h2>
              <p className="font-rajdhani text-cyan-100/70 mb-6 leading-relaxed">
                Add your first expense and your totals, monthly trend and category breakdown will appear here.
              </p>
              <Link
                href="/expenses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 font-orbitron text-sm neon-text-cyan"
              >
                <Plus className="w-4 h-4" />
                ADD AN EXPENSE
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {/* Total Expenses */}
              <div className="group holo-card p-5 rounded-2xl border border-cyan-400/15 hover:border-cyan-400/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wallet className="w-5 h-5 neon-text-cyan" />
                  </div>
                  <span className="text-xs font-rajdhani text-cyan-100/50">{expenses.length} total</span>
                </div>
                <p className="text-[10px] font-orbitron text-cyan-400/80 uppercase tracking-[0.3em] mb-1">
                  TOTAL EXPENSES
                </p>
                <p className="text-2xl font-bungee neon-text-cyan">
                  {formatINR(stats.total)}
                </p>
              </div>

              {/* This Month */}
              <div className="group holo-card p-5 rounded-2xl border border-pink-400/15 hover:border-pink-400/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5 neon-text-pink" />
                  </div>
                  {change !== null && (
                    <span className={`flex items-center gap-1 text-xs font-rajdhani ${changeUp ? "text-red-400" : "text-green-400"}`}>
                      {changeUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(Math.round(change))}% vs last month
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-orbitron text-pink-300/80 uppercase tracking-[0.3em] mb-1">
                  THIS MONTH
                </p>
                <p className="text-2xl font-bungee neon-text-pink">
                  {formatINR(stats.thisMonth)}
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
                  {formatINR(stats.lastMonth)}
                </p>
              </div>

              {/* Avg Per Day */}
              <div className="group holo-card p-5 rounded-2xl border border-yellow-400/15 hover:border-yellow-400/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IndianRupee className="w-5 h-5 neon-text-yellow" />
                  </div>
                  <span className="text-xs font-rajdhani text-yellow-300/60">this month</span>
                </div>
                <p className="text-[10px] font-orbitron text-yellow-300/80 uppercase tracking-[0.3em] mb-1">
                  AVG PER DAY
                </p>
                <p className="text-2xl font-bungee neon-text-yellow">
                  {formatINR(stats.avgPerDay)}
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

                {categoryBreakdown.length === 0 ? (
                  <p className="font-rajdhani text-sm text-cyan-100/60">
                    No expenses recorded this month yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {categoryBreakdown.map((cat) => {
                      const meta = categoryMeta(cat.name)
                      return (
                        <div key={cat.name} className="group">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-rajdhani text-sm text-cyan-100 font-medium">
                              {meta.icon} {cat.name}
                            </span>
                            <span className="font-rajdhani text-xs text-cyan-100/70">
                              {formatINR(cat.amount)} <span className="text-cyan-400/60">({Math.round(cat.percent)}%)</span>
                            </span>
                          </div>
                          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500 group-hover:brightness-125"
                              style={{
                                width: `${cat.percent}%`,
                                background: NEON_GRADIENTS[meta.color],
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Recent Transactions */}
              <div className="holo-card p-6 rounded-2xl border border-pink-400/15">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-orbitron font-bold neon-text-pink">
                    RECENT ACTIVITY
                  </h2>
                </div>

                <ul className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <li
                      key={tx.id}
                      className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-black/30 border border-cyan-400/5 hover:border-pink-400/20 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-pink-400/10 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
                          {categoryMeta(tx.category).icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-rajdhani text-sm text-cyan-100 font-medium truncate">
                            {tx.description}
                          </p>
                          <p className="text-[10px] font-rajdhani text-cyan-400/60">
                            {tx.category} • {formatDisplayDate(tx.date)}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bungee neon-text-pink shrink-0">
                        {formatINR(tx.amount)}
                      </p>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/expenses"
                  className="block w-full mt-5 py-2.5 rounded-xl bg-pink-400/10 border border-pink-400/20 text-center text-sm font-orbitron neon-text-pink hover:bg-pink-400/20 transition-all duration-300"
                >
                  VIEW ALL EXPENSES
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
