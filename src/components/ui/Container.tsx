import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  size?: 'default' | 'narrow' | 'wide'
}

/**
 * Container — consistent max-width + horizontal padding.
 * Ensures no horizontal scroll, aligned grid across sections.
 */
export function Container({ size = 'default', className, children, ...props }: Props) {
  const sizes = {
    default: 'max-w-6xl',
    narrow: 'max-w-4xl',
    wide: 'max-w-7xl',
  }

  return (
    <div className={cn('mx-auto w-full px-5 sm:px-8', sizes[size], className)} {...props}>
      {children}
    </div>
  )
}
