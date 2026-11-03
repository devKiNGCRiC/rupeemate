/**
 * PAGE SHELL
 * Shared background, container, breadcrumb and heading for content pages.
 */

import type { ReactNode } from "react"
import Breadcrumb from "@/components/Breadcrumb"

interface PageShellProps {
  title: string
  subtitle: string
  children: ReactNode
}

export default function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div className="relative overflow-hidden min-h-full">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        <div className="aurora-layer"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <Breadcrumb />

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bungee holographic mb-2">{title}</h1>
          <p className="text-lg font-rajdhani text-cyan-100/80">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  )
}
