/**
 * EXPENSE FORM - BASIC & ADVANCED MODES
 *
 * Basic Mode: Quick entry with essential fields
 * Advanced Mode: Comprehensive tracking with extra fields for detailed insights
 */

"use client"

import { useEffect, useId, useRef, useState } from "react"
import {
  Plus, Pencil, AlertCircle, IndianRupee, CreditCard, Wallet as WalletIcon,
  Smartphone, Building, Tag, FileText, Repeat, MapPin, Calendar,
  Clock, Users, ChevronDown, Sparkles, Save, X
} from "lucide-react"
import {
  CATEGORIES,
  MAX_AMOUNT,
  PAYMENT_METHODS,
  RECURRING_OPTIONS,
  isValidDateKey,
  type Expense,
  type ExpenseData,
} from "@/lib/expenses"

export type { ExpenseData }

interface ExpenseFormProps {
  /** Called with the validated data, both when adding and when saving an edit. */
  onSubmit: (expense: ExpenseData) => void
  mode: "basic" | "advanced"
  onModeChange: (mode: "basic" | "advanced") => void
  /**
   * When set, the form edits this expense instead of adding a new one. Render
   * it with key={expense.id} so the fields start from the right values.
   */
  editing?: Expense | null
  onCancelEdit?: () => void
}

const PAYMENT_ICONS = {
  Cash: WalletIcon,
  UPI: Smartphone,
  Card: CreditCard,
  "Net Banking": Building,
} as const

const splitList = (value: string) => value.split(",").map((t) => t.trim()).filter(Boolean)

export default function ExpenseForm({ onSubmit, mode: modeProp, onModeChange, editing = null, onCancelEdit }: ExpenseFormProps) {
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`

  // Editing always shows every field, so saving can never silently drop
  // details (tags, notes, ...) that an Advanced-mode expense already has.
  const mode = editing ? "advanced" : modeProp
  const amountRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) amountRef.current?.focus({ preventScroll: true })
  }, [editing])

  // Basic fields
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "")
  const [category, setCategory] = useState(editing?.category ?? "Food")
  const [subCategory, setSubCategory] = useState(editing?.subCategory ?? "")
  const [date, setDate] = useState(editing?.date ?? "")
  const [time, setTime] = useState(editing?.time ?? "")
  const [description, setDescription] = useState(editing?.description ?? "")

  // Advanced fields
  // New expenses default to Cash; an existing expense keeps whatever it had (possibly nothing)
  const [paymentMethod, setPaymentMethod] = useState<string>(editing ? (editing.paymentMethod ?? "") : "Cash")
  const [tags, setTags] = useState(editing?.tags?.join(", ") ?? "")
  const [notes, setNotes] = useState(editing?.notes ?? "")
  const [isRecurring, setIsRecurring] = useState(editing?.isRecurring ?? false)
  const [recurringFrequency, setRecurringFrequency] = useState(editing?.recurringFrequency ?? "monthly")
  const [location, setLocation] = useState(editing?.location ?? "")
  const [splitWith, setSplitWith] = useState(editing?.splitWith?.join(", ") ?? "")

  const [error, setError] = useState("")

  const currentCategory = CATEGORIES.find((c) => c.name === category)

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!amount || !date || !description.trim()) {
      setError("Please fill all required fields")
      return
    }

    if (!isValidDateKey(date)) {
      setError("Please enter a valid date")
      return
    }

    const amountNum = Math.round(parseFloat(amount) * 100) / 100
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      setError("Amount must be a positive number")
      return
    }
    if (amountNum > MAX_AMOUNT) {
      setError("Amount is too large. Please double-check it")
      return
    }

    const expenseData: ExpenseData = {
      amount: amountNum,
      category,
      date,
      description: description.trim(),
    }

    // Add advanced fields if in advanced mode
    if (mode === "advanced") {
      expenseData.subCategory = subCategory || undefined
      expenseData.time = time || undefined
      expenseData.paymentMethod = paymentMethod || undefined
      expenseData.tags = tags ? splitList(tags) : undefined
      expenseData.notes = notes.trim() || undefined
      expenseData.isRecurring = isRecurring || undefined
      expenseData.recurringFrequency = isRecurring ? recurringFrequency : undefined
      expenseData.location = location.trim() || undefined
      expenseData.splitWith = splitWith ? splitList(splitWith) : undefined
    }

    onSubmit(expenseData)

    // Reset form (an edit unmounts this form afterwards, so this only matters when adding)
    setAmount("")
    setDate("")
    setTime("")
    setDescription("")
    setSubCategory("")
    setTags("")
    setNotes("")
    setIsRecurring(false)
    setLocation("")
    setSplitWith("")
    setError("")
  }

  return (
    <div className="holo-card p-5 md:p-6 rounded-2xl relative border border-cyan-400/20">

      {/* Header with Mode Toggle */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400/20 to-pink-400/20 flex items-center justify-center">
              {editing ? <Pencil className="w-5 h-5 neon-text-pink" /> : <Plus className="w-5 h-5 neon-text-cyan" />}
            </div>
            <div>
              <h2 className="text-xl font-orbitron font-bold neon-text-cyan tracking-wider">
                {editing ? "EDIT EXPENSE" : "ADD EXPENSE"}
              </h2>
              <p className="text-[10px] font-rajdhani text-cyan-100/50 uppercase tracking-wider">
                {editing ? "Changing a saved expense" : mode === "basic" ? "Quick Entry" : "Detailed Tracking"}
              </p>
            </div>
          </div>

          {/* Mode Toggle (hidden while editing: editing always shows every field) */}
          {!editing && (
          <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-cyan-400/20 relative z-10" role="group" aria-label="Form mode">
            <button
              type="button"
              aria-pressed={mode === "basic"}
              onClick={() => onModeChange("basic")}
              className={`px-4 py-2 rounded-lg font-orbitron text-xs tracking-wider transition-all duration-300 cursor-pointer ${
                mode === "basic"
                  ? "bg-cyan-400/20 neon-text-cyan border border-cyan-400/40"
                  : "text-cyan-100/50 hover:text-cyan-100/80"
              }`}
            >
              BASIC
            </button>
            <button
              type="button"
              aria-pressed={mode === "advanced"}
              onClick={() => onModeChange("advanced")}
              className={`px-4 py-2 rounded-lg font-orbitron text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                mode === "advanced"
                  ? "bg-pink-400/20 neon-text-pink border border-pink-400/40"
                  : "text-cyan-100/50 hover:text-cyan-100/80"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              ADVANCED
            </button>
          </div>
          )}
        </div>

        <div className="w-full h-px bg-linear-to-r from-cyan-400/30 via-pink-400/30 to-transparent"></div>
      </div>

      {/* Error */}
      {error && (
        <div id={id("error")} role="alert" className="mb-5 p-3 rounded-xl bg-pink-500/10 border border-pink-400/30 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 neon-text-pink shrink-0" />
          <p className="font-rajdhani text-pink-200 text-sm">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Escape" && editing && onCancelEdit) onCancelEdit()
        }}
        className="space-y-5"
        noValidate
      >

        {/* ============================================
            BASIC FIELDS (Always Visible)
            ============================================ */}

        {/* Amount & Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Amount */}
          <div>
            <label htmlFor={id("amount")} className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-cyan">
              <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
              Amount (₹) <span className="text-pink-400" aria-hidden="true">*</span>
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-green-400/10 flex items-center justify-center">
                <IndianRupee className="w-3.5 h-3.5 neon-text-green" />
              </div>
              <input
                id={id("amount")}
                ref={amountRef}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                required
                aria-required="true"
                aria-invalid={error && !amount ? true : undefined}
                value={amount}
                onChange={(e) => {
                  const value = e.target.value
                  // Allow only numbers and up to two decimal places
                  if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                    setAmount(value)
                  }
                }}
                placeholder="1000"
                className="w-full pl-12 pr-4 py-3.5 min-h-12 rounded-xl bg-black/40 border border-cyan-400/20 text-white font-rajdhani placeholder:text-cyan-100/30 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor={id("date")} className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-purple">
              <span className="w-1 h-1 rounded-full bg-purple-400"></span>
              Date <span className="text-pink-400" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-purple-400/10 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 neon-text-purple" />
              </div>
              <input
                id={id("date")}
                type="date"
                required
                aria-required="true"
                aria-invalid={error && !date ? true : undefined}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 min-h-12 rounded-xl bg-black/40 border border-purple-400/20 text-white font-rajdhani focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Time & Location (Advanced Only) */}
        {mode === "advanced" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={id("time")} className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-yellow">
                <Clock className="w-3 h-3" />
                Time
              </label>
              <input
                id={id("time")}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-yellow-400/20 text-white font-rajdhani focus:outline-none focus:border-yellow-400/50 transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor={id("location")} className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-yellow">
                <MapPin className="w-3 h-3" />
                Location
              </label>
              <input
                id={id("location")}
                type="text"
                maxLength={80}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Mall, Office, Home"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-yellow-400/20 text-white font-rajdhani placeholder:text-cyan-100/30 focus:outline-none focus:border-yellow-400/50 transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Category */}
        <fieldset>
          <legend className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-pink">
            <span className="w-1 h-1 rounded-full bg-pink-400"></span>
            Category <span className="text-pink-400" aria-hidden="true">*</span>
          </legend>
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2 sm:gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                aria-pressed={category === cat.name}
                onClick={() => {
                  setCategory(cat.name)
                  setSubCategory("")
                }}
                className={`
                  min-h-14 p-2.5 rounded-xl font-rajdhani font-medium text-[10px] sm:text-xs
                  transition-all duration-300 flex flex-col items-center justify-center gap-1 group cursor-pointer
                  ${category === cat.name
                    ? 'bg-pink-400/15 border border-pink-400/50 neon-text-pink shadow-lg shadow-pink-400/20'
                    : 'bg-black/20 border border-cyan-400/10 text-cyan-100/70 hover:border-pink-400/30 hover:bg-pink-400/5'
                  }
                `}
              >
                <span aria-hidden="true" className={`text-lg transition-transform duration-300 ${category === cat.name ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {cat.icon}
                </span>
                <span className="truncate w-full text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Sub-category (Advanced Only) */}
        {mode === "advanced" && currentCategory && (
          <fieldset>
            <legend className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider text-cyan-100/60">
              <ChevronDown className="w-3 h-3" />
              Sub-category
            </legend>
            <div className="flex flex-wrap gap-2">
              {currentCategory.subCategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  aria-pressed={subCategory === sub}
                  onClick={() => setSubCategory(subCategory === sub ? "" : sub)}
                  className={`
                    px-3 py-1.5 rounded-lg font-rajdhani text-xs
                    transition-all duration-300 cursor-pointer
                    ${subCategory === sub
                      ? 'bg-cyan-400/15 border border-cyan-400/50 neon-text-cyan'
                      : 'bg-black/20 border border-cyan-400/10 text-cyan-100/60 hover:border-cyan-400/30'
                    }
                  `}
                >
                  {sub}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* Description */}
        <div>
          <label htmlFor={id("description")} className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-cyan">
            <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
            Description <span className="text-pink-400" aria-hidden="true">*</span>
          </label>
          <input
            id={id("description")}
            type="text"
            required
            aria-required="true"
            aria-invalid={error && !description.trim() ? true : undefined}
            maxLength={120}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Lunch at restaurant"
            className="w-full px-4 py-3.5 min-h-12 rounded-xl bg-black/40 border border-cyan-400/20 text-white font-rajdhani placeholder:text-cyan-100/30 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
          />
        </div>

        {/* ============================================
            ADVANCED FIELDS (Only in Advanced Mode)
            ============================================ */}

        {mode === "advanced" && (
          <>
            {/* Payment Method */}
            <fieldset>
              <legend className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-yellow">
                <CreditCard className="w-3 h-3" />
                Payment Method
              </legend>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = PAYMENT_ICONS[method]
                  return (
                    <button
                      key={method}
                      type="button"
                      aria-pressed={paymentMethod === method}
                      onClick={() => setPaymentMethod(paymentMethod === method ? "" : method)}
                      className={`
                        p-2.5 rounded-xl font-rajdhani font-medium text-xs
                        transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                        ${paymentMethod === method
                          ? 'bg-yellow-400/15 border border-yellow-400/50 neon-text-yellow'
                          : 'bg-black/20 border border-cyan-400/10 text-cyan-100/70 hover:border-yellow-400/30'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{method}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* Tags */}
            <div>
              <label htmlFor={id("tags")} className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-purple">
                <Tag className="w-3 h-3" />
                Tags (comma separated)
              </label>
              <input
                id={id("tags")}
                type="text"
                maxLength={120}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., work, lunch, team"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-purple-400/20 text-white font-rajdhani placeholder:text-cyan-100/30 focus:outline-none focus:border-purple-400/50 transition-all duration-300"
              />
            </div>

            {/* Shared With */}
            <div>
              <label htmlFor={id("split")} className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-pink">
                <Users className="w-3 h-3" />
                Shared with (comma separated)
              </label>
              <input
                id={id("split")}
                type="text"
                maxLength={120}
                value={splitWith}
                onChange={(e) => setSplitWith(e.target.value)}
                placeholder="e.g., John, Sarah, Mike"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-pink-400/20 text-white font-rajdhani placeholder:text-cyan-100/30 focus:outline-none focus:border-pink-400/50 transition-all duration-300"
              />
              <p className="mt-1 text-[10px] font-rajdhani text-cyan-100/40">
                A note of who shared this expense. Amounts are not divided automatically.
              </p>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor={id("notes")} className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-cyan">
                <FileText className="w-3 h-3" />
                Additional Notes
              </label>
              <textarea
                id={id("notes")}
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any extra details..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cyan-400/20 text-white font-rajdhani placeholder:text-cyan-100/30 focus:outline-none focus:border-cyan-400/50 transition-all duration-300 resize-none"
              />
            </div>

            {/* Recurring Toggle */}
            <div className="p-4 rounded-xl bg-black/30 border border-yellow-400/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                    <Repeat className="w-4 h-4 neon-text-yellow" />
                  </div>
                  <div>
                    <p className="font-orbitron text-xs uppercase tracking-wider neon-text-yellow">
                      Recurring Expense
                    </p>
                    <p className="font-rajdhani text-[10px] text-cyan-100/50">
                      Mark this as a repeating payment (label only, it is not added again automatically)
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Recurring expense"
                  />
                  <div className="w-11 h-6 bg-black/60 rounded-full peer peer-focus-visible:ring-2 peer-focus-visible:ring-yellow-400/60 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-cyan-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400/30 peer-checked:after:bg-yellow-400"></div>
                </label>
              </div>

              {isRecurring && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-yellow-400/10" role="group" aria-label="Recurring frequency">
                  {RECURRING_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={recurringFrequency === option.value}
                      onClick={() => setRecurringFrequency(option.value)}
                      className={`
                        px-3 py-1.5 rounded-lg font-rajdhani text-xs
                        transition-all duration-300 cursor-pointer
                        ${recurringFrequency === option.value
                          ? 'bg-yellow-400/15 border border-yellow-400/50 neon-text-yellow'
                          : 'bg-black/20 border border-yellow-400/10 text-cyan-100/60 hover:border-yellow-400/30'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          {editing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="sm:w-40 py-4 min-h-13 rounded-xl font-orbitron text-sm tracking-wider flex items-center justify-center gap-2 bg-black/40 border border-cyan-400/20 hover:border-cyan-400/40 text-cyan-100/70 hover:text-cyan-100 transition-all duration-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
              CANCEL
            </button>
          )}
          <button
            type="submit"
            className="flex-1 py-4 min-h-13 rounded-xl font-orbitron text-sm tracking-wider flex items-center justify-center gap-2 bg-linear-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-400/40 hover:border-cyan-400/70 hover:shadow-lg hover:shadow-cyan-400/20 text-cyan-100 hover:text-white transition-all duration-300 group cursor-pointer active:scale-[0.98]"
          >
            {editing ? (
              <>
                <Save className="w-4 h-4" />
                SAVE CHANGES
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                ADD EXPENSE
              </>
            )}
          </button>
        </div>

        {/* Mode hint */}
        {mode === "basic" && (
          <p className="text-center text-[10px] font-rajdhani text-cyan-100/40">
            Switch to <button type="button" onClick={() => onModeChange("advanced")} className="neon-text-pink hover:underline cursor-pointer">Advanced mode</button> for more tracking options
          </p>
        )}
      </form>
    </div>
  )
}
