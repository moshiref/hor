import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

/**
 * Design System Button — single source for all CTAs.
 * - Variants map to brand tokens (raspberry primary)
 * - Full keyboard + focus support
 * - Loading state prevents double submit (forms)
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: Props) {
  const base =
    'inline-flex items-center justify-center rounded-full font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-raspberry-500 text-white shadow-sm hover:bg-raspberry-600 focus-visible:outline-raspberry-700',
    secondary:
      'border-2 border-ink-700 text-ink-700 hover:bg-ink-700 hover:text-white focus-visible:outline-ink-700',
    ghost: 'text-ink-600 hover:text-raspberry-600 hover:bg-ink-50 focus-visible:outline-raspberry-500',
  }

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-8 py-3.5 text-base',
    lg: 'px-10 py-4 text-lg',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          جارٍ الإرسال...
        </span>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  )
}

/**
 * Link styled as button — same visual system, semantic <a>.
 */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}) {
  const base =
    'inline-flex items-center justify-center rounded-full font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-raspberry-500 text-white shadow-sm hover:bg-raspberry-600 focus-visible:outline-raspberry-700',
    secondary:
      'border-2 border-ink-700 text-ink-700 hover:bg-ink-700 hover:text-white focus-visible:outline-ink-700',
    ghost: 'text-ink-600 hover:text-raspberry-600 hover:bg-ink-50 focus-visible:outline-raspberry-500',
  }

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-8 py-3.5 text-base',
    lg: 'px-10 py-4 text-lg',
  }

  return (
    <a className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </a>
  )
}
