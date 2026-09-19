/**
 * EXPENSE FORM - BASIC & ADVANCED MODES
 * 
 * Basic Mode: Quick entry with essential fields
 * Advanced Mode: Comprehensive tracking with extra fields for detailed insights
 */

"use client"

import { useState } from "react"
import { 
  Plus, AlertCircle, IndianRupee, CreditCard, Wallet as WalletIcon,
  Smartphone, Building, Tag, FileText, Repeat, MapPin, Calendar,
  Clock, Users, ChevronDown, Sparkles
} from "lucide-react"

// Expense data interface
export interface ExpenseData {
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

interface ExpenseFormProps {
  onAddExpense: (expense: ExpenseData) => void
  mode: "basic" | "advanced"
  onModeChange: (mode: "basic" | "advanced") => void
}

export default function ExpenseForm({ onAddExpense, mode, onModeChange }: ExpenseFormProps) {
  // Basic fields
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [subCategory, setSubCategory] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")
  
  // Advanced fields
  const [paymentMethod, setPaymentMethod] = useState("Cash")
  const [tags, setTags] = useState("")
  const [notes, setNotes] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState("monthly")
  const [location, setLocation] = useState("")
  const [splitWith, setSplitWith] = useState("")
  
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { name: "Food", icon: "🍔", subCategories: ["Restaurant", "Groceries", "Delivery", "Coffee", "Snacks"] },
    { name: "Transport", icon: "🚗", subCategories: ["Fuel", "Uber/Ola", "Metro", "Bus", "Parking"] },
    { name: "Entertainment", icon: "🎮", subCategories: ["Movies", "Games", "Streaming", "Events", "Sports"] },
    { name: "Shopping", icon: "🛍️", subCategories: ["Clothes", "Electronics", "Home", "Gifts", "Online"] },
    { name: "Bills", icon: "💡", subCategories: ["Electricity", "Water", "Internet", "Phone", "Rent"] },
    { name: "Health", icon: "⚕️", subCategories: ["Medicine", "Doctor", "Gym", "Insurance", "Wellness"] },
    { name: "Other", icon: "📦", subCategories: ["Education", "Personal", "Investment", "Donation", "Misc"] },
  ]

  const paymentMethods = [
    { name: "Cash", icon: WalletIcon },
    { name: "UPI", icon: Smartphone },
    { name: "Card", icon: CreditCard },
    { name: "Net Banking", icon: Building },
  ]

  const recurringOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ]

  const currentCategory = categories.find(c => c.name === category)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (!amount || !date || !description) {
      setError("Please fill all required fields")
      setIsSubmitting(false)
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Amount must be a positive number")
      setIsSubmitting(false)
      return
    }

    const expenseData: ExpenseData = {
      amount: amountNum,
      category,
      date,
      description,
    }

    // Add advanced fields if in advanced mode
    if (mode === "advanced") {
      expenseData.subCategory = subCategory || undefined
      expenseData.time = time || undefined
      expenseData.paymentMethod = paymentMethod
      expenseData.tags = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : undefined
      expenseData.notes = notes || undefined
      expenseData.isRecurring = isRecurring
      expenseData.recurringFrequency = isRecurring ? recurringFrequency : undefined
      expenseData.location = location || undefined
      expenseData.splitWith = splitWith ? splitWith.split(",").map(s => s.trim()).filter(Boolean) : undefined
    }

    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    onAddExpense(expenseData)

    // Reset form
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
    setIsSubmitting(false)
  }

  return (
    <div className="holo-card p-5 md:p-6 rounded-2xl relative border border-cyan-400/20">
      
      {/* Header with Mode Toggle */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400/20 to-pink-400/20 flex items-center justify-center">
              <Plus className="w-5 h-5 neon-text-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-orbitron font-bold neon-text-cyan tracking-wider">
                ADD EXPENSE
              </h2>
              <p className="text-[10px] font-rajdhani text-cyan-100/50 uppercase tracking-wider">
                {mode === "basic" ? "Quick Entry" : "Detailed Tracking"}
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-cyan-400/20 relative z-50">
            <button
              type="button"
              onClick={() => {
                console.log("🔵 BASIC mode clicked!")
                onModeChange("basic")
              }}
              className={`px-4 py-2 rounded-lg font-orbitron text-xs tracking-wider transition-all duration-300 relative z-50 cursor-pointer ${
                mode === "basic"
                  ? "bg-cyan-400/20 neon-text-cyan border border-cyan-400/40"
                  : "text-cyan-100/50 hover:text-cyan-100/80"
              }`}
            >
              BASIC
            </button>
            <button
              type="button"
              onClick={() => {
                console.log("🌸 ADVANCED mode clicked!")
                onModeChange("advanced")
              }}
              className={`px-4 py-2 rounded-lg font-orbitron text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 relative z-50 cursor-pointer ${
                mode === "advanced"
                  ? "bg-pink-400/20 neon-text-pink border border-pink-400/40"
                  : "text-cyan-100/50 hover:text-cyan-100/80"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              ADVANCED
            </button>
          </div>
        </div>
        
        <div className="w-full h-px bg-linear-to-r from-cyan-400/30 via-pink-400/30 to-transparent"></div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-pink-500/10 border border-pink-400/30 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 neon-text-pink shrink-0" />
          <p className="font-rajdhani text-pink-200 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* ============================================
            BASIC FIELDS (Always Visible)
            ============================================ */}
        
        {/* Amount & Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Amount */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-cyan">
              <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
              Amount (₹) <span className="text-pink-400">*</span>
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-green-400/10 flex items-center justify-center">
                <IndianRupee className="w-3.5 h-3.5 neon-text-green" />
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value
                  // Allow only numbers and decimal point
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
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
            <label className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-purple">
              <span className="w-1 h-1 rounded-full bg-purple-400"></span>
              Date <span className="text-pink-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-purple-400/10 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 neon-text-purple" />
              </div>
              <input
                type="date"
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
              <label className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-yellow">
                <Clock className="w-3 h-3" />
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-yellow-400/20 text-white font-rajdhani focus:outline-none focus:border-yellow-400/50 transition-all duration-300"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-yellow">
                <MapPin className="w-3 h-3" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Mall, Office, Home"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-yellow-400/20 text-white font-rajdhani placeholder:text-cyan-100/30 focus:outline-none focus:border-yellow-400/50 transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-pink">
            <span className="w-1 h-1 rounded-full bg-pink-400"></span>
            Category <span className="text-pink-400">*</span>
          </label>
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
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
                <span className={`text-lg transition-transform duration-300 ${category === cat.name ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {cat.icon}
                </span>
                <span className="truncate w-full text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-category (Advanced Only) */}
        {mode === "advanced" && currentCategory && (
          <div>
            <label className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider text-cyan-100/60">
              <ChevronDown className="w-3 h-3" />
              Sub-category
            </label>
            <div className="flex flex-wrap gap-2">
              {currentCategory.subCategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSubCategory(sub)}
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
          </div>
        )}

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-cyan">
            <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
            Description <span className="text-pink-400">*</span>
          </label>
          <input
            type="text"
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
            <div>
              <label className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-yellow">
                <CreditCard className="w-3 h-3" />
                Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.name}
                      type="button"
                      onClick={() => setPaymentMethod(method.name)}
                      className={`
                        p-2.5 rounded-xl font-rajdhani font-medium text-xs
                        transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                        ${paymentMethod === method.name
                          ? 'bg-yellow-400/15 border border-yellow-400/50 neon-text-yellow'
                          : 'bg-black/20 border border-cyan-400/10 text-cyan-100/70 hover:border-yellow-400/30'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{method.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-purple">
                <Tag className="w-3 h-3" />
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., work, lunch, team"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-purple-400/20 text-white font-rajdhani placeholder:text-cyan-100/30 focus:outline-none focus:border-purple-400/50 transition-all duration-300"
              />
            </div>

            {/* Split With */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-pink">
                <Users className="w-3 h-3" />
                Split With (comma separated)
              </label>
              <input
                type="text"
                value={splitWith}
                onChange={(e) => setSplitWith(e.target.value)}
                placeholder="e.g., John, Sarah, Mike"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-pink-400/20 text-white font-rajdhani placeholder:text-cyan-100/30 focus:outline-none focus:border-pink-400/50 transition-all duration-300"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-orbitron text-[10px] uppercase tracking-wider neon-text-cyan">
                <FileText className="w-3 h-3" />
                Additional Notes
              </label>
              <textarea
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
                      Automatically track repeated payments
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-black/60 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-cyan-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400/30 peer-checked:after:bg-yellow-400"></div>
                </label>
              </div>

              {isRecurring && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-yellow-400/10">
                  {recurringOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
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
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 min-h-[52px] rounded-xl font-orbitron text-sm tracking-wider flex items-center justify-center gap-2 bg-linear-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-400/40 hover:border-cyan-400/70 hover:shadow-lg hover:shadow-cyan-400/20 text-cyan-100 hover:text-white transition-all duration-300 group cursor-pointer active:scale-[0.98] ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ADDING...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              ADD EXPENSE
            </>
          )}
        </button>

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
