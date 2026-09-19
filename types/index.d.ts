// Global type declarations for the application

declare module '@/components/ExpenseForm' {
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

  export default function ExpenseForm(props: ExpenseFormProps): JSX.Element
}
