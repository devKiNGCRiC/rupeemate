import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "Back up, restore and manage your saved data.",
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
