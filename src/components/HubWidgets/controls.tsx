import { useEffect, useId, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { Search, Xmark } from 'iconoir-react'

export { HubSelect, HubMultiSelect } from './selection'

export type HubButtonVariant = 'primary' | 'submit' | 'neutral' | 'success' | 'alert' | 'outlined' | 'borderless' | 'transparent' | 'starred'

export function HubButton({
  variant = 'primary', active = false, loading = false, icon, children,
  className = '', type = 'button', success = false, hideTextOnMobile = false, ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: HubButtonVariant
  active?: boolean
  loading?: boolean
  icon?: ReactNode
  success?: boolean
  hideTextOnMobile?: boolean
}) {
  const [flash, setFlash] = useState(false)
  useEffect(() => {
    setFlash(success)
    if (!success) return
    const timer = window.setTimeout(() => setFlash(false), 1600)
    return () => window.clearTimeout(timer)
  }, [success])
  return (
    <button {...props} type={type} aria-busy={loading || undefined}
      aria-label={props['aria-label'] ?? (hideTextOnMobile && typeof children === 'string' ? children : undefined)}
      className={`hub-button hub-button--${variant} ${active ? 'is-active' : ''} ${flash ? 'flash-success' : ''} ${hideTextOnMobile ? 'hide-text-on-mobile' : ''} ${!children ? 'is-icon-only' : ''} ${className}`}>
      {(loading || icon) && <span className="hub-button-icon" aria-hidden="true">
        {loading ? <span className="hub-button-spinner" /> : icon}
      </span>}
      {children && <span className="hub-button-text">{children}</span>}
    </button>
  )
}

type HubInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  loading?: boolean
  /** Screen-reader text while loading; defaults to "Saving {label}". */
  loadingText?: string
}

export function HubInput({ label, error, id, loading = false, loadingText, ...props }: HubInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  return (
    <div className={`hub-field ${error ? 'has-error' : ''} ${loading ? 'is-loading' : ''}`}>
      <label htmlFor={inputId}>{label}{props.readOnly ? ' (readonly)' : ''}</label>
      <input {...props} id={inputId} aria-invalid={error ? true : undefined}
        aria-busy={loading || undefined}
        aria-describedby={[props['aria-describedby'], error ? errorId : undefined].filter(Boolean).join(' ') || undefined} />
      {loading && <span className="hub-field-spinner" role="status"><span className="hub-sr-only">{loadingText ?? `Saving ${label}`}</span></span>}
      {error && <span id={errorId} className="hub-field-error">{error}</span>}
    </div>
  )
}

export function HubTextarea({ label, error, ...props }: {
  label: string
  error?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generatedId = useId()
  const inputId = props.id ?? generatedId
  const errorId = `${inputId}-error`
  return (
    <div className={`hub-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={inputId}>{label}</label>
      <textarea rows={5} {...props} id={inputId} aria-invalid={error ? true : undefined}
        aria-describedby={[props['aria-describedby'], error ? errorId : undefined].filter(Boolean).join(' ') || undefined} />
      {error && <span id={errorId} className="hub-field-error">{error}</span>}
    </div>
  )
}

export type HubOption = { value: string; text: string; icon?: ReactNode; disabled?: boolean }

export function HubCheckbox({ children, icon, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { icon?: ReactNode }) {
  return <label className="hub-checkbox">{icon && <span aria-hidden="true">{icon}</span>}{children}<input {...props} type="checkbox" /></label>
}

export function HubToggle({ label, description, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  description?: string
}) {
  return (
    <label className="hub-toggle-field">
      <span className="hub-toggle">
        <input {...props} type="checkbox" role="switch" aria-label={label} />
        <span className="hub-toggle-track" aria-hidden="true" />
      </span>
      <span className="hub-toggle-copy"><strong>{label}</strong>{description && <small>{description}</small>}</span>
    </label>
  )
}

export function HubMultiToggle({ label, options, value, onChange, hideText = false, disabled = false }: {
  label: string
  options: HubOption[]
  value: string
  onChange: (value: string) => void
  hideText?: boolean
  disabled?: boolean
}) {
  return <div className="hub-multi-toggle" role="group" aria-label={label}>
    {options.map(option => <button key={option.value} type="button" aria-pressed={option.value === value}
      disabled={disabled || option.disabled} aria-label={hideText ? option.text : undefined} title={hideText ? option.text : undefined}
      onClick={() => onChange(option.value)}>{option.icon && <span aria-hidden="true">{option.icon}</span>}{!hideText && option.text}</button>)}
  </div>
}

export function HubSearch({ label = 'Search', ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label?: string }) {
  return <label className="hub-search"><Search width={18} height={18} aria-hidden="true" />
    <span className="hub-sr-only">{label}</span><input type="search" placeholder={label} {...props} /></label>
}

export function HubColorInput({ label = 'Badge color (HEX)', value, onChange, error, disabled = false }: {
  label?: string; value: string; onChange: (value: string) => void; error?: string; disabled?: boolean
}) {
  if (!/^#[a-f\d]{6}$/i.test(value)) throw new RangeError('Color must be a six-digit HEX value')
  const id = useId()
  return <div className={`hub-field ${error ? 'has-error' : ''}`}>
    <label htmlFor={id}>{label}</label>
    <div className="hub-color-field">
      <span className="hub-color-swatch" style={{ backgroundColor: value }}>
        <input id={id} type="color" value={value} onChange={event => onChange(event.target.value)} disabled={disabled}
          aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
      </span>
      <output htmlFor={id}>{value.toUpperCase()}</output>
    </div>
    {error && <span id={`${id}-error`} className="hub-field-error">{error}</span>}
  </div>
}

export function HubTags({ label, value, onChange, disabled = false, error }: {
  label: string; value: string[]; onChange: (value: string[]) => void; disabled?: boolean; error?: string
}) {
  const [draft, setDraft] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  return <div ref={rootRef} className="hub-stack">
    <HubInput label={label} value={draft} disabled={disabled} error={error} placeholder="Type a tag and press Enter"
      onChange={event => setDraft(event.target.value)}
      onKeyDown={event => {
        if (event.key !== 'Enter') return
        event.preventDefault()
        const tag = draft.trim()
        if (!tag) return
        if (!value.includes(tag)) onChange([...value, tag])
        setDraft('')
      }} />
    <ul className="hub-tags" aria-label={`${label} tags`}>
      {value.map((tag, index) => <li key={`${tag}-${index}`}>{tag}
        <button type="button" disabled={disabled} aria-label={`Remove ${tag}`}
          onClick={() => { onChange(value.filter((_, current) => current !== index)); rootRef.current?.querySelector('input')?.focus() }}>
          <Xmark width={16} height={16} aria-hidden="true" />
        </button>
      </li>)}
    </ul>
  </div>
}

export function HubInlineButton({ label, icon, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; icon: ReactNode }) {
  return <HubButton {...props} variant="neutral" className={`hub-inline-button ${props.className ?? ''}`}
    aria-label={label} title={label} icon={icon}><span className="hub-sr-only">{label}</span></HubButton>
}

export function HubBlockButton({ icon, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: ReactNode }) {
  return <button {...props} type={props.type ?? 'button'} className={`hub-block-button ${props.className ?? ''}`}>
    {icon && <span aria-hidden="true">{icon}</span>}{children}</button>
}
