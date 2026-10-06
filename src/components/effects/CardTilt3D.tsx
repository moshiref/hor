import { useEffect } from 'react'

/**
 * CardTilt3D — one delegated listener that gives every `.card-luxury` surface
 * a perspective tilt + moving light glare (styles live in index.css).
 * Large surfaces (maps, forms) are skipped; off on touch / reduced-motion.
 */
const MAX_WIDTH = 640
const MAX_TILT = 7

export function CardTilt3D() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let active: HTMLElement | null = null
    let raf: number | null = null
    let px = 0
    let py = 0

    const reset = (el: HTMLElement) => {
      el.classList.remove('is-tilting')
      el.style.removeProperty('--rx')
      el.style.removeProperty('--ry')
    }

    const apply = () => {
      raf = null
      const el = active
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = (px - r.left) / r.width
      const y = (py - r.top) / r.height
      el.style.setProperty('--rx', `${((0.5 - y) * MAX_TILT).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${((x - 0.5) * MAX_TILT).toFixed(2)}deg`)
      el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
      el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
    }

    const onMove = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>('.card-luxury') ?? null
      const card = target && target.offsetWidth <= MAX_WIDTH ? target : null
      if (card !== active) {
        if (active) reset(active)
        active = card
        active?.classList.add('is-tilting')
      }
      if (!active) return
      px = e.clientX
      py = e.clientY
      if (raf == null) raf = requestAnimationFrame(apply)
    }

    const onLeaveWindow = () => {
      if (active) reset(active)
      active = null
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
      if (raf) cancelAnimationFrame(raf)
      if (active) reset(active)
    }
  }, [])

  return null
}
