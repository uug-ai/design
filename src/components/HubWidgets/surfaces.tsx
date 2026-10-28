import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react'
import { Clock, NavArrowDown, Xmark } from 'iconoir-react'
import { HubButton } from './controls'

export function HubCard({ title, subtitle, percentage, unit = '%', footer, action, icon }: {
  title: string
  subtitle: string
  percentage?: number
  unit?: string
  footer?: string
  action?: { text: string; onClick: () => void }
  icon?: ReactNode
}) {
  return <section className="hub-card">
    <div className="hub-card-title">
      <div><h2>{title}</h2><p>{subtitle}</p></div>
      {icon && <div className="hub-card-image" aria-hidden="true">{icon}</div>}
      {percentage !== undefined && <div className="hub-card-percentage"><span>{percentage}</span>{unit}</div>}
    </div>
    {footer && <div className="hub-card-footer"><span>{footer}</span>
      {action && <button type="button" onClick={action.onClick}>{action.text}</button>}
    </div>}
  </section>
}

export function HubBlock({ title, children, footer, headerActions, expandable = false, defaultExpanded = true }: {
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  expandable?: boolean
  defaultExpanded?: boolean
  headerActions?: ReactNode
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const bodyId = useId()
  const showBody = !expandable || expanded
  return <section className={`hub-block ${showBody ? '' : 'is-collapsed'}`}>
    <header className="hub-block-header">
      {expandable ? <button type="button" className="hub-block-toggle" aria-expanded={showBody} aria-controls={bodyId}
        onClick={() => setExpanded(!expanded)}>
        <span>{title}</span><NavArrowDown width={18} height={18} aria-hidden="true" />
      </button> : <span>{title}</span>}
      {headerActions && <div className="hub-row">{headerActions}</div>}
    </header>
    <div id={bodyId} className="hub-block-body" hidden={!showBody}>{children}</div>
    {footer && <footer className="hub-block-footer">{footer}</footer>}
  </section>
}

export function HubKpi({ value, total, unit, footer, change, regress, duration, count, mode = 'value', overlay = false, loading = false }: {
  value: number
  total?: number
  unit?: string
  footer: string
  change?: number
  loading?: boolean
  regress?: number
  duration?: string
  count?: number
  mode?: 'value' | 'dwell' | 'counting' | 'occupancy'
  overlay?: boolean
}) {
  if ((mode === 'dwell' || mode === 'occupancy') && !duration) throw new Error('Dwell and occupancy KPIs require a formatted duration')
  return <section className={`hub-kpi ${loading ? 'is-loading' : ''} ${overlay ? 'is-overlay' : ''}`} aria-busy={loading || undefined} aria-label={footer}>
    <div className="hub-kpi-title">
      {loading ? <span className="hub-sr-only">Loading {footer}</span> : <div>
        <div>{mode === 'dwell' || mode === 'occupancy' ? duration : value}<span className="hub-kpi-unit">{total !== undefined ? `/\u2009${total}` : unit}</span></div>
        {count !== undefined && <div className="hub-kpi-count">(+{count})</div>}
        {change !== undefined && <div className={`hub-kpi-change ${change < 0 ? 'is-negative' : ''}`}>
          {change >= 0 ? '+' : ''}{change}
        </div>}
        {regress !== undefined && <div className="hub-kpi-change is-negative">-{Math.abs(regress)}</div>}
      </div>}
    </div>
    <div className="hub-kpi-footer">{mode === 'dwell' && <Clock width={18} height={18} aria-hidden="true" />}{footer}</div>
  </section>
}

export function HubModal({ open, title, children, actions, onClose, confirmation = false, fullWidth = false,
  centered = false, theaterMode = false, draggable = false, resizable = false,
  confirmCloseWhenDirty = false, isDirty = false, confirmCloseMessage = 'You have unsaved changes. Discard them?',
}: {
  open: boolean
  title: string
  children: ReactNode
  actions?: ReactNode | ((requestClose: () => void) => ReactNode)
  onClose: () => void
  confirmation?: boolean
  fullWidth?: boolean
  centered?: boolean
  theaterMode?: boolean
  draggable?: boolean
  resizable?: boolean
  confirmCloseWhenDirty?: boolean
  isDirty?: boolean | (() => boolean)
  confirmCloseMessage?: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [geometry, setGeometry] = useState<CSSProperties>({})
  const gesture = useRef<{ x: number; y: number; rect: DOMRect; mode: 'move' | 'resize' } | null>(null)
  const backdropDown = useRef(false)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open) {
      if (dialog.open) dialog.close()
      setConfirmOpen(false)
      setGeometry({})
      gesture.current = null
    }
  }, [open])
  useEffect(() => {
    if (!open) return
    const reset = () => { setGeometry({}); gesture.current = null }
    window.addEventListener('resize', reset)
    return () => window.removeEventListener('resize', reset)
  }, [open])
  const requestClose = () => {
    if (confirmCloseWhenDirty && (typeof isDirty === 'function' ? isDirty() : isDirty)) setConfirmOpen(true)
    else onClose()
  }
  const updateGeometry = (rect: DOMRect, x: number, y: number, mode: 'move' | 'resize') => {
    const minWidth = Math.min(500, window.innerWidth - 24)
    const minHeight = Math.min(360, window.innerHeight - 24)
    const width = Math.min(window.innerWidth - rect.left - 12, Math.max(minWidth, rect.width + x))
    const height = Math.min(window.innerHeight - rect.top - 12, Math.max(minHeight, rect.height + y))
    setGeometry({
      margin: 0, right: 'auto', bottom: 'auto',
      left: mode === 'move' ? Math.max(12, Math.min(window.innerWidth - rect.width - 12, rect.left + x)) : rect.left,
      top: mode === 'move' ? Math.max(12, Math.min(window.innerHeight - rect.height - 12, rect.top + y)) : rect.top,
      width: mode === 'resize' ? width : rect.width, height: mode === 'resize' ? height : rect.height,
    })
  }
  const begin = (event: PointerEvent<HTMLElement>, mode: 'move' | 'resize') => {
    if (!dialogRef.current) return
    event.currentTarget.setPointerCapture(event.pointerId)
    gesture.current = { x: event.clientX, y: event.clientY, rect: dialogRef.current.getBoundingClientRect(), mode }
  }
  const keyboardGeometry = (event: KeyboardEvent<HTMLElement>, mode: 'move' | 'resize') => {
    if (!dialogRef.current || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    const amount = event.shiftKey ? 50 : 10
    updateGeometry(dialogRef.current.getBoundingClientRect(),
      event.key === 'ArrowRight' ? amount : event.key === 'ArrowLeft' ? -amount : 0,
      event.key === 'ArrowDown' ? amount : event.key === 'ArrowUp' ? -amount : 0, mode)
  }
  const outsideDialog = (event: PointerEvent<HTMLDialogElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom
  }
  return <><dialog ref={dialogRef} style={geometry}
    className={`hub-modal ${confirmation ? 'is-confirmation' : ''} ${centered ? 'is-centered' : ''} ${fullWidth ? 'is-full-width' : ''} ${theaterMode ? 'is-theater' : ''} ${resizable ? 'is-resizable' : ''}`}
    aria-labelledby={titleId} onCancel={event => { event.preventDefault(); requestClose() }}
    onPointerDown={event => { backdropDown.current = event.target === event.currentTarget && outsideDialog(event) }}
    onPointerMove={event => {
      const current = gesture.current
      if (current) updateGeometry(current.rect, event.clientX - current.x, event.clientY - current.y, current.mode)
    }} onPointerUp={event => {
      if (backdropDown.current && !gesture.current && outsideDialog(event)) requestClose()
      backdropDown.current = false
      gesture.current = null
    }} onPointerCancel={() => { backdropDown.current = false; gesture.current = null }}>
    <header className="hub-modal-header">
      <h2 id={titleId}>{title}</h2>
      {draggable && !theaterMode && <button type="button" className="hub-modal-move" aria-label="Move dialog"
        title="Drag or use arrow keys to move" onPointerDown={event => begin(event, 'move')}
        onKeyDown={event => keyboardGeometry(event, 'move')}>Move</button>}
      <button type="button" className="hub-close" aria-label="Close dialog" onClick={requestClose}>
        <Xmark width={18} height={18} aria-hidden="true" />
      </button>
    </header>
    <div className="hub-modal-body">{children}</div>
    {actions && <footer className="hub-modal-actions">{typeof actions === 'function' ? actions(requestClose) : actions}</footer>}
    {resizable && !theaterMode && <button type="button" className="hub-modal-resize" aria-label="Resize dialog"
      title="Drag or use arrow keys to resize; double-click to reset" onPointerDown={event => begin(event, 'resize')}
      onKeyDown={event => keyboardGeometry(event, 'resize')} onDoubleClick={() => setGeometry({})}>Resize</button>}
    {confirmOpen && <HubModal open={open} title="Discard changes?" confirmation onClose={() => setConfirmOpen(false)}
      actions={<><HubButton variant="neutral" onClick={() => setConfirmOpen(false)}>Keep editing</HubButton>
        <HubButton variant="alert" onClick={() => { setConfirmOpen(false); onClose() }}>Discard and close</HubButton></>}>
      <p>{confirmCloseMessage}</p>
    </HubModal>}
  </dialog></>
}
