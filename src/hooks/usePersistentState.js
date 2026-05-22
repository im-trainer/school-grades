import { useState, useEffect, useRef } from 'react'

/**
 * Like useState, but automatically persists to localStorage as JSON.
 * On first render reads from localStorage; on each state change writes back.
 */
export function usePersistentState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) return JSON.parse(stored)
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
