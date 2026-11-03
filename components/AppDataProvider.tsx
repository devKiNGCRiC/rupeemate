/**
 * APP DATA PROVIDER
 * Single source of truth for expenses and budgets, persisted in localStorage.
 * All pages read from here, so the dashboard, analytics and budget always agree
 * with the expenses list.
 */

"use client"

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react"
import { createLocalStore } from "@/lib/local-store"
import {
  applyExpenseUpdate,
  parseBudget,
  parseExpenses,
  restoreExpenseAt,
  type Budget,
  type Expense,
  type ExpenseData,
} from "@/lib/expenses"

const expenseStore = createLocalStore("rupeemate_expenses_v1")
const budgetStore = createLocalStore("rupeemate_budget_v1")

// undefined = server render / hydration (storage not readable yet)
const readExpenses = (): string | null | undefined => expenseStore.getSnapshot()
const readBudget = (): string | null | undefined => budgetStore.getSnapshot()
const readServer = (): string | null | undefined => undefined

interface AppData {
  /** False until the browser's saved data has been read. */
  ready: boolean
  expenses: Expense[]
  budget: Budget
  /** Each write returns false when the browser blocked saving (data is kept for this session only). */
  addExpense: (data: ExpenseData) => boolean
  /** Replace an existing expense, keeping its id and position. */
  updateExpense: (id: string, data: ExpenseData) => boolean
  deleteExpense: (id: string) => boolean
  /** Undo a delete: put the expense back where it was. */
  restoreExpense: (expense: Expense, index: number) => boolean
  importExpenses: (incoming: Expense[]) => { added: number; skipped: number; saved: boolean }
  clearExpenses: () => boolean
  saveBudget: (budget: Budget) => boolean
  clearBudget: () => boolean
}

const AppDataContext = createContext<AppData | null>(null)

function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `exp_${crypto.randomUUID()}`
  }
  return `exp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function currentExpenses(): Expense[] {
  return parseExpenses(expenseStore.getSnapshot())
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const rawExpenses = useSyncExternalStore(expenseStore.subscribe, readExpenses, readServer)
  const rawBudget = useSyncExternalStore(budgetStore.subscribe, readBudget, readServer)

  const expenses = useMemo(() => parseExpenses(rawExpenses), [rawExpenses])
  const budget = useMemo(() => parseBudget(rawBudget), [rawBudget])

  const addExpense = useCallback((data: ExpenseData) => {
    const expense: Expense = { ...data, id: newId() }
    return expenseStore.set(JSON.stringify([expense, ...currentExpenses()]))
  }, [])

  const updateExpense = useCallback((id: string, data: ExpenseData) => {
    return expenseStore.set(JSON.stringify(applyExpenseUpdate(currentExpenses(), id, data)))
  }, [])

  const restoreExpense = useCallback((expense: Expense, index: number) => {
    return expenseStore.set(JSON.stringify(restoreExpenseAt(currentExpenses(), expense, index)))
  }, [])

  const deleteExpense = useCallback((id: string) => {
    return expenseStore.set(JSON.stringify(currentExpenses().filter((e) => e.id !== id)))
  }, [])

  const importExpenses = useCallback((incoming: Expense[]) => {
    const existing = currentExpenses()
    const known = new Set(existing.map((e) => e.id))
    const fresh = incoming.filter((e) => !known.has(e.id))
    const saved = fresh.length === 0 ? true : expenseStore.set(JSON.stringify([...fresh, ...existing]))
    return { added: fresh.length, skipped: incoming.length - fresh.length, saved }
  }, [])

  const clearExpenses = useCallback(() => expenseStore.set(null), [])
  const saveBudget = useCallback((next: Budget) => budgetStore.set(JSON.stringify(next)), [])
  const clearBudget = useCallback(() => budgetStore.set(null), [])

  const value = useMemo<AppData>(
    () => ({
      ready: rawExpenses !== undefined,
      expenses,
      budget,
      addExpense,
      updateExpense,
      deleteExpense,
      restoreExpense,
      importExpenses,
      clearExpenses,
      saveBudget,
      clearBudget,
    }),
    [rawExpenses, expenses, budget, addExpense, updateExpense, deleteExpense, restoreExpense, importExpenses, clearExpenses, saveBudget, clearBudget],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error("useAppData must be used inside <AppDataProvider>")
  return ctx
}
