import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Categories",
  description: "Your spending grouped by category and sub-category.",
}

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return children
}
