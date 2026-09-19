import { describe, expect, it } from "vitest"
import {
  applyExpenseUpdate,
  budgetUsage,
  categoryTotals,
  csvCell,
  dashboardStats,
  expensesToCsv,
  formatINR,
  isValidDateKey,
  matchesDateFilter,
  monthlyTotals,
  parseBudget,
  parseExpense,
  parseExpenses,
  restoreExpenseAt,
  shiftMonth,
  toDateKey,
  type Expense,
} from "@/lib/expenses"

const make = (over: Partial<Expense> = {}): Expense => ({
  id: "e1",
  amount: 100,
  category: "Food",
  date: "2026-09-19",
  description: "Lunch",
  ...over,
})

describe("dates", () => {
  it("uses the local calendar day, not UTC", () => {
    // 01:00 local time. toISOString() would give the previous day in UTC+5:30.
    expect(toDateKey(new Date(2026, 8, 19, 1, 0))).toBe("2026-09-19")
  })

  it("shifts months across year boundaries", () => {
    expect(shiftMonth("2026-01", -1)).toBe("2025-12")
    expect(shiftMonth("2026-12", 1)).toBe("2027-01")
  })

  it("validates real calendar dates only", () => {
    expect(isValidDateKey("2026-02-28")).toBe(true)
    expect(isValidDateKey("2026-02-30")).toBe(false)
    expect(isValidDateKey("19-09-2026")).toBe(false)
    expect(isValidDateKey(20260919)).toBe(false)
  })
})

describe("matchesDateFilter", () => {
  const now = new Date(2026, 8, 19, 1, 0) // 19 Sep 2026, 01:00 local

  it("matches today's expenses just after midnight", () => {
    expect(matchesDateFilter(make({ date: "2026-09-19" }), "today", { start: "", end: "" }, now)).toBe(true)
    expect(matchesDateFilter(make({ date: "2026-09-18" }), "today", { start: "", end: "" }, now)).toBe(false)
  })

  it("covers the last 7 days including today", () => {
    const range = { start: "", end: "" }
    expect(matchesDateFilter(make({ date: "2026-09-13" }), "week", range, now)).toBe(true)
    expect(matchesDateFilter(make({ date: "2026-09-12" }), "week", range, now)).toBe(false)
  })

  it("applies a custom range inclusively and ignores it while incomplete", () => {
    const range = { start: "2026-09-01", end: "2026-09-10" }
    expect(matchesDateFilter(make({ date: "2026-09-10" }), "custom", range, now)).toBe(true)
    expect(matchesDateFilter(make({ date: "2026-09-11" }), "custom", range, now)).toBe(false)
    expect(matchesDateFilter(make({ date: "2020-01-01" }), "custom", { start: "2026-09-01", end: "" }, now)).toBe(true)
  })
})

describe("aggregation", () => {
  const now = new Date(2026, 8, 19)
  const data = [
    make({ id: "1", amount: 300, date: "2026-09-02" }),
    make({ id: "2", amount: 200, date: "2026-09-10", category: "Transport" }),
    make({ id: "3", amount: 400, date: "2026-08-20" }),
  ]

  it("computes dashboard stats for this and last month", () => {
    const stats = dashboardStats(data, now)
    expect(stats.total).toBe(900)
    expect(stats.thisMonth).toBe(500)
    expect(stats.lastMonth).toBe(400)
    expect(stats.monthChange).toBeCloseTo(25)
    expect(stats.avgPerDay).toBeCloseTo(500 / 19)
  })

  it("reports no month-over-month change when last month is empty", () => {
    expect(dashboardStats([make({ date: "2026-09-02" })], now).monthChange).toBeNull()
  })

  it("returns the last N months oldest first, including empty ones", () => {
    const months = monthlyTotals(data, 3, now)
    expect(months.map((m) => m.month)).toEqual(["2026-07", "2026-08", "2026-09"])
    expect(months.map((m) => m.amount)).toEqual([0, 400, 500])
  })

  it("sorts category totals by amount and folds unknown categories into Other", () => {
    const totals = categoryTotals([
      make({ id: "a", amount: 50, category: "Food" }),
      make({ id: "b", amount: 500, category: "Mystery" }),
    ])
    expect(totals[0]).toMatchObject({ name: "Other", amount: 500 })
    expect(totals[1]).toMatchObject({ name: "Food", amount: 50 })
    expect(totals[0].percent + totals[1].percent).toBeCloseTo(100)
  })

  it("computes budget usage only when a limit exists", () => {
    expect(budgetUsage(500, 1000)).toBe(0.5)
    expect(budgetUsage(1500, 1000)).toBe(1.5)
    expect(budgetUsage(500, 0)).toBeNull()
  })
})

describe("parsing saved data", () => {
  it("accepts a valid expense and normalises optional fields", () => {
    const e = parseExpense({ id: "x", amount: 12.5, category: "Food", date: "2026-09-19", description: "Tea", tags: ["a", "", 3] })
    expect(e).toMatchObject({ id: "x", amount: 12.5, tags: ["a"] })
  })

  it.each([
    ["missing id", { amount: 1, date: "2026-09-19", description: "x" }],
    ["zero amount", { id: "x", amount: 0, date: "2026-09-19", description: "x" }],
    ["negative amount", { id: "x", amount: -5, date: "2026-09-19", description: "x" }],
    ["string amount", { id: "x", amount: "5", date: "2026-09-19", description: "x" }],
    ["huge amount", { id: "x", amount: 1e12, date: "2026-09-19", description: "x" }],
    ["bad date", { id: "x", amount: 5, date: "2026-13-40", description: "x" }],
    ["blank description", { id: "x", amount: 5, date: "2026-09-19", description: "  " }],
  ])("rejects %s", (_name, value) => {
    expect(parseExpense(value)).toBeNull()
  })

  it("survives corrupt JSON and drops duplicates and junk", () => {
    expect(parseExpenses("{not json")).toEqual([])
    expect(parseExpenses('{"a":1}')).toEqual([])
    expect(parseExpenses(null)).toEqual([])
    const raw = JSON.stringify([make({ id: "1" }), make({ id: "1" }), { nope: true }, make({ id: "2" })])
    expect(parseExpenses(raw).map((e) => e.id)).toEqual(["1", "2"])
  })

  it("cleans budgets", () => {
    const budget = parseBudget(JSON.stringify({ monthly: 5000, categories: { Food: 1000, Bogus: 5, Bills: -3 } }))
    expect(budget).toEqual({ monthly: 5000, categories: { Food: 1000 } })
    expect(parseBudget("garbage")).toEqual({ monthly: 0, categories: {} })
  })
})

describe("CSV export", () => {
  it("quotes cells that contain commas, quotes or newlines", () => {
    expect(csvCell('a,"b"')).toBe('"a,""b"""')
    expect(csvCell("line1\nline2")).toBe('"line1\nline2"')
  })

  it("neutralises spreadsheet formulas", () => {
    expect(csvCell("=SUM(A1:A9)")).toBe("'=SUM(A1:A9)")
    expect(csvCell("@cmd")).toBe("'@cmd")
    expect(csvCell("+1")).toBe("'+1")
  })

  it("writes a header and one row per expense", () => {
    const lines = expensesToCsv([make({ description: "Tea, biscuits" })]).split("\r\n")
    expect(lines).toHaveLength(2)
    expect(lines[0]).toContain("Amount (INR)")
    expect(lines[1]).toContain('"Tea, biscuits"')
  })
})

describe("formatINR", () => {
  it("uses Indian digit grouping and only shows paise when needed", () => {
    expect(formatINR(1234567)).toBe("₹12,34,567")
    expect(formatINR(99.5)).toBe("₹99.50")
    expect(formatINR(0)).toBe("₹0")
  })
})

describe("editing and undoing", () => {
  const list = [make({ id: "a", amount: 1 }), make({ id: "b", amount: 2 }), make({ id: "c", amount: 3 })]
  const data = { amount: 99, category: "Bills", date: "2026-09-01", description: "Edited" }

  it("replaces an expense in place, keeping its id and position", () => {
    const result = applyExpenseUpdate(list, "b", data)
    expect(result.map((e) => e.id)).toEqual(["a", "b", "c"])
    expect(result[1]).toEqual({ ...data, id: "b" })
    expect(result[0]).toBe(list[0]) // untouched items are not copied
  })

  it("drops fields that were cleared in the edit (no stale tags or notes)", () => {
    const rich = [make({ id: "a", tags: ["x"], notes: "old", location: "Mall" })]
    const result = applyExpenseUpdate(rich, "a", data)
    expect(result[0].tags).toBeUndefined()
    expect(result[0].notes).toBeUndefined()
    expect(result[0].location).toBeUndefined()
  })

  it("keeps the edit when the expense was deleted meanwhile, instead of losing it", () => {
    const result = applyExpenseUpdate(list, "gone", data)
    expect(result).toHaveLength(4)
    expect(result[0]).toEqual({ ...data, id: "gone" })
  })

  it("does not mutate the original list", () => {
    const before = JSON.stringify(list)
    applyExpenseUpdate(list, "a", data)
    restoreExpenseAt(list, make({ id: "z" }), 1)
    expect(JSON.stringify(list)).toBe(before)
  })

  it("restores a deleted expense at its old position", () => {
    const removed = list[1]
    const after = list.filter((e) => e.id !== "b")
    expect(restoreExpenseAt(after, removed, 1).map((e) => e.id)).toEqual(["a", "b", "c"])
  })

  it("clamps out-of-range positions and never duplicates", () => {
    const extra = make({ id: "z" })
    expect(restoreExpenseAt(list, extra, 99).map((e) => e.id)).toEqual(["a", "b", "c", "z"])
    expect(restoreExpenseAt(list, extra, -5).map((e) => e.id)).toEqual(["z", "a", "b", "c"])
    expect(restoreExpenseAt(list, list[0], 0)).toBe(list) // already there: unchanged
  })
})
