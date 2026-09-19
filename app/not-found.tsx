import type { Metadata } from "next"
import Link from "next/link"
import { Compass } from "lucide-react"

export const metadata: Metadata = { title: "Page not found" }

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="holo-card p-10 rounded-3xl border border-cyan-400/20 max-w-lg">
        <Compass className="w-14 h-14 neon-text-cyan mx-auto mb-6" aria-hidden="true" />
        <h1 className="text-5xl font-bungee holographic mb-3">404</h1>
        <p className="text-xl font-orbitron font-bold neon-text-cyan mb-3">PAGE NOT FOUND</p>
        <p className="font-rajdhani text-cyan-100/70 mb-6">
          That page does not exist or has moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 font-orbitron text-sm neon-text-cyan"
        >
          GO HOME
        </Link>
      </div>
    </div>
  )
}
