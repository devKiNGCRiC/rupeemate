/**
 * PRIVACY PAGE
 * A plain description of what this app does with your data. Keep it in sync
 * with the code: if a backend, analytics or accounts are ever added, update it.
 */

import type { Metadata } from "next"
import Link from "next/link"
import PageShell from "@/components/PageShell"

export const metadata: Metadata = { title: "Privacy" }

export default function PrivacyPage() {
  return (
    <PageShell title="PRIVACY" subtitle="What RupeeMate does with your data">
      <div className="max-w-3xl holo-card p-6 sm:p-8 rounded-2xl border border-cyan-400/20 space-y-6 font-rajdhani text-cyan-100/80 leading-relaxed">
        <section>
          <h2 className="font-orbitron text-sm font-bold neon-text-cyan mb-2 uppercase tracking-wider">Your expenses stay on your device</h2>
          <p>
            Everything you enter (expenses, notes, budgets) is saved in your browser&apos;s local storage.
            It is not sent to a server, and there is no account or login.
          </p>
        </section>

        <section>
          <h2 className="font-orbitron text-sm font-bold neon-text-cyan mb-2 uppercase tracking-wider">No tracking</h2>
          <p>
            This site does not use analytics, advertising or tracking scripts, and it sets no cookies.
            Fonts are served from the site itself.
          </p>
        </section>

        <section>
          <h2 className="font-orbitron text-sm font-bold neon-text-cyan mb-2 uppercase tracking-wider">What that means for you</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your data is not available on other devices or browsers.</li>
            <li>Clearing your browser&apos;s site data, or using a private window, deletes it.</li>
            <li>
              Anyone who can use this browser profile can see it. Do not use a shared computer for sensitive records.
            </li>
            <li>
              Use <Link href="/settings" className="neon-text-cyan underline underline-offset-2">Settings</Link> to download a backup,
              export to a spreadsheet, or delete everything.
            </li>
          </ul>
        </section>
      </div>
    </PageShell>
  )
}
