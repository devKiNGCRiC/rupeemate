import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analytics",
  description: "Monthly trends, category and payment-method breakdowns.",
}

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children
}
