import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

/**
 * Card — premium surface with layered depth.
 * Hover: subtle lift + tinted shadow + border highlight.
 */
export function Card({ padding = 'md', hover = false, className, children, ...props }: Props) {
  const paddings = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6 sm:p-8',
  }

  return (
    <div
      className={cn(
        'card-luxury group relative rounded-2xl border border-ink-100 bg-white shadow-card overflow-hidden',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/60 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100',
        paddings[padding],
        hover && 'hover:shadow-[0_16px_36px_rgba(23,35,60,0.10),0_4px_14px_rgba(23,35,60,0.06)]',
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function CardIcon({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform group-hover:scale-[1.06] group-hover:-rotate-1',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
