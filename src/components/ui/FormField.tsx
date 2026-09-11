import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

type FieldProps = {
  label: string
  id: string
  required?: boolean
  error?: string
  hint?: string
}

export function FieldWrapper({
  label,
  id,
  required,
  error,
  hint,
  children,
}: FieldProps & { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-ink-700">
        {label}
        {required && <span className="ms-1 text-raspberry-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-raspberry-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function Input({
  id,
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string; error?: string }) {
  return (
    <input
      id={id}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(
        'w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-raspberry-200',
        error ? 'border-raspberry-400 focus:border-raspberry-500' : 'border-ink-100 focus:border-raspberry-300',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({
  id,
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; error?: string }) {
  return (
    <textarea
      id={id}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(
        'min-h-[96px] w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-raspberry-200',
        error ? 'border-raspberry-400 focus:border-raspberry-500' : 'border-ink-100 focus:border-raspberry-300',
        className,
      )}
      {...props}
    />
  )
}

export function Select({
  id,
  error,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { id: string; error?: string }) {
  return (
    <select
      id={id}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(
        'w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-raspberry-200',
        error ? 'border-raspberry-400 focus:border-raspberry-500' : 'border-ink-100 focus:border-raspberry-300',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
  required,
  legend,
}: {
  name: string
  legend: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  error?: string
  required?: boolean
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-bold text-ink-700">
        {legend}
        {required && <span className="ms-1 text-raspberry-500">*</span>}
      </legend>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              value === opt.value
                ? 'border-raspberry-500 bg-raspberry-50 text-raspberry-700'
                : 'border-ink-100 bg-white text-ink-700 hover:border-ink-200',
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
              aria-invalid={!!error}
            />
            <span className={cn('h-3 w-3 rounded-full border', value === opt.value ? 'bg-raspberry-500 border-raspberry-500' : 'border-ink-300')} />
            {opt.label}
          </label>
        ))}
      </div>
      {error && (
        <p className="text-xs font-medium text-raspberry-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export function CheckboxGroup({
  options,
  values,
  onChange,
  legend,
  error,
  required,
}: {
  legend: string
  options: { value: string; label: string }[]
  values: string[]
  onChange: (values: string[]) => void
  error?: string
  required?: boolean
}) {
  const toggle = (val: string) => {
    if (values.includes(val)) onChange(values.filter((v) => v !== val))
    else onChange([...values, val])
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-bold text-ink-700">
        {legend}
        {required && <span className="ms-1 text-raspberry-500">*</span>}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const checked = values.includes(opt.value)
          return (
            <label
              key={opt.value}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors',
                checked ? 'border-raspberry-500 bg-raspberry-50 text-ink-800' : 'border-ink-100 bg-white text-ink-700 hover:border-ink-200',
              )}
            >
              <input type="checkbox" checked={checked} onChange={() => toggle(opt.value)} className="sr-only" />
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded border text-white',
                  checked ? 'bg-raspberry-500 border-raspberry-500' : 'border-ink-300 bg-white',
                )}
                aria-hidden
              >
                {checked && <span className="text-xs">✓</span>}
              </span>
              {opt.label}
            </label>
          )
        })}
      </div>
      {error && (
        <p className="text-xs font-medium text-raspberry-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
