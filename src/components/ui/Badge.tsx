import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'teal' | 'raspberry' | 'amber' | 'neutral'
}

export function Badge({ variant = 'teal', className, children, ...props }: Props) {
  const variants = {
    teal: 'bg-teal-100 text-teal-700',
    raspberry: 'bg-raspberry-100 text-raspberry-700',
    amber: 'bg-amber-100 text-amber-600',
    neutral: 'bg-ink-100 text-ink-700',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
