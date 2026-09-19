import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Budget",
  description: "Set monthly limits and track your progress.",
}

export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  return children
}
