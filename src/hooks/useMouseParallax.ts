import { useEffect, useRef } from 'react'

/**
 * Mouse parallax + tilt — rAF throttled, 60fps, disabled on touch / reduced-motion.
 * Returns a ref to attach to a container; children with [data-parallax] will shift.
 */
export function useMouseParallax(strength = 14) {
  const containerRef = useRef<HTMLElement | null>(null)
  const raf = useRef<number | null>(null)
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (prefersReduced || isCoarse) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      target.current.x = (e.clientX - cx) / rect.width
      target.current.y = (e.clientY - cy) / rect.height
      if (raf.current == null) {
        raf.current = requestAnimationFrame(() => {
          raf.current = null
          const { x, y } = target.current
          const layers = el.querySelectorAll<HTMLElement>('[data-parallax]')
          layers.forEach((node) => {
            const depth = parseFloat(node.dataset.parallaxDepth ?? '1')
            const tx = x * strength * depth
            const ty = y * strength * depth
            const tiltX = y * 4 * depth
            const tiltY = -x * 6 * depth
            node.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
          })
          // also update CSS vars for spotlight position
          el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
          el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`)
        })
      }
    }

    const handleLeave = () => {
      const layers = el.querySelectorAll<HTMLElement>('[data-parallax]')
      layers.forEach((n) => (n.style.transform = 'translate3d(0,0,0) rotateX(0) rotateY(0)'))
    }

    el.addEventListener('mousemove', handleMove, { passive: true })
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [strength])

  return containerRef
}
