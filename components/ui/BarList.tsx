/**
 * BAR LIST
 * Horizontal proportional bars with a text label and value on every row, so the
 * numbers are readable without relying on bar length or colour alone.
 */

import { NEON_GRADIENTS, type NeonColor } from "@/lib/expenses"

export interface BarItem {
  key: string
  label: string
  /** Text shown on the right, e.g. "₹1,200 (24%)" */
  valueText: string
  /** 0..100 width of the bar */
  percent: number
  color: NeonColor
}

export default function BarList({ items, label }: { items: BarItem[]; label: string }) {
  return (
    <ul className="space-y-4" aria-label={label}>
      {items.map((item) => (
        <li key={item.key} className="group">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="font-rajdhani text-sm text-cyan-100 font-medium truncate">{item.label}</span>
            <span className="font-rajdhani text-xs text-cyan-100/70 shrink-0">{item.valueText}</span>
          </div>
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden" aria-hidden="true">
            <div
              className="h-full rounded-full transition-all duration-500 group-hover:brightness-125"
              style={{
                width: `${Math.min(100, Math.max(0, item.percent))}%`,
                background: NEON_GRADIENTS[item.color],
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
