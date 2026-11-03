/**
 * APP LAYOUT WRAPPER
 * Wraps all pages with Header, Sidebar, Footer
 */

"use client"

import { useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import TopLoadingBar from "./TopLoadingBar"
import FloatingActionButton from "./FloatingActionButton"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-200 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-black focus:text-cyan-300 focus:border focus:border-cyan-400/60"
      >
        Skip to content
      </a>
      <TopLoadingBar />
      <Header
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
      />

      <div className="flex-1 flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main id="main-content" className="flex-1 md:ml-64 transition-all duration-300 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      <div className="md:ml-64">
        <Footer />
      </div>

      <FloatingActionButton />
    </div>
  )
}
