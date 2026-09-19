/**
 * CATEGORIES PAGE
 * Every category with its total, share and sub-category breakdown.
 */

"use client"

import { useAppData } from "@/components/AppDataProvider"
import PageShell from "@/components/PageShell"
import EmptyState from "@/components/EmptyState"
import {
  CATEGORIES,
  NEON_GRADIENTS,
  categoryMeta,
  formatINR,
  sumAmounts,
} from "@/lib/expenses"

export default function CategoriesPage() {
  const { ready, expenses } = useAppData()

  const total = sumAmounts(expenses)

  return (
    <PageShell title="CATEGORIES" subtitle="Your spending grouped by category and sub-category">
      {!ready ? (
        <p className="text-center font-rajdhani text-cyan-100/50 py-12" role="status">Loading your categories…</p>
      ) : expenses.length === 0 ? (
        <EmptyState
          emoji="🏷️"
          title="NO CATEGORIES YET"
          message="Add expenses and each category will show how much you spent and on what."
        />
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const inCategory = expenses.filter((e) => categoryMeta(e.category).name === cat.name)
            const amount = sumAmounts(inCategory)
            const percent = total > 0 ? (amount / total) * 100 : 0

            // Sub-category totals; expenses without one are grouped as "No sub-category"
            const subMap = new Map<string, number>()
            for (const e of inCategory) {
              const key = e.subCategory ?? "No sub-category"
              subMap.set(key, (subMap.get(key) ?? 0) + e.amount)
            }
            const subs = [...subMap.entries()].sort((a, b) => b[1] - a[1])

            return (
              <li key={cat.name} className="holo-card p-5 rounded-2xl border border-cyan-400/15">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-11 h-11 rounded-xl bg-cyan-400/10 flex items-center justify-center text-2xl shrink-0" aria-hidden="true">{cat.icon}</span>
                    <div className="min-w-0">
                      <h2 className="font-orbitron text-sm font-bold neon-text-cyan uppercase tracking-wider">{cat.name}</h2>
                      <p className="font-rajdhani text-xs text-cyan-100/60">
                        {inCategory.length} {inCategory.length === 1 ? "expense" : "expenses"}
                      </p>
                    </div>
                  </div>
                  <p className="font-bungee text-lg neon-text-pink shrink-0">{formatINR(amount)}</p>
                </div>

                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden mb-1" aria-hidden="true">
                  <div className="h-full rounded-full" style={{ width: `${percent}%`, background: NEON_GRADIENTS[cat.color] }} />
                </div>
                <p className="font-rajdhani text-xs text-cyan-100/50 mb-4">{Math.round(percent)}% of all spending</p>

                {subs.length > 0 ? (
                  <ul className="space-y-1.5">
                    {subs.map(([name, value]) => (
                      <li key={name} className="flex items-center justify-between font-rajdhani text-sm">
                        <span className="text-cyan-100/80">{name}</span>
                        <span className="text-cyan-100/60">{formatINR(value)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-rajdhani text-sm text-cyan-100/40">Nothing spent here yet.</p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </PageShell>
  )
}
