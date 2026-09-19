/**
 * BUDGET PAGE
 * Set a monthly limit (overall and per category) and track this month's spend
 * against it. Limits are saved in this browser next to your expenses.
 */

"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle2, Save, Trash2 } from "lucide-react"
import { useAppData } from "@/components/AppDataProvider"
import PageShell from "@/components/PageShell"
import Toast, { type ToastType } from "@/components/Toast"
import {
  CATEGORIES,
  MAX_AMOUNT,
  NEON_GRADIENTS,
  budgetUsage,
  categoryTotals,
  dashboardStats,
  formatINR,
  type Budget,
} from "@/lib/expenses"

export default function BudgetPage() {
  const { ready } = useAppData()

  return (
    <PageShell title="BUDGET" subtitle="Set monthly limits and see how you are tracking this month">
      {ready ? (
        <BudgetContent />
      ) : (
        <p className="text-center font-rajdhani text-cyan-100/50 py-12" role="status">Loading your budget…</p>
      )}
    </PageShell>
  )
}

function usageTone(usage: number) {
  if (usage > 1) return { text: "text-red-400", label: "Over budget" }
  if (usage >= 0.8) return { text: "text-yellow-300", label: "Close to the limit" }
  return { text: "text-green-400", label: "On track" }
}

function BudgetContent() {
  const { expenses, budget, saveBudget, clearBudget } = useAppData()

  const thisMonth = dashboardStats(expenses)
  const spentByCategory = new Map(categoryTotals(thisMonth.thisMonthExpenses).map((c) => [c.name, c.amount]))

  // Form fields start from the saved budget (this component only mounts once data is loaded)
  const [monthly, setMonthly] = useState(budget.monthly ? String(budget.monthly) : "")
  const [limits, setLimits] = useState<Record<string, string>>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.name, budget.categories[c.name] ? String(budget.categories[c.name]) : ""])),
  )
  const [error, setError] = useState("")
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const parseLimit = (text: string): number | null => {
    if (!text.trim()) return 0
    const n = Number(text)
    if (!Number.isFinite(n) || n < 0 || n > MAX_AMOUNT) return null
    return Math.round(n * 100) / 100
  }

  const onlyNumber = (value: string) => value === "" || /^\d*\.?\d{0,2}$/.test(value)

  const handleSave = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const monthlyValue = parseLimit(monthly)
    if (monthlyValue === null) {
      setError("Monthly budget must be a valid amount")
      return
    }
    const categories: Record<string, number> = {}
    for (const cat of CATEGORIES) {
      const value = parseLimit(limits[cat.name])
      if (value === null) {
        setError(`${cat.name} limit must be a valid amount`)
        return
      }
      if (value > 0) categories[cat.name] = value
    }
    setError("")
    const next: Budget = { monthly: monthlyValue, categories }
    const saved = saveBudget(next)
    setToast(
      saved
        ? { message: "Budget saved", type: "success" }
        : { message: "Saved for this session only. Your browser blocked storage.", type: "error" },
    )
  }

  const handleClear = () => {
    clearBudget()
    setMonthly("")
    setLimits(Object.fromEntries(CATEGORIES.map((c) => [c.name, ""])))
    setError("")
    setToast({ message: "Budget cleared", type: "info" })
  }

  const overall = budgetUsage(thisMonth.thisMonth, budget.monthly)
  const limitedCategories = CATEGORIES.filter((c) => (budget.categories[c.name] ?? 0) > 0)
  const categorySum = Object.values(budget.categories).reduce((a, b) => a + b, 0)

  const inputClass =
    "w-full px-4 py-3 min-h-12 rounded-xl bg-black/40 border border-cyan-400/20 text-white font-rajdhani placeholder:text-cyan-100/30 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress */}
        <section className="holo-card p-6 rounded-2xl border border-green-400/20" aria-labelledby="progress-heading">
          <h2 id="progress-heading" className="text-lg font-orbitron font-bold text-green-400 mb-5">THIS MONTH</h2>

          {overall === null && limitedCategories.length === 0 ? (
            <p className="font-rajdhani text-cyan-100/70 leading-relaxed">
              You have not set a budget yet. Enter a monthly limit (and optionally limits per category) and your progress will show up here.
              So far this month you have spent <span className="neon-text-cyan font-semibold">{formatINR(thisMonth.thisMonth)}</span>.
            </p>
          ) : (
            <div className="space-y-6">
              {overall !== null && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-orbitron text-xs uppercase tracking-wider text-cyan-100/80">Overall</span>
                    <span className={`flex items-center gap-1.5 font-rajdhani text-sm ${usageTone(overall).text}`}>
                      {overall > 1 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      {usageTone(overall).label}
                    </span>
                  </div>
                  <div
                    className="h-3 rounded-full bg-black/40 overflow-hidden"
                    role="progressbar"
                    aria-label="Overall budget used"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.min(100, Math.round(overall * 100))}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, overall * 100)}%`,
                        background: overall > 1 ? "linear-gradient(90deg, #ff0040, #ff006e)" : NEON_GRADIENTS.green,
                      }}
                    />
                  </div>
                  <p className="mt-2 font-rajdhani text-sm text-cyan-100/70">
                    {formatINR(thisMonth.thisMonth)} of {formatINR(budget.monthly)} ({Math.round(overall * 100)}%)
                    {overall > 1
                      ? ` · over by ${formatINR(thisMonth.thisMonth - budget.monthly)}`
                      : ` · ${formatINR(budget.monthly - thisMonth.thisMonth)} left`}
                  </p>
                </div>
              )}

              {limitedCategories.map((cat) => {
                const limit = budget.categories[cat.name]
                const spent = spentByCategory.get(cat.name) ?? 0
                const usage = spent / limit
                const tone = usageTone(usage)
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-rajdhani text-sm text-cyan-100 font-medium">{cat.icon} {cat.name}</span>
                      <span className={`font-rajdhani text-xs ${tone.text}`}>{tone.label}</span>
                    </div>
                    <div
                      className="h-1.5 rounded-full bg-black/40 overflow-hidden"
                      role="progressbar"
                      aria-label={`${cat.name} budget used`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.min(100, Math.round(usage * 100))}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, usage * 100)}%`,
                          background: usage > 1 ? "linear-gradient(90deg, #ff0040, #ff006e)" : NEON_GRADIENTS[cat.color],
                        }}
                      />
                    </div>
                    <p className="mt-1 font-rajdhani text-xs text-cyan-100/60">
                      {formatINR(spent)} of {formatINR(limit)}
                      {usage > 1 ? ` · over by ${formatINR(spent - limit)}` : ""}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Editor */}
        <section className="holo-card p-6 rounded-2xl border border-cyan-400/20" aria-labelledby="edit-heading">
          <h2 id="edit-heading" className="text-lg font-orbitron font-bold neon-text-cyan mb-5">SET LIMITS</h2>

          <form onSubmit={handleSave} className="space-y-5" noValidate>
            {error && (
              <div role="alert" className="p-3 rounded-xl bg-pink-500/10 border border-pink-400/30 font-rajdhani text-sm text-pink-200">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="budget-monthly" className="block mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-cyan">
                Monthly budget (₹)
              </label>
              <input
                id="budget-monthly"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={monthly}
                onChange={(e) => {
                  if (onlyNumber(e.target.value)) setMonthly(e.target.value)
                }}
                placeholder="e.g. 20000"
                className={inputClass}
              />
            </div>

            <fieldset>
              <legend className="mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-purple">
                Category limits (optional)
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <div key={cat.name}>
                    <label htmlFor={`budget-${cat.name}`} className="block mb-1 font-rajdhani text-xs text-cyan-100/70">
                      {cat.icon} {cat.name}
                    </label>
                    <input
                      id={`budget-${cat.name}`}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={limits[cat.name]}
                      onChange={(e) => {
                        const value = e.target.value
                        if (onlyNumber(value)) setLimits((prev) => ({ ...prev, [cat.name]: value }))
                      }}
                      placeholder="No limit"
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </fieldset>

            {budget.monthly > 0 && categorySum > budget.monthly && (
              <p className="font-rajdhani text-xs text-yellow-300">
                Your category limits add up to {formatINR(categorySum)}, which is more than your monthly budget of {formatINR(budget.monthly)}.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-orbitron text-sm tracking-wider bg-linear-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-400/40 hover:border-cyan-400/70 text-cyan-100 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                SAVE BUDGET
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={budget.monthly === 0 && limitedCategories.length === 0}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-orbitron text-sm tracking-wider bg-black/40 border border-pink-400/30 text-pink-200 hover:border-pink-400/60 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                CLEAR
              </button>
            </div>
          </form>
        </section>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
