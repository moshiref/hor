import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'raspberry' | 'teal' | 'amber' | 'ink'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * GlassIcon — Premium 3D Glass
 * Translucent glass + studio lighting + soft 3D extrusion.
 * - backdrop blur + saturation
 * - layered shadows (ambient + contact + tint)
 * - inset top highlight + inner bevel
 * - specular hotspot (pseudo)
 * - subtle hover lift/tilt
 */
export function GlassIcon({ variant = 'teal', size = 'md', className, children, ...props }: Props) {
  const variants: Record<string, string> = {
    raspberry:
      'from-white/[0.94] via-white/[0.88] to-raspberry-50/70 text-raspberry-600 border-white/70 shadow-[0_10px_28px_rgba(196,28,99,0.13),0_2px_10px_rgba(196,28,99,0.09),inset_0_1.5px_0_rgba(255,255,255,0.96),inset_0_-1px_6px_rgba(196,28,99,0.07)]',
    teal:
      'from-white/[0.94] via-white/[0.88] to-teal-100/70 text-teal-600 border-white/70 shadow-[0_10px_28px_rgba(30,106,133,0.13),0_2px_10px_rgba(30,106,133,0.09),inset_0_1.5px_0_rgba(255,255,255,0.96),inset_0_-1px_6px_rgba(30,106,133,0.07)]',
    amber:
      'from-white/[0.94] via-white/[0.88] to-amber-100/80 text-amber-600 border-white/70 shadow-[0_10px_28px_rgba(222,159,53,0.14),0_2px_10px_rgba(222,159,53,0.09),inset_0_1.5px_0_rgba(255,255,255,0.96),inset_0_-1px_6px_rgba(222,159,53,0.06)]',
    ink:
      'from-white/[0.94] via-white/[0.88] to-ink-100/55 text-ink-700 border-white/70 shadow-[0_10px_28px_rgba(23,35,60,0.12),0_2px_10px_rgba(23,35,60,0.08),inset_0_1.5px_0_rgba(255,255,255,0.96),inset_0_-1px_6px_rgba(23,35,60,0.06)]',
  }

  const sizes: Record<string, string> = {
    sm: 'h-10 w-10 rounded-[13px]',
    md: 'h-[3.35rem] w-[3.35rem] rounded-[16px]',
    lg: 'h-14 w-14 rounded-[18px]',
  }

  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center border bg-gradient-to-br backdrop-blur-[14px] backdrop-saturate-[1.35]',
        'transition-all duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform',
        'hover:scale-[1.06] hover:-rotate-[1.6deg] hover:shadow-[0_16px_40px_rgba(23,35,60,0.14),0_4px_14px_rgba(23,35,60,0.08),inset_0_1.5px_0_rgba(255,255,255,1),inset_0_-1px_8px_rgba(255,255,255,0.35)]',
        // top specular sweep
        'before:absolute before:inset-[1px] before:rounded-[inherit] before:bg-gradient-to-br before:from-white/75 before:via-white/15 before:to-transparent before:opacity-90 before:pointer-events-none',
        // tiny hotspot
        'after:absolute after:top-[7%] after:left-[18%] after:h-[36%] after:w-[42%] after:rounded-full after:bg-gradient-to-br after:from-white/85 after:to-white/0 after:blur-[0.5px] after:opacity-70 after:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {/* 3D bottom edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_-1.5px_2px_rgba(23,35,60,0.07)]"
      />
      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(23,35,60,0.08)] transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-[-0.5px]">
        {children}
      </span>
    </span>
  )
}
