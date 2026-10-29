import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react'
import { Clock, NavArrowDown, Xmark } from 'iconoir-react'
import { HubButton } from './controls'

type ModalGestureMode = 'move' | 'e' | 's' | 'se'

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
  centered = false, theaterMode = false, draggable = false, resizable = false, inline = false,
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
  inline?: boolean
  confirmCloseWhenDirty?: boolean
  isDirty?: boolean | (() => boolean)
  confirmCloseMessage?: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const moveHelpId = useId()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [geometry, setGeometry] = useState<CSSProperties>({})
  const [desktop, setDesktop] = useState(() => window.innerWidth > 767)
  const [gestureMode, setGestureMode] = useState<ModalGestureMode | null>(null)
  const gesture = useRef<{ pointerId: number; x: number; y: number; rect: DOMRect; mode: ModalGestureMode } | null>(null)
  const backdropDown = useRef(false)
  const canManipulate = open && desktop && !inline && !fullWidth && !theaterMode
  const canDrag = draggable && canManipulate
  const canResize = resizable && canManipulate
  useEffect(() => {
    const viewport = window.matchMedia('(min-width: 768px)')
    const update = () => setDesktop(viewport.matches)
    viewport.addEventListener('change', update)
    update()
    return () => viewport.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!gestureMode) return
    if (!(gestureMode === 'move' ? canDrag : canResize)) {
      gesture.current = null
      setGestureMode(null)
      return
    }
    const body = document.body
    const previousSelection = body.style.userSelect
    const previousCursor = body.style.cursor
    body.style.userSelect = 'none'
    body.style.cursor = gestureMode === 'move' ? 'grabbing' : gestureMode === 'e' ? 'ew-resize' : gestureMode === 's' ? 'ns-resize' : 'nwse-resize'
    return () => {
      body.style.userSelect = previousSelection
      body.style.cursor = previousCursor
    }
  }, [gestureMode, canDrag, canResize])
  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !inline && dialog && !dialog.open) dialog.showModal()
    if (!open) {
      if (dialog?.open) dialog.close()
      setConfirmOpen(false)
      setGeometry({})
      gesture.current = null
      setGestureMode(null)
    }
  }, [open, inline])
  useEffect(() => {
    if (!open || inline) return
    const reset = () => { setGeometry({}); gesture.current = null; setGestureMode(null) }
    window.addEventListener('resize', reset)
    return () => window.removeEventListener('resize', reset)
  }, [open, inline])
  const finishGesture = () => { gesture.current = null; setGestureMode(null) }
  const requestClose = () => {
    finishGesture()
    if (confirmCloseWhenDirty && (typeof isDirty === 'function' ? isDirty() : isDirty)) setConfirmOpen(true)
    else onClose()
  }
  const updateGeometry = (rect: DOMRect, x: number, y: number, mode: ModalGestureMode) => {
    const padding = 8
    const maxWidth = window.innerWidth - rect.left - padding
    const maxHeight = window.innerHeight - rect.top - padding
    const width = mode === 'e' || mode === 'se' ? Math.min(maxWidth, Math.max(Math.min(500, maxWidth), rect.width + x)) : rect.width
    const height = mode === 's' || mode === 'se' ? Math.min(maxHeight, Math.max(Math.min(360, maxHeight), rect.height + y)) : rect.height
    setGeometry(previous => ({
      ...previous,
      margin: 0, right: 'auto', bottom: 'auto',
      left: mode === 'move' ? Math.max(padding, Math.min(window.innerWidth - rect.width - padding, rect.left + x)) : rect.left,
      top: mode === 'move' ? Math.max(padding, Math.min(window.innerHeight - rect.height - padding, rect.top + y)) : rect.top,
      width, height, maxHeight: mode === 'move' ? previous.maxHeight : 'none',
    }))
  }
  const begin = (event: PointerEvent<HTMLElement>, mode: ModalGestureMode) => {
    if (!dialogRef.current || event.button !== 0 || !(mode === 'move' ? canDrag : canResize)) return
    if (mode === 'move' && event.target instanceof Element && event.target.closest('button')) return
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    gesture.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, rect: dialogRef.current.getBoundingClientRect(), mode }
    setGestureMode(mode)
  }
  const keyboardGeometry = (event: KeyboardEvent<HTMLElement>, mode: ModalGestureMode) => {
    if (!dialogRef.current || event.target !== event.currentTarget || !(mode === 'move' ? canDrag : canResize) ||
      !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
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
  const content = <>
    <header className="hub-modal-header" role={canDrag ? 'group' : undefined}
      tabIndex={canDrag ? 0 : undefined} aria-label={canDrag ? 'Move dialog' : undefined}
      aria-describedby={canDrag ? moveHelpId : undefined}
      onPointerDown={canDrag ? event => begin(event, 'move') : undefined}
      onKeyDown={canDrag ? event => keyboardGeometry(event, 'move') : undefined}>
      <h2 id={titleId}>{title}</h2>
      {canDrag && <span id={moveHelpId} className="hub-sr-only">Drag the header or use arrow keys to move. Hold Shift for larger steps.</span>}
      <button type="button" className="hub-close" aria-label={inline ? 'Close preview' : 'Close dialog'} onClick={requestClose}>
        <Xmark width={18} height={18} aria-hidden="true" />
      </button>
    </header>
    <div className="hub-modal-body">{children}</div>
    {actions && <footer className="hub-modal-actions">{typeof actions === 'function' ? actions(requestClose) : actions}</footer>}
    {canResize && <>
      <button type="button" className="hub-modal-resize hub-modal-resize--e" aria-label="Resize dialog horizontally"
        title="Drag the right edge or use arrow keys to resize" onPointerDown={event => begin(event, 'e')}
        onKeyDown={event => keyboardGeometry(event, 'e')} />
      <button type="button" className="hub-modal-resize hub-modal-resize--s" aria-label="Resize dialog vertically"
        title="Drag the bottom edge or use arrow keys to resize" onPointerDown={event => begin(event, 's')}
        onKeyDown={event => keyboardGeometry(event, 's')} />
      <button type="button" className="hub-modal-resize hub-modal-resize--se" aria-label="Resize dialog"
        title="Drag to resize, double-click to reset" onPointerDown={event => begin(event, 'se')}
        onKeyDown={event => keyboardGeometry(event, 'se')} onDoubleClick={() => setGeometry({})} />
    </>}
    {confirmOpen && <HubModal open={open} title="Discard changes?" confirmation onClose={() => setConfirmOpen(false)}
      actions={<><HubButton variant="neutral" onClick={() => setConfirmOpen(false)}>Keep editing</HubButton>
        <HubButton variant="alert" onClick={() => { setConfirmOpen(false); onClose() }}>Discard and close</HubButton></>}>
      <p>{confirmCloseMessage}</p>
    </HubModal>}
  </>
  if (inline) return open ? <section className="hub-modal is-inline" aria-labelledby={titleId}>{content}</section> : null
  return <dialog ref={dialogRef} style={geometry}
    className={`hub-modal ${confirmation ? 'is-confirmation' : ''} ${centered ? 'is-centered' : ''} ${fullWidth ? 'is-full-width' : ''} ${theaterMode ? 'is-theater' : ''} ${canDrag ? 'is-draggable' : ''} ${canResize ? 'is-resizable' : ''} ${gestureMode === 'move' ? 'is-dragging' : gestureMode ? 'is-resizing' : ''}`}
    aria-labelledby={titleId} onCancel={event => { event.preventDefault(); requestClose() }}
    onPointerDown={event => { backdropDown.current = event.target === event.currentTarget && outsideDialog(event) }}
    onPointerMove={event => {
      const current = gesture.current
      if (current && event.pointerId === current.pointerId) updateGeometry(current.rect, event.clientX - current.x, event.clientY - current.y, current.mode)
    }} onPointerUp={event => {
      if (backdropDown.current && !gesture.current && outsideDialog(event)) requestClose()
      backdropDown.current = false
      finishGesture()
    }} onPointerCancel={() => { backdropDown.current = false; finishGesture() }} onLostPointerCapture={finishGesture}>
    {content}
  </dialog>
}
