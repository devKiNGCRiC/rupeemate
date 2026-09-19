/**
 * ⚡ CYBERPUNK EXPENSE TRACKER PAGE
 * 
 * URL: http://localhost:3000/expenses
 * 
 * FEATURES:
 * - Basic/Advanced form modes
 * - Welcome popup for advanced mode promotion
 * - Expense list with detailed info
 */

"use client"

import { useState, useEffect, useMemo } from "react"
import ExpenseForm, { ExpenseData } from "@/components/ExpenseForm"
import AdvancedModePopup from "@/components/AdvancedModePopup"
import Toast, { ToastType } from "@/components/Toast"
import Breadcrumb from "@/components/Breadcrumb"
import { 
  Trash2, Calendar, TrendingUp, Zap, MapPin, Tag, CreditCard, Users, Repeat,
  Search, X, SlidersHorizontal, ArrowUpDown
} from "lucide-react"

interface Expense {
  id: string
  amount: number
  category: string
  subCategory?: string
  date: string
  time?: string
  description: string
  paymentMethod?: string
  tags?: string[]
  notes?: string
  isRecurring?: boolean
  recurringFrequency?: string
  location?: string
  splitWith?: string[]
  receiptUrl?: string
}

interface ToastState {
  show: boolean
  message: string
  type: ToastType
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [formMode, setFormMode] = useState<"basic" | "advanced">("basic")
  const [showPopup, setShowPopup] = useState(false)
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" })
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "custom">("all")
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" })
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc")

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type })
  }

  // Check if user has seen the popup before
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("rupeemate_seen_advanced_popup")
    if (!hasSeenPopup) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setShowPopup(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClosePopup = () => {
    setShowPopup(false)
    localStorage.setItem("rupeemate_seen_advanced_popup", "true")
  }

  const handleTryAdvanced = () => {
    setFormMode("advanced")
    handleClosePopup()
  }

  const handleModeChange = (mode: "basic" | "advanced") => {
    setFormMode(mode)
  }

  const handleAddExpense = (newExpense: ExpenseData) => {
    const expense: Expense = {
      ...newExpense,
      id: `exp_${Date.now()}`,
    }
    setExpenses([expense, ...expenses])
    showToast("✨ Expense added successfully!", "success")
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id))
    showToast("🗑️ Expense deleted", "info")
  }

  // Filter and search logic
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = [...expenses]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(exp =>
        exp.description.toLowerCase().includes(query) ||
        exp.category.toLowerCase().includes(query) ||
        exp.subCategory?.toLowerCase().includes(query) ||
        exp.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        exp.location?.toLowerCase().includes(query) ||
        exp.notes?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(exp => selectedCategories.includes(exp.category))
    }

    // Payment method filter
    if (selectedPaymentMethods.length > 0) {
      filtered = filtered.filter(exp => 
        exp.paymentMethod && selectedPaymentMethods.includes(exp.paymentMethod)
      )
    }

    // Date filter
    const now = new Date()
    if (dateFilter === "today") {
      const today = now.toISOString().split('T')[0]
      filtered = filtered.filter(exp => exp.date === today)
    } else if (dateFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(exp => new Date(exp.date) >= weekAgo)
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(exp => new Date(exp.date) >= monthAgo)
    } else if (dateFilter === "custom" && customDateRange.start && customDateRange.end) {
      filtered = filtered.filter(exp => 
        exp.date >= customDateRange.start && exp.date <= customDateRange.end
      )
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "amount-desc":
          return b.amount - a.amount
        case "amount-asc":
          return a.amount - b.amount
        default:
          return 0
      }
    })

    return filtered
  }, [expenses, searchQuery, selectedCategories, selectedPaymentMethods, dateFilter, customDateRange, sortBy])

  const totalAmount = filteredAndSortedExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedPaymentMethods([])
    setDateFilter("all")
    setCustomDateRange({ start: "", end: "" })
    setSortBy("date-desc")
  }

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || 
    selectedPaymentMethods.length > 0 || dateFilter !== "all"

  // Category emoji mapping
  const categoryEmojis: { [key: string]: string } = {
    Food: "🍔",
    Transport: "🚗",
    Entertainment: "🎮",
    Shopping: "🛍️",
    Bills: "💡",
    Health: "⚕️",
    Other: "📦",
  }

  return (
    <div className="relative overflow-hidden min-h-full">
      {/* Advanced Mode Popup */}
      <AdvancedModePopup 
        isOpen={showPopup} 
        onClose={handleClosePopup}
        onTryAdvanced={handleTryAdvanced}
      />

      {/* ========================================
          🎮 SIMPLIFIED BACKGROUND (Performance Optimized)
          ======================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        <div className="aurora-layer"></div>
      </div>

      {/* ========================================
          🌟 MAIN CONTENT
          ======================================== */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb />
        
        {/* Page Header */}
        <div className="mb-8 sm:mb-10 md:mb-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-4">
                <Zap className="w-3.5 h-3.5 neon-text-cyan" />
                <span className="text-xs font-orbitron font-semibold neon-text-cyan tracking-wider">
                  EXPENSE MANAGER
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bungee holographic tracking-wider leading-tight">
                EXPENSES
              </h1>
              <p className="mt-2 text-base font-rajdhani text-cyan-100/70">
                Track your spending and see where your money goes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-cyan-400/20">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-xs font-rajdhani text-cyan-100/60">Auto-sync enabled</span>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-linear-to-r from-cyan-400/30 via-pink-400/20 to-transparent"></div>
        </div>

        {/* ========================================
            📝 EXPENSE FORM
            ======================================== */}
        <div className="max-w-2xl mx-auto mb-12 md:mb-16">
          <ExpenseForm 
            onAddExpense={handleAddExpense} 
            mode={formMode}
            onModeChange={handleModeChange}
          />
        </div>

        {/* ========================================
            💰 TOTAL AMOUNT CARD
            ======================================== */}
        {expenses.length > 0 && (
          <>
            {/* Search Bar & Filters */}
            <div className="max-w-4xl mx-auto mb-6 space-y-4">
              {/* Search & Filter Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Search className="w-4 h-4 neon-text-cyan" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search expenses..."
                    className="w-full pl-12 pr-4 py-3.5 min-h-12 rounded-xl bg-black/40 border border-cyan-400/20 text-white font-rajdhani placeholder:text-cyan-100/30 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-pink-400/10 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 neon-text-pink" />
                    </button>
                  )}
                </div>

                {/* Filter Toggle Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`
                    flex items-center gap-2 px-5 py-3.5 min-h-12 rounded-xl font-rajdhani font-semibold
                    transition-all duration-300 cursor-pointer whitespace-nowrap
                    ${showFilters 
                      ? 'bg-purple-400/20 border-2 border-purple-400/50 neon-text-purple' 
                      : 'bg-black/40 border border-purple-400/20 text-purple-200 hover:border-purple-400/40'
                    }
                  `}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="px-1.5 py-0.5 rounded-full bg-pink-400/80 text-[10px] font-bold text-black">
                      {[selectedCategories.length, selectedPaymentMethods.length, dateFilter !== "all" ? 1 : 0, searchQuery ? 1 : 0].filter(Boolean).reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "date-desc" | "date-asc" | "amount-desc" | "amount-asc")}
                    className="appearance-none w-full sm:w-auto pl-4 pr-10 py-3.5 min-h-12 rounded-xl bg-black/40 border border-cyan-400/20 text-white font-rajdhani cursor-pointer focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="amount-desc">Highest Amount</option>
                    <option value="amount-asc">Lowest Amount</option>
                  </select>
                  <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 neon-text-cyan pointer-events-none" />
                </div>
              </div>

              {/* Quick Filter Chips */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setDateFilter("all")}
                  className={`
                    px-3 py-1.5 rounded-lg font-rajdhani text-xs font-medium transition-all duration-300 cursor-pointer
                    ${dateFilter === "all" 
                      ? 'bg-cyan-400/20 border border-cyan-400/50 neon-text-cyan' 
                      : 'bg-black/30 border border-cyan-400/10 text-cyan-100/60 hover:border-cyan-400/30'
                    }
                  `}
                >
                  All Time
                </button>
                <button
                  onClick={() => setDateFilter("today")}
                  className={`
                    px-3 py-1.5 rounded-lg font-rajdhani text-xs font-medium transition-all duration-300 cursor-pointer
                    ${dateFilter === "today" 
                      ? 'bg-cyan-400/20 border border-cyan-400/50 neon-text-cyan' 
                      : 'bg-black/30 border border-cyan-400/10 text-cyan-100/60 hover:border-cyan-400/30'
                    }
                  `}
                >
                  Today
                </button>
                <button
                  onClick={() => setDateFilter("week")}
                  className={`
                    px-3 py-1.5 rounded-lg font-rajdhani text-xs font-medium transition-all duration-300 cursor-pointer
                    ${dateFilter === "week" 
                      ? 'bg-cyan-400/20 border border-cyan-400/50 neon-text-cyan' 
                      : 'bg-black/30 border border-cyan-400/10 text-cyan-100/60 hover:border-cyan-400/30'
                    }
                  `}
                >
                  This Week
                </button>
                <button
                  onClick={() => setDateFilter("month")}
                  className={`
                    px-3 py-1.5 rounded-lg font-rajdhani text-xs font-medium transition-all duration-300 cursor-pointer
                    ${dateFilter === "month" 
                      ? 'bg-cyan-400/20 border border-cyan-400/50 neon-text-cyan' 
                      : 'bg-black/30 border border-cyan-400/10 text-cyan-100/60 hover:border-cyan-400/30'
                    }
                  `}
                >
                  This Month
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-1.5 rounded-lg font-rajdhani text-xs font-medium bg-pink-400/10 border border-pink-400/30 neon-text-pink hover:bg-pink-400/20 transition-all duration-300 cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear All
                  </button>
                )}
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="holo-card p-5 rounded-xl border border-purple-400/20 animate-fade-in-up">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Filters */}
                    <div>
                      <h4 className="text-sm font-orbitron font-bold neon-text-purple mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        CATEGORIES
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {["Food", "Transport", "Entertainment", "Shopping", "Bills", "Health", "Other"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategories(prev =>
                                prev.includes(cat)
                                  ? prev.filter(c => c !== cat)
                                  : [...prev, cat]
                              )
                            }}
                            className={`
                              px-3 py-1.5 rounded-lg font-rajdhani text-xs font-medium transition-all duration-300 cursor-pointer
                              ${selectedCategories.includes(cat)
                                ? 'bg-pink-400/20 border border-pink-400/50 neon-text-pink'
                                : 'bg-black/30 border border-cyan-400/10 text-cyan-100/60 hover:border-cyan-400/30'
                              }
                            `}
                          >
                            {categoryEmojis[cat]} {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payment Method Filters */}
                    <div>
                      <h4 className="text-sm font-orbitron font-bold neon-text-purple mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        PAYMENT METHODS
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {["Cash", "UPI", "Card", "Net Banking"].map((method) => (
                          <button
                            key={method}
                            onClick={() => {
                              setSelectedPaymentMethods(prev =>
                                prev.includes(method)
                                  ? prev.filter(m => m !== method)
                                  : [...prev, method]
                              )
                            }}
                            className={`
                              px-3 py-1.5 rounded-lg font-rajdhani text-xs font-medium transition-all duration-300 cursor-pointer
                              ${selectedPaymentMethods.includes(method)
                                ? 'bg-pink-400/20 border border-pink-400/50 neon-text-pink'
                                : 'bg-black/30 border border-cyan-400/10 text-cyan-100/60 hover:border-cyan-400/30'
                              }
                            `}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Date Range */}
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-orbitron font-bold neon-text-purple mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        CUSTOM DATE RANGE
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-rajdhani text-cyan-100/60 mb-1">From</label>
                          <input
                            type="date"
                            value={customDateRange.start}
                            onChange={(e) => {
                              setCustomDateRange(prev => ({ ...prev, start: e.target.value }))
                              if (e.target.value && customDateRange.end) {
                                setDateFilter("custom")
                              }
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-cyan-400/20 text-white font-rajdhani text-sm focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-rajdhani text-cyan-100/60 mb-1">To</label>
                          <input
                            type="date"
                            value={customDateRange.end}
                            onChange={(e) => {
                              setCustomDateRange(prev => ({ ...prev, end: e.target.value }))
                              if (e.target.value && customDateRange.start) {
                                setDateFilter("custom")
                              }
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-cyan-400/20 text-white font-rajdhani text-sm focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total Amount Card */}
            <div className="max-w-4xl mx-auto mb-10">
              <div className="holo-card p-6 md:p-8 rounded-2xl border border-purple-400/20 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 neon-text-purple" />
                    </div>
                    <div>
                      <p className="text-xs font-orbitron text-purple-300/80 uppercase tracking-[0.3em] mb-1">
                        {hasActiveFilters ? "FILTERED SPEND" : "TOTAL SPEND"}
                      </p>
                      <p className="text-3xl md:text-4xl font-bungee neon-text-purple">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-rajdhani text-cyan-100/70">
                        {filteredAndSortedExpenses.length} {filteredAndSortedExpenses.length === 1 ? "transaction" : "transactions"}
                      </p>
                      {hasActiveFilters && expenses.length !== filteredAndSortedExpenses.length && (
                        <p className="text-xs font-rajdhani text-cyan-100/50">
                          of {expenses.length} total
                        </p>
                      )}
                    </div>
                    <div className="w-px h-8 bg-cyan-400/20 hidden sm:block"></div>
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-400/10 border border-pink-400/20 text-sm font-rajdhani neon-text-pink hover:bg-pink-400/20 transition-colors cursor-pointer">
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================
            📋 EXPENSE LIST
            ======================================== */}
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-12 sm:py-16 animate-fade-in-up">
            <div className="holo-card p-8 sm:p-10 rounded-3xl border border-cyan-400/20">
              <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-cyan-400/10 to-pink-400/10 flex items-center justify-center animate-float-slow">
                <span className="text-3xl sm:text-4xl">
                  {expenses.length === 0 ? "💸" : "🔍"}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-orbitron font-bold neon-text-cyan mb-2 sm:mb-3 tracking-wider">
                {expenses.length === 0 ? "NO EXPENSES YET" : "NO RESULTS FOUND"}
              </h3>
              <p className="font-rajdhani text-cyan-100/70 text-sm sm:text-base mb-6 px-4 leading-relaxed">
                {expenses.length === 0 
                  ? "Add your first expense above to start tracking where your money goes."
                  : "No expenses match your search or filter criteria. Try adjusting your filters."
                }
              </p>
              {expenses.length === 0 ? (
                <>
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center gap-3 text-left p-3 rounded-xl bg-black/30 border border-cyan-400/10">
                      <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 neon-text-cyan" />
                      </div>
                      <p className="font-rajdhani text-xs text-cyan-100/60">
                        Quick entry mode for fast tracking
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-left p-3 rounded-xl bg-black/30 border border-pink-400/10">
                      <div className="w-8 h-8 rounded-lg bg-pink-400/10 flex items-center justify-center shrink-0">
                        <Tag className="w-4 h-4 neon-text-pink" />
                      </div>
                      <p className="font-rajdhani text-xs text-cyan-100/60">
                        Advanced mode for detailed insights
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs font-rajdhani text-cyan-100/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    Your data stays private and secure
                  </div>
                </>
              ) : (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-400/10 border border-pink-400/30 text-sm font-rajdhani font-semibold neon-text-pink hover:bg-pink-400/20 transition-all duration-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredAndSortedExpenses.map((expense, index) => (
              <div
                key={expense.id}
                className="group holo-card p-5 rounded-2xl relative overflow-hidden border border-cyan-400/10 hover:border-cyan-400/30 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'backwards' }}
              >
                {/* Gradient accent bar */}
                <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-cyan-400 via-pink-400 to-purple-400 rounded-l-2xl opacity-60 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 ml-4">
                  {/* Left: Category Icon & Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">{categoryEmojis[expense.category] || "📦"}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-cyan-400/10 text-[10px] font-orbitron font-bold neon-text-cyan uppercase tracking-wider">
                          {expense.category}
                        </span>
                        {expense.subCategory && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-400/10 text-[10px] font-rajdhani text-purple-300">
                            {expense.subCategory}
                          </span>
                        )}
                        {expense.isRecurring && (
                          <span className="px-2 py-0.5 rounded-md bg-yellow-400/10 text-[10px] font-rajdhani text-yellow-300 flex items-center gap-1">
                            <Repeat className="w-2.5 h-2.5" />
                            {expense.recurringFrequency}
                          </span>
                        )}
                      </div>
                      <p className="font-rajdhani text-base text-cyan-100 font-semibold truncate">
                        {expense.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <p className="font-rajdhani text-xs text-cyan-400/60 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(expense.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {expense.time && ` • ${expense.time}`}
                        </p>
                        {expense.paymentMethod && (
                          <p className="font-rajdhani text-xs text-yellow-400/60 flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            {expense.paymentMethod}
                          </p>
                        )}
                        {expense.location && (
                          <p className="font-rajdhani text-xs text-pink-400/60 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {expense.location}
                          </p>
                        )}
                      </div>
                      
                      {/* Tags & Split With */}
                      {(expense.tags?.length || expense.splitWith?.length) && (
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {expense.tags?.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-md bg-purple-400/10 text-[10px] font-rajdhani text-purple-300 flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                          {expense.splitWith?.length ? (
                            <span className="px-2 py-0.5 rounded-md bg-pink-400/10 text-[10px] font-rajdhani text-pink-300 flex items-center gap-1">
                              <Users className="w-2.5 h-2.5" />
                              Split with {expense.splitWith.length}
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                    <div className="text-right">
                      <p className="text-2xl font-bungee neon-text-pink">
                        ₹{expense.amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-2.5 rounded-xl bg-pink-400/5 border border-pink-400/20 hover:bg-pink-400/20 hover:border-pink-400/40 transition-all duration-300 group/btn cursor-pointer"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4 neon-text-pink group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================
            🎪 BOTTOM STATUS
            ======================================== */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-400/5 border border-cyan-400/10">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <p className="font-rajdhani text-xs text-cyan-100/60">
              Sync active • Data encrypted
            </p>
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  )
}
