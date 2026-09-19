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
      <TopLoadingBar />
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex-1 flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 md:ml-64 transition-all duration-300 min-h-[calc(100vh-4rem)]">
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
