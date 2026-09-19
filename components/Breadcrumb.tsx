/**
 * BREADCRUMB NAVIGATION
 * Shows current page path with links
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

export default function Breadcrumb() {
  const pathname = usePathname()

  // Don't show on homepage
  if (pathname === "/") return null

  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <nav className="flex items-center gap-2 text-sm font-rajdhani mb-4 flex-wrap" aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-cyan-400/60 hover:text-cyan-400 transition-colors group"
      >
        <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        <span className="hidden xs:inline">Home</span>
        <span className="sr-only xs:hidden">Home</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`
        const isLast = index === pathSegments.length - 1
        const label = segment.charAt(0).toUpperCase() + segment.slice(1)

        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400/30" aria-hidden="true" />
            {isLast ? (
              <span className="text-cyan-400 font-semibold" aria-current="page">{label}</span>
            ) : (
              <Link
                href={href}
                className="text-cyan-400/60 hover:text-cyan-400 transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
