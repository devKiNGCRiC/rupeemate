/**
 * SETTINGS PAGE
 * Your data lives only in this browser, so this page is where you back it up,
 * restore it, export it to a spreadsheet, or wipe it.
 */

"use client"

import { useRef, useState } from "react"
import { Download, FileJson, HardDrive, Trash2, Upload } from "lucide-react"
import { useAppData } from "@/components/AppDataProvider"
import PageShell from "@/components/PageShell"
import Toast, { type ToastType } from "@/components/Toast"
import { downloadTextFile } from "@/lib/download"
import { expensesToCsv, parseBudget, parseExpenses, toDateKey } from "@/lib/expenses"

const MAX_IMPORT_BYTES = 5 * 1024 * 1024

export default function SettingsPage() {
  const { ready, expenses, budget, importExpenses, saveBudget, clearExpenses, clearBudget } = useAppData()
  const fileInput = useRef<HTMLInputElement>(null)
  const [confirmingClear, setConfirmingClear] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const hasBudget = budget.monthly > 0 || Object.keys(budget.categories).length > 0
  const empty = expenses.length === 0 && !hasBudget

  const notify = (message: string, type: ToastType) => setToast({ message, type })

  const exportCsv = () => {
    // BOM so Excel opens the file as UTF-8
    downloadTextFile(`rupeemate-expenses-${toDateKey(new Date())}.csv`, `﻿${expensesToCsv(expenses)}`, "text/csv")
    notify(`Exported ${expenses.length} expense${expenses.length === 1 ? "" : "s"} to CSV`, "success")
  }

  const exportBackup = () => {
    const backup = { app: "rupeemate", version: 1, exportedAt: new Date().toISOString(), expenses, budget }
    downloadTextFile(`rupeemate-backup-${toDateKey(new Date())}.json`, JSON.stringify(backup, null, 2), "application/json")
    notify("Backup downloaded. Keep it somewhere safe.", "success")
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = "" // allow picking the same file again
    if (!file) return

    if (file.size > MAX_IMPORT_BYTES) {
      notify("That file is too large to be a RupeeMate backup (limit 5 MB).", "error")
      return
    }

    try {
      const data: unknown = JSON.parse(await file.text())
      const record = typeof data === "object" && data !== null && !Array.isArray(data) ? (data as Record<string, unknown>) : null
      const rawList = Array.isArray(data) ? data : record?.expenses
      if (!Array.isArray(rawList)) throw new Error("no expenses")

      const valid = parseExpenses(JSON.stringify(rawList))
      const result = importExpenses(valid)
      const invalid = rawList.length - valid.length

      let restoredBudget = false
      if (record?.budget) {
        const parsed = parseBudget(JSON.stringify(record.budget))
        if (parsed.monthly > 0 || Object.keys(parsed.categories).length > 0) {
          saveBudget(parsed)
          restoredBudget = true
        }
      }

      const parts = [`Imported ${result.added} expense${result.added === 1 ? "" : "s"}`]
      if (result.skipped) parts.push(`${result.skipped} already existed`)
      if (invalid) parts.push(`${invalid} invalid skipped`)
      if (restoredBudget) parts.push("budget restored")
      notify(`${parts.join(", ")}.`, result.saved ? "success" : "error")
    } catch {
      notify("Could not read that file. Choose a backup made by RupeeMate (.json).", "error")
    }
  }

  const handleClear = () => {
    clearExpenses()
    clearBudget()
    setConfirmingClear(false)
    notify("All data deleted from this browser.", "info")
  }

  const actionButton =
    "flex items-center justify-center gap-2 px-5 py-3 min-h-12 rounded-xl font-orbitron text-xs tracking-wider border transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"

  return (
    <PageShell title="SETTINGS" subtitle="Back up, restore and manage the data saved in this browser">
      {!ready ? (
        <p className="text-center font-rajdhani text-cyan-100/50 py-12" role="status">Loading…</p>
      ) : (
        <div className="max-w-3xl space-y-6">
          <section className="holo-card p-6 rounded-2xl border border-cyan-400/20" aria-labelledby="storage-heading">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0">
                <HardDrive className="w-5 h-5 neon-text-cyan" />
              </div>
              <div>
                <h2 id="storage-heading" className="text-lg font-orbitron font-bold neon-text-cyan mb-2">WHERE YOUR DATA LIVES</h2>
                <p className="font-rajdhani text-cyan-100/70 leading-relaxed">
                  RupeeMate has no accounts and no server database. Your {expenses.length} expense{expenses.length === 1 ? "" : "s"}
                  {hasBudget ? " and your budget are" : " are"} saved only in this browser on this device.
                  Clearing site data, using a private window or switching browsers will lose them,
                  so download a backup now and then.
                </p>
              </div>
            </div>
          </section>

          <section className="holo-card p-6 rounded-2xl border border-pink-400/20" aria-labelledby="export-heading">
            <h2 id="export-heading" className="text-lg font-orbitron font-bold neon-text-pink mb-4">EXPORT</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={exportCsv}
                disabled={expenses.length === 0}
                className={`${actionButton} bg-pink-400/10 border-pink-400/30 neon-text-pink hover:bg-pink-400/20`}
              >
                <Download className="w-4 h-4" />
                EXPORT CSV (SPREADSHEET)
              </button>
              <button
                type="button"
                onClick={exportBackup}
                disabled={empty}
                className={`${actionButton} bg-cyan-400/10 border-cyan-400/30 neon-text-cyan hover:bg-cyan-400/20`}
              >
                <FileJson className="w-4 h-4" />
                DOWNLOAD BACKUP (JSON)
              </button>
            </div>
          </section>

          <section className="holo-card p-6 rounded-2xl border border-purple-400/20" aria-labelledby="import-heading">
            <h2 id="import-heading" className="text-lg font-orbitron font-bold neon-text-purple mb-2">RESTORE FROM BACKUP</h2>
            <p className="font-rajdhani text-sm text-cyan-100/70 mb-4">
              Choose a RupeeMate backup (.json). Expenses are added to what you already have and duplicates are skipped.
              If the backup includes a budget, it replaces your current one.
            </p>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="sr-only"
              aria-label="Choose backup file"
              tabIndex={-1}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className={`${actionButton} bg-purple-400/10 border-purple-400/30 neon-text-purple hover:bg-purple-400/20`}
            >
              <Upload className="w-4 h-4" />
              CHOOSE BACKUP FILE
            </button>
          </section>

          <section className="holo-card p-6 rounded-2xl border border-red-400/30" aria-labelledby="danger-heading">
            <h2 id="danger-heading" className="text-lg font-orbitron font-bold text-red-400 mb-2">DELETE ALL DATA</h2>
            <p className="font-rajdhani text-sm text-cyan-100/70 mb-4">
              Permanently removes every expense and your budget from this browser. This cannot be undone, so download a backup first.
            </p>
            {confirmingClear ? (
              <div className="flex flex-col sm:flex-row gap-3" role="alertdialog" aria-label="Confirm delete all data">
                <button
                  type="button"
                  onClick={handleClear}
                  className={`${actionButton} bg-red-500/20 border-red-400/60 text-red-300 hover:bg-red-500/30`}
                >
                  <Trash2 className="w-4 h-4" />
                  YES, DELETE EVERYTHING
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingClear(false)}
                  className={`${actionButton} bg-black/40 border-cyan-400/20 text-cyan-100/70 hover:border-cyan-400/40`}
                >
                  CANCEL
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingClear(true)}
                disabled={empty}
                className={`${actionButton} bg-red-500/10 border-red-400/30 text-red-300 hover:bg-red-500/20`}
              >
                <Trash2 className="w-4 h-4" />
                DELETE ALL DATA
              </button>
            )}
          </section>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </PageShell>
  )
}
