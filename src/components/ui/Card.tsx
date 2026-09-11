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
        'rounded-2xl border border-ink-100 bg-white shadow-card',
        paddings[padding],
        hover && 'transition-shadow hover:shadow-md',
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
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
