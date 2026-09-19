/**
 * EXPENSE DOMAIN LOGIC
 * Types, constants and pure helpers shared by every page.
 * Nothing in here touches the DOM or storage, so it is easy to unit test.
 */

export interface ExpenseData {
  amount: number
  category: string
  subCategory?: string
  date: string // YYYY-MM-DD (local calendar date)
  time?: string
  description: string
  paymentMethod?: string
  tags?: string[]
  notes?: string
  isRecurring?: boolean
  recurringFrequency?: string
  location?: string
  splitWith?: string[]
}

export interface Expense extends ExpenseData {
  id: string
}

export interface Budget {
  /** Overall monthly limit in rupees. 0 means "not set". */
  monthly: number
  /** Optional per-category monthly limits. Missing / 0 means "not set". */
  categories: Record<string, number>
}

export type NeonColor = "cyan" | "pink" | "purple" | "yellow" | "green"

export interface CategoryDef {
  name: string
  icon: string
  color: NeonColor
  subCategories: string[]
}

export const CATEGORIES: CategoryDef[] = [
  { name: "Food", icon: "🍔", color: "cyan", subCategories: ["Restaurant", "Groceries", "Delivery", "Coffee", "Snacks"] },
  { name: "Transport", icon: "🚗", color: "pink", subCategories: ["Fuel", "Uber/Ola", "Metro", "Bus", "Parking"] },
  { name: "Entertainment", icon: "🎮", color: "purple", subCategories: ["Movies", "Games", "Streaming", "Events", "Sports"] },
  { name: "Shopping", icon: "🛍️", color: "yellow", subCategories: ["Clothes", "Electronics", "Home", "Gifts", "Online"] },
  { name: "Bills", icon: "💡", color: "green", subCategories: ["Electricity", "Water", "Internet", "Phone", "Rent"] },
  { name: "Health", icon: "⚕️", color: "cyan", subCategories: ["Medicine", "Doctor", "Gym", "Insurance", "Wellness"] },
  { name: "Other", icon: "📦", color: "pink", subCategories: ["Education", "Personal", "Investment", "Donation", "Misc"] },
]

export const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Net Banking"] as const

export const RECURRING_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

/** Highest amount accepted by the form; guards against typos like an extra zero run. */
export const MAX_AMOUNT = 100_000_000

export const NEON_GRADIENTS: Record<NeonColor, string> = {
  cyan: "linear-gradient(90deg, rgba(0,245,255,0.9), rgba(0,245,255,0.2))",
  pink: "linear-gradient(90deg, rgba(255,0,110,0.85), rgba(255,0,110,0.2))",
  purple: "linear-gradient(90deg, rgba(139,0,255,0.85), rgba(139,0,255,0.25))",
  yellow: "linear-gradient(90deg, rgba(255,234,0,0.85), rgba(255,234,0,0.25))",
  green: "linear-gradient(90deg, rgba(57,255,20,0.85), rgba(57,255,20,0.25))",
}

export function categoryMeta(name: string): CategoryDef {
  return CATEGORIES.find((c) => c.name === name) ?? CATEGORIES[CATEGORIES.length - 1]
}

/* ---------------------------------------------
   DATES
   Expense dates are plain YYYY-MM-DD strings that mean "the calendar day the
   user picked". They must be compared as strings / local dates, never via
   toISOString(), which converts to UTC and shifts the day for users in India
   between 00:00 and 05:30.
   --------------------------------------------- */

const pad = (n: number) => String(n).padStart(2, "0")

/** Local calendar date as YYYY-MM-DD. */
export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Local month as YYYY-MM. */
export function toMonthKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
}

export function addDays(d: Date, days: number): Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  copy.setDate(copy.getDate() + days)
  return copy
}

/** Shift a month key by `delta` months (negative = past). */
export function shiftMonth(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split("-").map(Number)
  return toMonthKey(new Date(y, m - 1 + delta, 1))
}

/** Parse YYYY-MM-DD as a local date (new Date("YYYY-MM-DD") would be UTC). */
export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function isValidDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const d = parseDateKey(value)
  return !Number.isNaN(d.getTime()) && toDateKey(d) === value
}

export function formatMonthLabel(monthKey: string): string {
  return parseDateKey(`${monthKey}-01`).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })
}

export function formatDisplayDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export function formatINR(amount: number): string {
  const rounded = Math.round(amount * 100) / 100
  return `₹${rounded.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

/* ---------------------------------------------
   FILTERING & AGGREGATION
   --------------------------------------------- */

export type DateFilter = "all" | "today" | "week" | "month" | "custom"

export function matchesDateFilter(
  expense: Expense,
  filter: DateFilter,
  range: { start: string; end: string },
  now: Date = new Date(),
): boolean {
  switch (filter) {
    case "today":
      return expense.date === toDateKey(now)
    case "week":
      return expense.date >= toDateKey(addDays(now, -6)) && expense.date <= toDateKey(now)
    case "month":
      return expense.date >= toDateKey(addDays(now, -29)) && expense.date <= toDateKey(now)
    case "custom":
      if (!range.start || !range.end) return true
      return expense.date >= range.start && expense.date <= range.end
    default:
      return true
  }
}

export function sumAmounts(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0)
}

export function expensesInMonth(expenses: Expense[], monthKey: string): Expense[] {
  return expenses.filter((e) => e.date.startsWith(monthKey))
}

export interface CategoryTotal {
  name: string
  amount: number
  count: number
  percent: number
}

/** Totals per category, largest first. Unknown categories are folded into "Other". */
export function categoryTotals(expenses: Expense[]): CategoryTotal[] {
  const map = new Map<string, { amount: number; count: number }>()
  for (const e of expenses) {
    const name = categoryMeta(e.category).name
    const entry = map.get(name) ?? { amount: 0, count: 0 }
    entry.amount += e.amount
    entry.count += 1
    map.set(name, entry)
  }
  const total = sumAmounts(expenses)
  return [...map.entries()]
    .map(([name, v]) => ({ name, ...v, percent: total > 0 ? (v.amount / total) * 100 : 0 }))
    .sort((a, b) => b.amount - a.amount)
}

export function paymentMethodTotals(expenses: Expense[]): { name: string; amount: number; count: number; percent: number }[] {
  const map = new Map<string, { amount: number; count: number }>()
  for (const e of expenses) {
    const name = e.paymentMethod ?? "Not specified"
    const entry = map.get(name) ?? { amount: 0, count: 0 }
    entry.amount += e.amount
    entry.count += 1
    map.set(name, entry)
  }
  const total = sumAmounts(expenses)
  return [...map.entries()]
    .map(([name, v]) => ({ name, ...v, percent: total > 0 ? (v.amount / total) * 100 : 0 }))
    .sort((a, b) => b.amount - a.amount)
}

/** Totals for the last `count` months, oldest first, ending with the month of `now`. */
export function monthlyTotals(expenses: Expense[], count: number, now: Date = new Date()): { month: string; amount: number }[] {
  const current = toMonthKey(now)
  const months: string[] = []
  for (let i = count - 1; i >= 0; i--) months.push(shiftMonth(current, -i))
  return months.map((month) => ({ month, amount: sumAmounts(expensesInMonth(expenses, month)) }))
}

export interface DashboardStats {
  total: number
  thisMonth: number
  lastMonth: number
  /** Percent change vs last month, or null when last month has no spend. */
  monthChange: number | null
  avgPerDay: number
  thisMonthExpenses: Expense[]
}

export function dashboardStats(expenses: Expense[], now: Date = new Date()): DashboardStats {
  const thisKey = toMonthKey(now)
  const lastKey = shiftMonth(thisKey, -1)
  const thisMonthExpenses = expensesInMonth(expenses, thisKey)
  const thisMonth = sumAmounts(thisMonthExpenses)
  const lastMonth = sumAmounts(expensesInMonth(expenses, lastKey))
  return {
    total: sumAmounts(expenses),
    thisMonth,
    lastMonth,
    monthChange: lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : null,
    avgPerDay: thisMonth / now.getDate(),
    thisMonthExpenses,
  }
}

export function recentExpenses(expenses: Expense[], limit: number): Expense[] {
  return [...expenses]
    .sort((a, b) => (a.date === b.date ? b.id.localeCompare(a.id) : b.date.localeCompare(a.date)))
    .slice(0, limit)
}

/** Spend / limit as a 0..n ratio, or null when no limit is set. */
export function budgetUsage(spent: number, limit: number): number | null {
  return limit > 0 ? spent / limit : null
}

/* ---------------------------------------------
   PARSING (data read back from localStorage or an imported file)
   --------------------------------------------- */

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined
}

function optionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  const items = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
  return items.length ? items : undefined
}

/** Returns a clean Expense, or null if the value is not a usable expense. */
export function parseExpense(value: unknown): Expense | null {
  if (typeof value !== "object" || value === null) return null
  const v = value as Record<string, unknown>
  if (typeof v.id !== "string" || !v.id) return null
  if (typeof v.amount !== "number" || !Number.isFinite(v.amount) || v.amount <= 0 || v.amount > MAX_AMOUNT) return null
  if (!isValidDateKey(v.date)) return null
  if (typeof v.description !== "string" || !v.description.trim()) return null

  return {
    id: v.id,
    amount: v.amount,
    category: categoryMeta(typeof v.category === "string" ? v.category : "Other").name,
    subCategory: optionalString(v.subCategory),
    date: v.date,
    time: optionalString(v.time),
    description: v.description,
    paymentMethod: optionalString(v.paymentMethod),
    tags: optionalStringArray(v.tags),
    notes: optionalString(v.notes),
    isRecurring: v.isRecurring === true ? true : undefined,
    recurringFrequency: optionalString(v.recurringFrequency),
    location: optionalString(v.location),
    splitWith: optionalStringArray(v.splitWith),
  }
}

export function parseExpenses(raw: string | null | undefined): Expense[] {
  if (!raw) return []
  try {
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    const seen = new Set<string>()
    const result: Expense[] = []
    for (const item of data) {
      const expense = parseExpense(item)
      if (expense && !seen.has(expense.id)) {
        seen.add(expense.id)
        result.push(expense)
      }
    }
    return result
  } catch {
    return []
  }
}

export const EMPTY_BUDGET: Budget = { monthly: 0, categories: {} }

function cleanLimit(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 && value <= MAX_AMOUNT ? value : 0
}

export function parseBudget(raw: string | null | undefined): Budget {
  if (!raw) return EMPTY_BUDGET
  try {
    const data: unknown = JSON.parse(raw)
    if (typeof data !== "object" || data === null) return EMPTY_BUDGET
    const v = data as Record<string, unknown>
    const categories: Record<string, number> = {}
    if (typeof v.categories === "object" && v.categories !== null) {
      for (const cat of CATEGORIES) {
        const limit = cleanLimit((v.categories as Record<string, unknown>)[cat.name])
        if (limit > 0) categories[cat.name] = limit
      }
    }
    return { monthly: cleanLimit(v.monthly), categories }
  } catch {
    return EMPTY_BUDGET
  }
}

/* ---------------------------------------------
   EXPORT
   --------------------------------------------- */

const CSV_HEADERS = [
  "Date", "Time", "Amount (INR)", "Category", "Sub-category", "Description",
  "Payment method", "Tags", "Location", "Shared with", "Recurring", "Notes",
]

/**
 * Escape one CSV cell. Cells starting with = + - @ are prefixed with a quote so
 * spreadsheet apps do not execute them as formulas (CSV injection).
 */
export function csvCell(value: string | number | undefined): string {
  let text = value === undefined ? "" : String(value)
  if (/^[=+\-@\t\r]/.test(text) && typeof value === "string") text = `'${text}`
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function expensesToCsv(expenses: Expense[]): string {
  const rows = expenses.map((e) =>
    [
      e.date,
      e.time,
      e.amount,
      e.category,
      e.subCategory,
      e.description,
      e.paymentMethod,
      e.tags?.join("; "),
      e.location,
      e.splitWith?.join("; "),
      e.isRecurring ? (e.recurringFrequency ?? "yes") : "",
      e.notes,
    ]
      .map(csvCell)
      .join(","),
  )
  return [CSV_HEADERS.join(","), ...rows].join("\r\n")
}
