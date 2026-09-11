import { useEffect, useRef } from 'react'

export function GlobalCursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduced || coarse) {
      el.style.display = 'none'
      return
    }
    let raf: number | null = null
    let x = -400, y = -400
    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      if (raf == null) {
        raf = requestAnimationFrame(() => {
          raf = null
          if (el) {
            el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
          }
        })
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.045] will-change-transform"
      style={{
        background: 'radial-gradient(circle, rgba(196,28,99,0.9) 0%, rgba(222,159,53,0.55) 32%, rgba(30,106,133,0.35) 52%, transparent 70%)',
        filter: 'blur(1px)',
      }}
    />
  )
}
