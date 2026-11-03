"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surfaces in the browser console so a bug report can include it
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center" role="alert">
      <div className="holo-card p-10 rounded-3xl border border-pink-400/30 max-w-lg">
        <AlertTriangle className="w-14 h-14 neon-text-pink mx-auto mb-6" aria-hidden="true" />
        <h1 className="text-2xl font-orbitron font-bold neon-text-pink mb-3">SOMETHING WENT WRONG</h1>
        <p className="font-rajdhani text-cyan-100/70 mb-6">
          This page hit an unexpected error. Your saved expenses are not affected. Try again, and if it keeps
          happening, reload the page.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-400/10 border border-pink-400/30 hover:bg-pink-400/20 hover:border-pink-400/50 font-orbitron text-sm neon-text-pink cursor-pointer"
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  )
}
