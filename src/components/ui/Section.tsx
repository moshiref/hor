import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLElement> & {
  // Background controls — keeps design system consistent
  background?: 'cream' | 'cream-light' | 'white' | 'transparent'
  // Vertical spacing
  padding?: 'default' | 'large' | 'none'
}

/**
 * Section — semantic <section> with consistent vertical rhythm.
 * All page sections should use this (Hero, About, Programs, etc).
 */
export function Section({
  background = 'transparent',
  padding = 'default',
  className,
  children,
  ...props
}: Props) {
  const backgrounds = {
    cream: 'bg-cream-100',
    'cream-light': 'bg-cream-50',
    white: 'bg-white',
    transparent: 'bg-transparent',
  }

  const paddings = {
    default: 'py-20 sm:py-28',
    large: 'py-28 sm:py-32',
    none: 'py-0',
  }

  return (
    <section className={cn(backgrounds[background], paddings[padding], className)} {...props}>
      {children}
    </section>
  )
}
