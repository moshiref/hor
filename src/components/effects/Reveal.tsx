import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  delay?: number
  stagger?: number
}

/**
 * Reveal — staggered scroll reveal wrapper. Children fade + rise when entering viewport.
 * Disabled automatically when prefers-reduced-motion.
 */
export function Reveal({ delay = 0, stagger = 0, className, children, style, ...props }: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        'will-change-transform transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
      style={{ transitionDelay: `${delay + stagger}ms`, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export function RevealGroup({
  className,
  children,
  staggerStep = 90,
  baseDelay = 0,
}: {
  className?: string
  children: React.ReactNode[]
  staggerStep?: number
  baseDelay?: number
}) {
  return (
    <>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <Reveal key={i} delay={baseDelay + i * staggerStep} className={className}>
              {child}
            </Reveal>
          ))
        : children}
    </>
  )
}
