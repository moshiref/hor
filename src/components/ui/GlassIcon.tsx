import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'raspberry' | 'teal' | 'amber' | 'ink'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * GlassIcon — 3D crystal glass container for lucide icons.
 * Uses backdrop-filter, semi-transparent border, layered shadows,
 * and spring hover (tilt+scale) via CSS transforms.
 */
export function GlassIcon({ variant = 'teal', size = 'md', className, children, ...props }: Props) {
  const variants: Record<string, string> = {
    raspberry:
      'bg-gradient-to-br from-white/90 to-raspberry-50/80 text-raspberry-600 border-raspberry-200/50 shadow-[0_8px_24px_rgba(196,28,99,0.12),0_2px_8px_rgba(196,28,99,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]',
    teal:
      'bg-gradient-to-br from-white/90 to-teal-100/70 text-teal-600 border-teal-200/50 shadow-[0_8px_24px_rgba(30,106,133,0.12),0_2px_8px_rgba(30,106,133,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]',
    amber:
      'bg-gradient-to-br from-white/90 to-amber-100/80 text-amber-600 border-amber-200/50 shadow-[0_8px_24px_rgba(222,159,53,0.12),0_2px_8px_rgba(222,159,53,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]',
    ink:
      'bg-gradient-to-br from-white/90 to-ink-100/60 text-ink-700 border-ink-200/40 shadow-[0_8px_24px_rgba(23,35,60,0.10),0_2px_8px_rgba(23,35,60,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]',
  }

  const sizes: Record<string, string> = {
    sm: 'h-10 w-10 rounded-xl',
    md: 'h-[3.25rem] w-[3.25rem] rounded-2xl',
    lg: 'h-14 w-14 rounded-2xl',
  }

  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center border backdrop-blur-xl',
        'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform',
        'hover:scale-[1.07] hover:-rotate-[2deg] hover:shadow-[0_14px_36px_rgba(23,35,60,0.14),0_4px_12px_rgba(23,35,60,0.08),inset_0_1px_0_rgba(255,255,255,1)]',
        'before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/60 before:to-transparent before:opacity-60 before:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]">{children}</span>
    </span>
  )
}
