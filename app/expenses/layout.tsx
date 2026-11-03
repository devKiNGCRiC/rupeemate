import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Expenses",
  description: "Add, search, filter and export your expenses.",
}

export default function ExpensesLayout({ children }: { children: React.ReactNode }) {
  return children
}
