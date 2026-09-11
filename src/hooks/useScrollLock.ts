import { useEffect } from 'react'

/**
 * Locks body scroll while a modal/menu is open.
 * Restores on unmount — prevents background scroll bleed.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = locked ? 'hidden' : original
    return () => {
      document.body.style.overflow = original
    }
  }, [locked])
}
