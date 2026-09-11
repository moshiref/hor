import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

/**
 * Card — reusable surface for features, programs, stats.
 * Consistent border, radius, shadow.
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
        'card-luxury rounded-2xl border border-ink-100 bg-white shadow-card',
        paddings[padding],
        hover && 'hover:shadow-md',
        className,
      )}
      {...props}
    >
      {children}
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
