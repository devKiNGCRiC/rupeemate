/**
 * Tiny localStorage-backed store for use with React's useSyncExternalStore.
 *
 * - getSnapshot returns the raw string, which React compares by value, so it is
 *   stable between renders.
 * - Updates from other tabs (the "storage" event) and from this tab (set) both
 *   notify subscribers, so every open page stays in sync.
 * - Every storage access is wrapped in try/catch: private windows and blocked
 *   site data make localStorage throw.
 */

export interface LocalStore {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => string | null
  set: (value: string | null) => boolean
}

export function createLocalStore(key: string): LocalStore {
  const listeners = new Set<() => void>()
  // Fallback used when localStorage is unavailable, so the app still works for the session.
  let memoryValue: string | null = null
  let storageWorks = true

  const notify = () => listeners.forEach((l) => l())

  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) notify()
  }

  return {
    subscribe(listener) {
      if (listeners.size === 0) window.addEventListener("storage", onStorage)
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) window.removeEventListener("storage", onStorage)
      }
    },

    getSnapshot() {
      if (!storageWorks) return memoryValue
      try {
        return window.localStorage.getItem(key)
      } catch {
        storageWorks = false
        return memoryValue
      }
    },

    /** Returns false if the value could only be kept in memory (storage blocked or full). */
    set(value) {
      let persisted = true
      try {
        if (value === null) window.localStorage.removeItem(key)
        else window.localStorage.setItem(key, value)
        storageWorks = true
      } catch {
        storageWorks = false
        persisted = false
      }
      memoryValue = value
      notify()
      return persisted
    },
  }
}
