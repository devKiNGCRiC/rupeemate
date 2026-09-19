/**
 * ANALYTICS PAGE
 * Spending insights calculated from the expenses you saved.
 */

"use client"

import { useAppData } from "@/components/AppDataProvider"
import PageShell from "@/components/PageShell"
import EmptyState from "@/components/EmptyState"
import BarList from "@/components/ui/BarList"
import {
  categoryMeta,
  categoryTotals,
  formatDisplayDate,
  formatINR,
  formatMonthLabel,
  monthlyTotals,
  paymentMethodTotals,
  sumAmounts,
  type NeonColor,
} from "@/lib/expenses"

const METHOD_COLORS: NeonColor[] = ["cyan", "pink", "purple", "yellow", "green"]

export default function AnalyticsPage() {
  const { ready, expenses } = useAppData()

  return (
    <PageShell title="ANALYTICS" subtitle="Where your money goes, and how it changes over time">
      {!ready ? (
        <p className="text-center font-rajdhani text-cyan-100/50 py-12" role="status">Loading your analytics…</p>
      ) : expenses.length === 0 ? (
        <EmptyState
          emoji="📈"
          title="NO DATA TO ANALYSE"
          message="Add a few expenses and this page will show your monthly trend, category split and biggest purchases."
        />
      ) : (
        <AnalyticsContent />
      )}
    </PageShell>
  )
}

function AnalyticsContent() {
  const { expenses } = useAppData()

  const total = sumAmounts(expenses)
  const largest = expenses.reduce((max, e) => (e.amount > max.amount ? e : max), expenses[0])
  const months = monthlyTotals(expenses, 6)
  const maxMonth = Math.max(...months.map((m) => m.amount), 1)
  const categories = categoryTotals(expenses)
  const methods = paymentMethodTotals(expenses)
  const topExpenses = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5)

  const tiles = [
    { label: "TOTAL SPEND", value: formatINR(total), tone: "neon-text-cyan", border: "border-cyan-400/15" },
    { label: "TRANSACTIONS", value: expenses.length.toLocaleString("en-IN"), tone: "neon-text-pink", border: "border-pink-400/15" },
    { label: "AVG PER TRANSACTION", value: formatINR(total / expenses.length), tone: "neon-text-purple", border: "border-purple-400/15" },
    { label: "LARGEST EXPENSE", value: formatINR(largest.amount), tone: "neon-text-yellow", border: "border-yellow-400/15" },
  ]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {tiles.map((tile) => (
          <div key={tile.label} className={`holo-card p-5 rounded-2xl border ${tile.border}`}>
            <p className="text-[10px] font-orbitron text-cyan-100/70 uppercase tracking-[0.3em] mb-2">{tile.label}</p>
            <p className={`text-2xl font-bungee ${tile.tone}`}>{tile.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly trend */}
      <section className="holo-card p-6 rounded-2xl border border-cyan-400/15 mb-6" aria-labelledby="trend-heading">
        <h2 id="trend-heading" className="text-lg font-orbitron font-bold neon-text-cyan mb-1">MONTHLY TREND</h2>
        <p className="font-rajdhani text-xs text-cyan-100/50 mb-6">Total spend in each of the last 6 months</p>
        <ul className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-56">
          {months.map((m, i) => (
            <li key={m.month} className="flex flex-col items-center justify-end h-full gap-2 min-w-0">
              <span className="font-rajdhani text-[10px] sm:text-xs text-cyan-100/80 truncate max-w-full">{formatINR(m.amount)}</span>
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-md bg-linear-to-t from-cyan-400/30 to-pink-400/80"
                  style={{ height: `${m.amount > 0 ? Math.max(2, (m.amount / maxMonth) * 100) : 0}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className={`font-rajdhani text-[10px] sm:text-xs ${i === months.length - 1 ? "neon-text-cyan font-semibold" : "text-cyan-100/60"}`}>
                {formatMonthLabel(m.month)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <section className="holo-card p-6 rounded-2xl border border-pink-400/15" aria-labelledby="cat-heading">
          <h2 id="cat-heading" className="text-lg font-orbitron font-bold neon-text-pink mb-5">BY CATEGORY</h2>
          <BarList
            label="Spend by category"
            items={categories.map((c) => ({
              key: c.name,
              label: `${categoryMeta(c.name).icon} ${c.name}`,
              valueText: `${formatINR(c.amount)} (${Math.round(c.percent)}%)`,
              percent: c.percent,
              color: categoryMeta(c.name).color,
            }))}
          />
        </section>

        <section className="holo-card p-6 rounded-2xl border border-purple-400/15" aria-labelledby="pay-heading">
          <h2 id="pay-heading" className="text-lg font-orbitron font-bold neon-text-purple mb-5">BY PAYMENT METHOD</h2>
          <BarList
            label="Spend by payment method"
            items={methods.map((m, i) => ({
              key: m.name,
              label: m.name,
              valueText: `${formatINR(m.amount)} (${Math.round(m.percent)}%)`,
              percent: m.percent,
              color: METHOD_COLORS[i % METHOD_COLORS.length],
            }))}
          />
          {methods.some((m) => m.name === "Not specified") && (
            <p className="mt-4 font-rajdhani text-xs text-cyan-100/50">
              &ldquo;Not specified&rdquo; are expenses added in Basic mode, which does not ask for a payment method.
            </p>
          )}
        </section>
      </div>

      {/* Top expenses */}
      <section className="holo-card p-6 rounded-2xl border border-yellow-400/15" aria-labelledby="top-heading">
        <h2 id="top-heading" className="text-lg font-orbitron font-bold neon-text-yellow mb-5">TOP 5 EXPENSES</h2>
        <ol className="space-y-3">
          {topExpenses.map((e, i) => (
            <li key={e.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/30 border border-cyan-400/5">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-yellow-400/10 flex items-center justify-center font-orbitron text-xs neon-text-yellow shrink-0">{i + 1}</span>
                <div className="min-w-0">
                  <p className="font-rajdhani text-sm text-cyan-100 font-medium truncate">{e.description}</p>
                  <p className="text-[10px] font-rajdhani text-cyan-400/60">{e.category} • {formatDisplayDate(e.date)}</p>
                </div>
              </div>
              <p className="text-lg font-bungee neon-text-pink shrink-0">{formatINR(e.amount)}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
