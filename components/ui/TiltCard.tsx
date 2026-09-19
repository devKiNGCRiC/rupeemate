"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: number
  glare?: boolean
  glareColor?: string
  wrapperClassName?: string
}

export function TiltCard({
  children,
  className,
  intensity = 10,
  glare = true,
  glareColor = "rgba(255,255,255,0.25)",
  wrapperClassName,
  onMouseMove: userMouseMove,
  onMouseLeave: userMouseLeave,
  onMouseEnter: userMouseEnter,
  onClick,
  ...rest
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const glareRef = useRef<HTMLDivElement | null>(null)
  const frame = useRef<number>()

  useEffect(() => {
    return () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current)
      }
    }
  }, [])

  const resetStyles = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)"
    cardRef.current.style.transition = "transform 0.4s ease"

    if (glareRef.current) {
      glareRef.current.style.opacity = "0"
      glareRef.current.style.background = "transparent"
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * intensity * -1
    const rotateY = ((x - centerX) / centerX) * intensity

    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100

    if (frame.current) {
      cancelAnimationFrame(frame.current)
    }

    frame.current = requestAnimationFrame(() => {
      if (!cardRef.current) return

      cardRef.current.style.transition = "transform 0.08s ease-out"
      cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`

      if (glare && glareRef.current) {
        glareRef.current.style.opacity = "1"
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, ${glareColor}, rgba(255,255,255,0))`
      }
    })

    if (userMouseMove) {
      userMouseMove(event)
    }
  }

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    if (frame.current) {
      cancelAnimationFrame(frame.current)
    }
    resetStyles()

    if (userMouseLeave) {
      userMouseLeave(event)
    }
  }

  return (
    <div
      className={cn(
        "tilt-wrapper",
        onClick ? "cursor-pointer" : "",
        wrapperClassName
      )}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={(event) => {
          if (userMouseEnter) {
            userMouseEnter(event)
          }
        }}
        className={cn(
          "relative rounded-2xl transition-transform duration-200 ease-out will-change-transform",
          "tilt-card",
          className
        )}
        style={{ transformStyle: "preserve-3d" }}
        onClick={onClick}
        {...rest}
      >
        {glare && (
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 mix-blend-screen"
          />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default TiltCard