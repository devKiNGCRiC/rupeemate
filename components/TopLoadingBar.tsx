/**
 * TOP LOADING BAR
 * Shows progress during page transitions
 */

"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function TopLoadingBar() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    setProgress(20)

    const timer1 = setTimeout(() => setProgress(60), 100)
    const timer2 = setTimeout(() => setProgress(80), 300)
    const timer3 = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setLoading(false), 200)
    }, 500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [pathname])

  if (!loading) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-cyan-400/20 z-[100] transition-opacity duration-200"
      style={{ opacity: loading ? 1 : 0 }}
    >
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 shadow-lg shadow-cyan-400/50 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
