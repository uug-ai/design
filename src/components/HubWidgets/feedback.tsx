import type { MouseEvent, ReactNode } from 'react'
import { InfoCircle, ShieldCheck, WarningCircle, Xmark } from 'iconoir-react'

export type HubBadgeTone = 'neutral' | 'success' | 'alert' | 'updating' | 'info' | 'gold'

export function HubBadge({ title, tone = 'neutral', count, total, mobile = false, width }: {
  title: string
  tone?: HubBadgeTone
  count?: number
  total?: number
  mobile?: boolean
  width?: string
}) {
  const resolvedTone = count !== undefined && total !== undefined
    ? total === 0 ? 'updating' : count < total ? 'alert' : 'success'
    : tone
  return <span className={`hub-badge hub-badge--${resolvedTone} ${mobile ? 'is-mobile' : ''}`} title={title} style={{ width }}>
    {count === undefined
      ? <span className="hub-badge-title">{title}</span>
      : <><span className="hub-sr-only">{title}: </span><span className="hub-badge-number">{count}</span>
        {total !== undefined && <span className="hub-badge-total">&thinsp;/&thinsp;{total}</span>}</>}
  </span>
}

export function HubStatus({ children, tone = 'neutral', color }: { children: ReactNode; tone?: HubBadgeTone; color?: string }) {
  return <span className={`hub-status hub-badge--${tone}`}><span aria-hidden="true" style={{ backgroundColor: color }} />{children}</span>
}

export type HubErrorSummaryItem = string | { message: string; field: string }

function focusField(event: MouseEvent<HTMLAnchorElement>, field: string) {
  const target = document.getElementById(field)
  if (!target) return
  event.preventDefault()
  const wrapper = target.closest('.hub-field') ?? target
  wrapper.scrollIntoView({ block: 'center' })
  target.focus({ preventScroll: true })
}

export function HubErrorSummary({ title = 'Please check the highlighted fields.', errors, highlight = 0 }: {
  title?: string
  /** Messages, or `{ message, field }` to link the message to the element id of its field. */
  errors: HubErrorSummaryItem[]
  /** Increment to replay the spinning border, e.g. when a blocked submit is clicked. */
  highlight?: number
}) {
  if (errors.length === 0) return null
  return <div className="hub-error-summary" role="alert">
    {highlight > 0 && <span key={highlight} className="hub-error-summary-ring" aria-hidden="true" />}
    <WarningCircle width={18} height={18} aria-hidden="true" />
    <div>
      <strong>{title}</strong>
      <ul>{errors.map(error => typeof error === 'string'
        ? <li key={error}>{error}</li>
        : <li key={error.field}><a href={`#${error.field}`} onClick={event => focusField(event, error.field)}>{error.message}</a></li>)}
      </ul>
    </div>
  </div>
}

export function HubInfobox({ tone = 'info', children, onDismiss, href, icon, className = '', loading = false }: {
  tone?: 'info' | 'success' | 'warning' | 'error'
  children: ReactNode
  onDismiss?: () => void
  href?: string
  icon?: ReactNode
  className?: string
  loading?: boolean
}) {
  const Icon = tone === 'info' ? InfoCircle : tone === 'success' ? ShieldCheck : WarningCircle
  return <div className={`hub-infobox hub-infobox--${tone} ${className}`} role="status" aria-busy={loading || undefined}>
    <div className="hub-infobox-wrapper">
      {icon ?? <Icon width={18} height={18} aria-hidden="true" />}
      <span className="hub-infobox-text">{href ? <a href={href}>{children}</a> : children}</span>
      {onDismiss && <button type="button" className="hub-close" aria-label="Dismiss message" onClick={onDismiss}>
        <Xmark width={20} height={20} aria-hidden="true" />
      </button>}
    </div>
  </div>
}

export function HubBlockStatus({ tone = 'info', ...props }: {
  tone?: 'info' | 'success' | 'error' | 'loading'; children: ReactNode; onDismiss?: () => void; href?: string
}) {
  return <HubInfobox {...props} tone={tone === 'loading' ? 'info' : tone}
    className={`hub-block-status ${tone === 'loading' ? 'is-loading' : ''}`} loading={tone === 'loading'}
    icon={tone === 'loading' ? <span className="hub-button-spinner" aria-hidden="true" /> : undefined} />
}

export function HubProgress({ value, label }: { value: number; label: string }) {
  const progress = Math.min(100, Math.max(0, value))
  return <div className="hub-progress" role="progressbar" aria-label={label}
    aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
    <span style={{ width: `${progress}%` }} />
  </div>
}

export function HubSpinner({ label = 'Loading' }: { label?: string }) {
  return <div role="status"><span className="hub-sr-only">{label}</span><div className="hub-spinner" /></div>
}

export function HubPlaceholder({ title, description, error = false, children }: {
  title: string
  description: string
  error?: boolean
  children?: ReactNode
}) {
  return <div className={`hub-placeholder ${error ? 'has-error' : ''}`}>
    <h2>{title}</h2><p>{description}</p>{children}
  </div>
}
