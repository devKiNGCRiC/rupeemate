/**
 * TOP LOADING BAR
 * A short accent animation on every route change. It is purely decorative:
 * all routes are prerendered, so there is no real load progress to report.
 */

"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

function Bar() {
  // Starts already "running"; state is only updated from timer callbacks.
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(20)

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(60), 100)
    const timer2 = setTimeout(() => setProgress(80), 300)
    let hideTimer: ReturnType<typeof setTimeout> | undefined
    const timer3 = setTimeout(() => {
      setProgress(100)
      hideTimer = setTimeout(() => setLoading(false), 200)
    }, 500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [])

  if (!loading) return null

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-1 bg-cyan-400/20 z-100 pointer-events-none"
    >
      <div
        className="h-full bg-linear-to-r from-cyan-400 via-pink-400 to-purple-400 shadow-lg shadow-cyan-400/50 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default function TopLoadingBar() {
  const pathname = usePathname()
  // Remounting on every path change restarts the animation without setState-in-effect.
  return <Bar key={pathname} />
}
