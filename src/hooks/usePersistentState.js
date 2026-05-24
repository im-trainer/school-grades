import { useState, useEffect, useRef } from 'react'

/**
 * Like useState, but automatically persists to localStorage as JSON.
 * On first render reads from localStorage; on each state change writes back.
 * Optional `sanitise` function is applied to the stored value before use
 * (useful for data shape migrations).
 */
export function usePersistentState(key, defaultValue, sanitise) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        const parsed = JSON.parse(stored)
        return sanitise ? sanitise(parsed) : parsed
      }
    } catch {}
    return defaultValue
  })

  const keyRef = useRef(key)
  keyRef.current = key

  useEffect(() => {
    try {
      localStorage.setItem(keyRef.current, JSON.stringify(state))
    } catch {}
  }, [state])

  return [state, setState]
}
