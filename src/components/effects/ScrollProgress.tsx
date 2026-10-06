import { useEffect, useRef } from 'react'

/** ScrollProgress — thin brand-gradient bar at the top showing page progress. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf: number | null = null
    const update = () => {
      raf = null
      const max = document.documentElement.scrollHeight - window.innerHeight
      el.style.setProperty('--progress', String(max > 0 ? Math.min(window.scrollY / max, 1) : 0))
    }
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div ref={ref} className="scroll-progress h-full w-full bg-gradient-to-l from-raspberry-500 via-amber-500 to-teal-500 shadow-[0_0_10px_rgba(196,28,99,0.45)]" />
    </div>
  )
}
