/**
 * RECEIPTS PAGE (Coming Soon)
 * Receipt scanning needs file storage and text recognition, which this
 * browser-only version does not have yet.
 */

import type { Metadata } from "next"
import Link from "next/link"
import { Receipt } from "lucide-react"
import PageShell from "@/components/PageShell"

export const metadata: Metadata = { title: "Receipts" }

export default function ReceiptsPage() {
  return (
    <PageShell title="RECEIPTS" subtitle="Attach and scan receipts">
      <div className="max-w-2xl mx-auto text-center">
        <div className="holo-card p-10 rounded-2xl neon-border-cyan">
          <Receipt className="w-16 h-16 neon-text-cyan mx-auto mb-6 animate-float" aria-hidden="true" />
          <p className="text-2xl font-orbitron font-bold neon-text-cyan mb-4">NOT AVAILABLE YET</p>
          <p className="font-rajdhani text-lg text-cyan-100 leading-relaxed mb-6">
            Receipt attachments and scanning are planned, but they need secure file storage that this
            browser-only version does not have. Your expenses are not affected.
          </p>
          <Link
            href="/expenses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 font-orbitron text-sm neon-text-cyan"
          >
            BACK TO EXPENSES
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
