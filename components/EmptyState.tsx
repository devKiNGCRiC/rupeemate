/**
 * EMPTY STATE
 * Shown by data pages before any expense has been added.
 */

import Link from "next/link"
import { Plus } from "lucide-react"

interface EmptyStateProps {
  emoji: string
  title: string
  message: string
}

export default function EmptyState({ emoji, title, message }: EmptyStateProps) {
  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="holo-card p-8 sm:p-10 rounded-3xl border border-cyan-400/20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-cyan-400/10 to-pink-400/10 flex items-center justify-center">
          <span className="text-4xl" aria-hidden="true">{emoji}</span>
        </div>
        <h2 className="text-2xl font-orbitron font-bold neon-text-cyan mb-3 tracking-wider">{title}</h2>
        <p className="font-rajdhani text-cyan-100/70 mb-6 leading-relaxed">{message}</p>
        <Link
          href="/expenses"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 font-orbitron text-sm neon-text-cyan"
        >
          <Plus className="w-4 h-4" />
          ADD AN EXPENSE
        </Link>
      </div>
    </div>
  )
}
