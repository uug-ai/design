import { useId, type ReactNode } from 'react'
import { Xmark } from 'iconoir-react'
import HubIcon from '../html/HubIcon'
import './component.css'

export type NoticeTone = 'info' | 'success' | 'warning' | 'danger'

export type NoticeProps = {
  title: string
  children?: ReactNode
  tone?: NoticeTone
  /** Static by default. Opt in only for messages inserted after a user action. */
  announce?: 'off' | 'polite' | 'assertive'
} & (
  | { onDismiss: () => void; dismissLabel: string }
  | { onDismiss?: never; dismissLabel?: never }
)

const icons = { info: 'info', success: 'success', warning: 'warning', danger: 'warning' } as const

export default function Notice({
  title,
  children,
  tone = 'info',
  announce = 'off',
  onDismiss,
  dismissLabel,
}: NoticeProps) {
  const titleId = useId()

  return (
    <div
      className={`notice notice--${tone}`}
      role={announce === 'assertive' ? 'alert' : announce === 'polite' ? 'status' : undefined}
      aria-labelledby={announce === 'off' ? undefined : titleId}
    >
      <div className="notice__wrapper">
      <HubIcon className="notice__icon" name={icons[tone]} />
      <div className="notice__body">
        <strong id={titleId} className="notice__title">{title}</strong>
        {children && <div className="notice__content">{children}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="notice__dismiss" aria-label={dismissLabel} onClick={onDismiss}>
          <Xmark width={20} height={20} aria-hidden="true" />
        </button>
      )}
      </div>
    </div>
  )
}
