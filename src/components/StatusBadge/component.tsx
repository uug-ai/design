import './component.css'

export type StatusBadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

export interface StatusBadgeProps {
  /** Localized status text. Always visible, including on small screens. */
  label: string
  tone?: StatusBadgeTone
}

/** Read-only status, not a button or an automatically announced live region. */
export default function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${tone}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      <span className="status-badge__label">{label}</span>
    </span>
  )
}
