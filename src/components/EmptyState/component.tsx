import type { ReactNode } from 'react'
import './component.css'

export interface EmptyStateProps {
  title: string
  description?: string
  variant?: 'empty' | 'error'
  /** Decorative illustration. The title must convey its meaning without it. */
  icon?: ReactNode
  headingLevel?: 'h2' | 'h3'
  action?: { label: string; onClick: () => void; disabled?: boolean }
}

export default function EmptyState({
  title,
  description,
  variant = 'empty',
  icon,
  headingLevel: Heading = 'h3',
  action,
}: EmptyStateProps) {
  return (
    <div className={`empty-state empty-state--${variant}`}>
      {icon && <span className="empty-state__icon" aria-hidden="true">{icon}</span>}
      <Heading className="empty-state__title">{title}</Heading>
      {description && <p className="empty-state__description">{description}</p>}
      {action && (
        <button type="button" className="empty-state__action" onClick={action.onClick} disabled={action.disabled}>
          {action.label}
        </button>
      )}
    </div>
  )
}
