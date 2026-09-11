import { useEffect, useRef } from 'react'

/**
 * Spotlight — soft, very subtle luminous halo that follows cursor via CSS vars.
 * Attaches to parent with relative positioning; pure CSS radial-gradient layer.
 * Respects prefers-reduced-motion and pointer: coarse.
 */
export function Spotlight({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (prefersReduced || isCoarse) return

    let raf: number | null = null
    let mx = 50
    let my = 50

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      mx = ((e.clientX - r.left) / r.width) * 100
      my = ((e.clientY - r.top) / r.height) * 100
      if (raf == null) {
        raf = requestAnimationFrame(() => {
          raf = null
          el.style.setProperty('--spot-x', `${mx}%`)
          el.style.setProperty('--spot-y', `${my}%`)
        })
      }
    }
    el.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      el.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 ${className}`}
      style={{
        background: `radial-gradient(600px circle at var(--spot-x,50%) var(--spot-y,50%), rgba(196,28,99,0.06), rgba(222,159,53,0.05) 28%, rgba(30,106,133,0.04) 42%, transparent 70%)`,
      }}
    />
  )
}
