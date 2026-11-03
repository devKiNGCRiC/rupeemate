import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createLocalStore } from "@/lib/local-store"

/** Minimal window + localStorage stand-in (tests run in node, not a browser). */
function stubBrowser(options: { throwOnWrite?: boolean; throwOnRead?: boolean } = {}) {
  const data = new Map<string, string>()
  const handlers = new Map<string, Set<(e: unknown) => void>>()
  const localStorage = {
    getItem: (k: string) => {
      if (options.throwOnRead) throw new Error("blocked")
      return data.get(k) ?? null
    },
    setItem: (k: string, v: string) => {
      if (options.throwOnWrite) throw new Error("quota")
      data.set(k, v)
    },
    removeItem: (k: string) => void data.delete(k),
  }
  const win = {
    localStorage,
    addEventListener: (type: string, fn: (e: unknown) => void) => {
      if (!handlers.has(type)) handlers.set(type, new Set())
      handlers.get(type)!.add(fn)
    },
    removeEventListener: (type: string, fn: (e: unknown) => void) => void handlers.get(type)?.delete(fn),
  }
  vi.stubGlobal("window", win)
  return { data, handlers }
}

describe("createLocalStore", () => {
  beforeEach(() => vi.unstubAllGlobals())
  afterEach(() => vi.unstubAllGlobals())

  it("reads, writes and removes values", () => {
    const { data } = stubBrowser()
    const store = createLocalStore("k")
    expect(store.getSnapshot()).toBeNull()
    expect(store.set("hello")).toBe(true)
    expect(data.get("k")).toBe("hello")
    expect(store.getSnapshot()).toBe("hello")
    store.set(null)
    expect(store.getSnapshot()).toBeNull()
  })

  it("notifies subscribers on local writes and on storage events for its key only", () => {
    const { handlers } = stubBrowser()
    const store = createLocalStore("k")
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)

    store.set("a")
    expect(listener).toHaveBeenCalledTimes(1)

    const onStorage = [...handlers.get("storage")!][0]
    onStorage({ key: "other" })
    expect(listener).toHaveBeenCalledTimes(1)
    onStorage({ key: "k" })
    expect(listener).toHaveBeenCalledTimes(2)
    onStorage({ key: null }) // storage cleared
    expect(listener).toHaveBeenCalledTimes(3)

    unsubscribe()
    expect(handlers.get("storage")!.size).toBe(0)
    store.set("b")
    expect(listener).toHaveBeenCalledTimes(3)
  })

  it("keeps the value in memory and reports false when writes are blocked", () => {
    stubBrowser({ throwOnWrite: true })
    const store = createLocalStore("k")
    expect(store.set("kept")).toBe(false)
    expect(store.getSnapshot()).toBe("kept")
  })

  it("does not throw when reads are blocked", () => {
    stubBrowser({ throwOnRead: true })
    const store = createLocalStore("k")
    expect(store.getSnapshot()).toBeNull()
  })
})
