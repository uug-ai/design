import { useId, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { MoreHoriz, NavArrowDown } from 'iconoir-react'
import { HubMultiToggle, HubSelect } from './controls'
import { usePopup } from './usePopup'

export type HubMenuItem = {
  id: string
  text: string
  icon?: ReactNode
  disabled?: boolean
  hidden?: boolean
  danger?: boolean
  onSelect: () => void
}

export function HubActionsMenu({ label = 'Actions', items, collapseSingle = true, iconOnly = false }: {
  label?: string; items: HubMenuItem[]; collapseSingle?: boolean; iconOnly?: boolean
}) {
  const visible = items.filter(item => !item.hidden)
  const single = collapseSingle && visible.length === 1
  const popup = usePopup(!visible.length || single)
  const id = useId()
  useLayoutEffect(() => {
    if (popup.open) (popup.panelRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? popup.panelRef.current)?.focus({ preventScroll: true })
  }, [popup.open, popup.panelRef])
  if (!visible.length) return null
  return <div ref={popup.rootRef} className="hub-actions-menu">
    <button ref={popup.triggerRef} type="button" className="hub-button hub-button--outlined"
      disabled={single && visible[0].disabled} aria-label={iconOnly ? label : undefined}
      aria-haspopup={single ? undefined : 'menu'} aria-expanded={single ? undefined : popup.open}
      aria-controls={popup.open ? id : undefined}
      onClick={() => single ? visible[0].onSelect() : popup.setOpen(!popup.open)}
      onKeyDown={event => {
        if (!single && ['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); popup.setOpen(true) }
      }}>
      {iconOnly ? <MoreHoriz width={18} height={18} aria-hidden="true" /> : single
        ? <>{visible[0].icon && <span aria-hidden="true">{visible[0].icon}</span>}{visible[0].text}</>
        : <>{label}<NavArrowDown width={14} height={14} aria-hidden="true" /></>}
    </button>
    {popup.open && <div ref={popup.panelRef} id={id} role="menu" aria-label={label} tabIndex={-1}
      className="hub-popup hub-menu-panel" style={popup.style}
      onKeyDown={event => {
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)'))
        const index = buttons.findIndex(button => button === document.activeElement)
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
          : event.key === 'ArrowDown' ? (index + 1) % buttons.length
            : event.key === 'ArrowUp' ? (index - 1 + buttons.length) % buttons.length : undefined
        if (next !== undefined) { event.preventDefault(); buttons[next]?.focus() }
      }}>
      {visible.map(item => <button key={item.id} type="button" role="menuitem" disabled={item.disabled}
        className={item.danger ? 'is-danger' : ''} onClick={() => {
          popup.setOpen(false)
          popup.triggerRef.current?.focus()
          item.onSelect()
        }}>{item.icon && <span aria-hidden="true">{item.icon}</span>}{item.text}</button>)}
    </div>}
  </div>
}

export function HubControlsPopup({ label = 'Edit actions', items }: { label?: string; items: HubMenuItem[] }) {
  return <HubActionsMenu label={label} items={items} collapseSingle={false} iconOnly />
}

export function HubBreadcrumb({ title, items, actions }: {
  title: string; items: { text: string; href?: string; icon?: ReactNode }[]; actions?: ReactNode
}) {
  return <header className="hub-breadcrumb">
    <div><h2>{title}</h2><nav aria-label="Breadcrumb"><ol>
      {items.map((item, index) => <li key={index} aria-current={index === items.length - 1 ? 'page' : undefined}>
        {item.icon && <span aria-hidden="true">{item.icon}</span>}
        {item.href && index < items.length - 1 ? <a href={item.href}>{item.text}</a> : <span>{item.text}</span>}
      </li>)}
    </ol></nav></div>
    {actions && <div className="hub-row">{actions}</div>}
  </header>
}

export function HubGridToggle({ value, onChange, disabled = false }: {
  value: string; onChange: (value: string) => void; disabled?: boolean
}) {
  return <HubMultiToggle label="Grid layout" value={value} onChange={onChange} disabled={disabled} hideText
    options={[1, 2, 3, 4].map(size => ({ value: String(size), text: `${size} by ${size} grid`,
      icon: <svg width={18} height={18} viewBox="0 0 24 24">{Array.from({ length: size * size }, (_, index) =>
        <rect key={index} x={index % size * 24 / size + 1} y={Math.floor(index / size) * 24 / size + 1}
          width={24 / size - 2} height={24 / size - 2} fill="currentColor" rx={1} />)}</svg>,
    }))} />
}

export function HubAspectRatioToggle({ value, onChange, disabled = false }: {
  value: string; onChange: (value: string) => void; disabled?: boolean
}) {
  return <HubMultiToggle label="Aspect ratio" value={value} onChange={onChange} disabled={disabled}
    options={['16:9', '4:3', '1:1', '9:16'].map(ratio => ({ value: ratio, text: ratio,
      icon: <span className="hub-aspect-glyph" style={{ aspectRatio: ratio.replace(':', '/') }} />,
    }))} />
}

export function HubLanguageSwitcher({ value, onChange, disabled = false }: {
  value: string; onChange: (value: string) => void; disabled?: boolean
}) {
  return <HubSelect label="Language" variant="filter" value={value} onChange={onChange} disabled={disabled} searchable={false}
    options={[{ value: 'en', text: 'English' }, { value: 'nl', text: 'Nederlands' },
      { value: 'fr', text: 'Français' }, { value: 'de', text: 'Deutsch' }, { value: 'ar', text: 'العربية' }]} />
}
