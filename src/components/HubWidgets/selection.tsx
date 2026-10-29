import { useId, useLayoutEffect, useState } from 'react'
import { NavArrowDown, Search, Xmark } from 'iconoir-react'
import type { HubOption } from './controls'
import { usePopup } from './usePopup'

type SelectionProps = {
  label: string
  options: HubOption[]
  disabled?: boolean
  readOnly?: boolean
  error?: string
  variant?: 'field' | 'filter'
  size?: 'small' | 'medium' | 'large'
  searchable?: boolean
  clearable?: boolean
  loading?: boolean
  loadingMore?: boolean
}

function Selection({ label, options, value, onChange, multiple = false, locked = [], disabled = false,
  readOnly = false, error, variant = 'field', size = 'medium', searchable = true,
  clearable = false, loading = false, loadingMore = false,
}: SelectionProps & {
  value: string[]; onChange: (value: string[]) => void; multiple?: boolean; locked?: string[]
}) {
  const [search, setSearch] = useState('')
  const popup = usePopup(disabled || readOnly || loading)
  const id = useId()
  const selected = [...new Set([...value, ...locked])]
  const selectedOptions = options.filter(option => selected.includes(option.value))
  const filtered = options.filter(option => option.text.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  const text = selectedOptions.length ? selectedOptions[0].text : 'Select'
  const close = () => { popup.setOpen(false); popup.triggerRef.current?.focus() }
  useLayoutEffect(() => {
    if (popup.open) popup.panelRef.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus({ preventScroll: true })
  }, [popup.open, popup.panelRef])
  return <div ref={popup.rootRef} className={`hub-select hub-select--${variant} hub-select--${size} ${error ? 'has-error' : ''}`}>
    {variant === 'field' && <span id={`${id}-label`} className="hub-select-label">{label}{readOnly ? ' (readonly)' : ''}</span>}
    <div className="hub-selection-trigger">
      <button ref={popup.triggerRef} type="button" className="hub-select-trigger" disabled={disabled || loading}
        aria-label={`${label}: ${text}${selectedOptions.length > 1 ? ` and ${selectedOptions.length - 1} more` : ''}`}
        aria-readonly={readOnly || undefined} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
        aria-expanded={popup.open} aria-haspopup="dialog" aria-controls={popup.open ? `${id}-popup` : undefined}
        onClick={() => { if (!readOnly) { popup.setOpen(!popup.open); setSearch('') } }}>
        {loading && <span className="hub-button-spinner" aria-hidden="true" />}
        <span>{text}{selectedOptions.length > 1 && <span className="hub-selection-count">+{selectedOptions.length - 1}</span>}</span>
        <NavArrowDown width={12} height={12} aria-hidden="true" />
      </button>
      {clearable && selected.some(item => !locked.includes(item)) && <button type="button" className="hub-selection-clear"
        disabled={disabled || readOnly || loading} aria-label={`Clear ${label}`}
        onClick={() => { onChange(locked); popup.triggerRef.current?.focus() }}><Xmark width={16} height={16} aria-hidden="true" /></button>}
    </div>
    {error && <span id={`${id}-error`} className="hub-field-error">{error}</span>}
    {popup.open && <div ref={popup.panelRef} id={`${id}-popup`} className="hub-select-dropdown hub-popup"
      style={popup.style} role="dialog" aria-label={`Choose ${label}`}>
      {searchable && <div className="hub-select-search"><Search width={18} height={18} aria-hidden="true" />
        <input aria-label={`Search ${label.toLowerCase()}`} placeholder="Search" value={search} onChange={event => setSearch(event.target.value)} />
      </div>}
      <fieldset><legend className="hub-sr-only">{label}</legend>
        {filtered.map(option => <label key={option.value}
          className={`hub-select-option ${selected.includes(option.value) ? 'is-selected' : ''}`}>
          {option.icon && <span aria-hidden="true">{option.icon}</span>}<span>{option.text}</span>
          <input type={multiple ? 'checkbox' : 'radio'} name={id} value={option.value}
            checked={selected.includes(option.value)} disabled={option.disabled || locked.includes(option.value)}
            onChange={() => {
              onChange(multiple ? selected.includes(option.value) ? selected.filter(item => item !== option.value) : [...selected, option.value] : [option.value])
              if (!multiple) close()
            }} />
        </label>)}
        {!filtered.length && <p className="hub-select-empty" role="status">No matching options</p>}
      </fieldset>
      {loadingMore && <p className="hub-select-empty" role="status">Loading more options...</p>}
      {multiple && <button type="button" className="hub-popup-done" onClick={close}>Done</button>}
    </div>}
  </div>
}

export function HubSelect({ value, onChange, ...props }: SelectionProps & { value: string; onChange: (value: string) => void }) {
  return <Selection {...props} value={value ? [value] : []} onChange={selected => onChange(selected[0] ?? '')} />
}

export function HubMultiSelect(props: SelectionProps & {
  value: string[]; onChange: (value: string[]) => void; locked?: string[]
}) {
  return <Selection {...props} multiple />
}
