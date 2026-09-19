/**
 * TOAST NOTIFICATION COMPONENT
 * Success/Error/Info notifications with auto-dismiss
 */

"use client"

import { useEffect, useRef } from "react"
import { CheckCircle, XCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "info"

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const colors = {
  success: {
    bg: "bg-green-400/10",
    border: "border-green-400/40",
    text: "text-green-400",
    glow: "shadow-lg shadow-green-400/20",
  },
  error: {
    bg: "bg-pink-400/10",
    border: "border-pink-400/40",
    text: "neon-text-pink",
    glow: "shadow-lg shadow-pink-400/20",
  },
  info: {
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/40",
    text: "neon-text-cyan",
    glow: "shadow-lg shadow-cyan-400/20",
  },
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  // Keep the latest onClose in a ref so a parent re-render (new function each
  // time) does not restart the auto-dismiss timer.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  // Restart the timer when a new message arrives while a toast is already showing.
  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), duration)
    return () => clearTimeout(timer)
  }, [duration, message, type])

  const Icon = icons[type]
  const colorScheme = colors[type]

  return (
    <div
      className="fixed top-20 right-4 z-200 max-w-sm w-full animate-slide-in-right"
      role={type === "error" ? "alert" : "status"}
    >
      <div
        className={`${colorScheme.bg} ${colorScheme.border} ${colorScheme.glow} backdrop-blur-xl border rounded-2xl p-4 flex items-start gap-3`}
      >
        <Icon className={`w-5 h-5 ${colorScheme.text} shrink-0 mt-0.5`} />
        <p className={`font-rajdhani text-sm ${colorScheme.text} flex-1 leading-relaxed`}>
          {message}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className={`w-4 h-4 ${colorScheme.text}`} />
        </button>
      </div>
    </div>
  )
}
