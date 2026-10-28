import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { InfoCircle, ShieldCheck, WarningCircle, Xmark } from 'iconoir-react'
import { contrastText } from './widget-utils'

export type HubToastItem = {
  id: string
  title: string
  message?: string
  kind: 'success' | 'info' | 'warning' | 'error'
  duration?: number
  action?: { text: string; onClick: () => void }
}

function Toast({ item, onDismiss }: { item: HubToastItem; onDismiss: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const duration = item.duration ?? 5000
  const remaining = useRef(duration)
  useEffect(() => { remaining.current = duration }, [duration])
  useEffect(() => {
    if (duration === 0 || hovered || focused) return
    const start = Date.now()
    const timer = window.setTimeout(() => onDismiss(item.id), Math.max(0, remaining.current))
    return () => { window.clearTimeout(timer); remaining.current = Math.max(0, remaining.current - (Date.now() - start)) }
  }, [duration, hovered, focused, onDismiss, item.id])
  if (!Number.isFinite(duration) || duration < 0) throw new RangeError('Toast duration must be a non-negative number of milliseconds')
  const Icon = item.kind === 'success' ? ShieldCheck : item.kind === 'info' ? InfoCircle : WarningCircle
  return <div className={`hub-toast hub-toast--${item.kind}`} role="status"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <Icon className="hub-toast-icon" width={22} height={22} aria-hidden="true" />
    <div className="hub-toast-body"><strong>{item.title}</strong>
      {item.message && <p>{item.message}</p>}
      {item.action && <button type="button" className="hub-toast-action" onClick={item.action.onClick}>{item.action.text}</button>}
    </div>
    <button type="button" className="hub-toast-close" aria-label={`Dismiss ${item.title}`} onClick={() => onDismiss(item.id)}>
      <Xmark width={14} height={14} aria-hidden="true" /></button>
  </div>
}

export function HubToastContainer({ items, onDismiss, inline = false }: {
  items: HubToastItem[]; onDismiss: (id: string) => void; inline?: boolean
}) {
  return <div className={`hub-toasts ${inline ? 'is-inline' : ''}`} role="region" aria-label="Notifications">
    {items.map(item => <Toast key={item.id} item={item} onDismiss={onDismiss} />)}
  </div>
}

export function HubLabelTag({ children, color }: { children: ReactNode; color: string }) {
  return <span className="hub-label-tag" style={{ backgroundColor: color, color: contrastText(color), borderColor: `${color}80` }}>{children}</span>
}

export function HubIdentityBadge({ name, color, variant = 'site', transparent = false }: {
  name: string; color: string; variant?: 'site' | 'group' | 'camera'; transparent?: boolean
}) {
  contrastText(color)
  const initials = name.trim().split(/\s+/).slice(0, 2).map(part => part[0] ?? '').join('').toLocaleUpperCase()
  return <span role="img" aria-label={name} title={name} className={`hub-identity-badge hub-identity-badge--${variant}`}
    style={{ borderColor: color, backgroundColor: variant === 'camera' ? color : transparent || variant === 'group' ? `${color}20` : undefined }}>
    {variant !== 'camera' && initials}</span>
}
