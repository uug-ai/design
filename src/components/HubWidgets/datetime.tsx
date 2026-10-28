import { useId, useLayoutEffect, useState } from 'react'
import { Calendar, NavArrowLeft, NavArrowRight, Xmark } from 'iconoir-react'
import { HubInput } from './controls'
import { usePopup } from './usePopup'
import { addDays, addMonths, calendarDays, dateKey, parseDate } from './widget-utils'

export function HubDateInput({ label, value, onChange, min, max, error, disabled = false, readOnly = false }: {
  label: string; value: string; onChange: (value: string) => void; min?: string; max?: string
  error?: string; disabled?: boolean; readOnly?: boolean
}) {
  return <HubInput type="date" label={label} value={value} min={min} max={max} error={error} disabled={disabled}
    readOnly={readOnly} onChange={event => onChange(event.target.value)} />
}

export function HubDatePicker({ label, value, onChange, min, max, availableDates = [], disableUnavailable = false,
  clearable = false, disabled = false, error, appearance = 'field', locale = 'en-GB',
}: {
  label: string; value: string; onChange: (value: string) => void; min?: string; max?: string
  availableDates?: string[]; disableUnavailable?: boolean; clearable?: boolean; disabled?: boolean
  error?: string; appearance?: 'field' | 'filter' | 'button'; locale?: string
}) {
  for (const date of [value, min, max, ...availableDates]) if (date) parseDate(date)
  if (min && max && min > max) throw new RangeError('Minimum date must not follow maximum date')
  const initial = value || (min && dateKey(new Date()) < min ? min : max && dateKey(new Date()) > max ? max : dateKey(new Date()))
  const [month, setMonth] = useState(initial)
  const [active, setActive] = useState(initial)
  const popup = usePopup(disabled, 296)
  const id = useId()
  const enabled = (date: string) => (!min || date >= min) && (!max || date <= max) && (!disableUnavailable || availableDates.includes(date))
  const days = calendarDays(month)
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'full' })
  const monthLabel = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(parseDate(month))
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const open = () => {
    const first = enabled(initial) ? initial : availableDates.filter(enabled).sort()[0] ?? initial
    setMonth(first)
    setActive(first)
    popup.setOpen(!popup.open)
  }
  const close = () => { popup.setOpen(false); popup.triggerRef.current?.focus() }
  useLayoutEffect(() => {
    if (popup.open) popup.panelRef.current?.querySelector<HTMLButtonElement>(`[data-date="${active}"]:not(:disabled)`)?.focus({ preventScroll: true })
  }, [popup.open, popup.panelRef, active])

  const navigate = (direction: number) => {
    const next = addMonths(`${month.slice(0, 7)}-01`, direction)
    setMonth(next)
    setActive(calendarDays(next).find(day => day.slice(0, 7) === next.slice(0, 7) && enabled(day)) ?? next)
  }
  const nextMonth = addMonths(`${month.slice(0, 7)}-01`, 1)
  return <div ref={popup.rootRef} className={`hub-datepicker hub-datepicker--${appearance} ${error ? 'has-error' : ''}`}>
    {appearance === 'field' && <span className="hub-select-label">{label}</span>}
    <div className="hub-selection-trigger">
      <button ref={popup.triggerRef} type="button" className={appearance === 'button' ? 'hub-button hub-button--outlined' : 'hub-select-trigger'}
        disabled={disabled} aria-label={`${label}: ${value || 'Select date'}`} aria-haspopup="dialog"
        aria-expanded={popup.open} aria-controls={popup.open ? id : undefined} aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined} onClick={open}>
        <Calendar width={18} height={18} aria-hidden="true" />
        <span>{value ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(parseDate(value)) : 'Select date'}</span>
      </button>
      {value && clearable && <button type="button" className="hub-selection-clear" disabled={disabled}
        aria-label={`Clear ${label}`} onClick={() => { onChange(''); popup.triggerRef.current?.focus() }}>
        <Xmark width={16} height={16} aria-hidden="true" /></button>}
    </div>
    {error && <span id={`${id}-error`} className="hub-field-error">{error}</span>}
    {popup.open && <div ref={popup.panelRef} id={id} role="dialog" aria-label={`Choose ${label}`}
      className="hub-popup hub-calendar" style={popup.style}>
      <div className="hub-calendar-header">
        <button type="button" aria-label="Previous month" disabled={!!min && addDays(`${month.slice(0, 7)}-01`, -1) < min}
          onClick={() => navigate(-1)}><NavArrowLeft width={18} height={18} aria-hidden="true" /></button>
        <strong aria-live="polite">{monthLabel}</strong>
        <button type="button" aria-label="Next month" disabled={!!max && nextMonth > max}
          onClick={() => navigate(1)}><NavArrowRight width={18} height={18} aria-hidden="true" /></button>
      </div>
      <div className="hub-calendar-weekdays" aria-hidden="true">
        {days.slice(0, 7).map(day => <span key={day}>{weekday.format(parseDate(day))}</span>)}
      </div>
      <div role="grid" aria-label={monthLabel} className="hub-calendar-grid">
        {Array.from({ length: 6 }, (_, row) => <div role="row" key={row}>
          {days.slice(row * 7, row * 7 + 7).map(day => <button key={day} type="button" role="gridcell" data-date={day}
            tabIndex={active === day ? 0 : -1} disabled={!enabled(day)} aria-label={formatter.format(parseDate(day))}
            aria-selected={value === day} aria-current={day === dateKey(new Date()) ? 'date' : undefined}
            className={`${day.slice(0, 7) !== month.slice(0, 7) ? 'is-outside' : ''} ${availableDates.includes(day) ? 'has-recordings' : ''}`}
            onFocus={() => setActive(day)} onClick={() => { onChange(day); close() }}
            onKeyDown={event => {
              const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key]
              let target: string | undefined
              if (offset !== undefined) target = addDays(day, offset)
              else if (event.key === 'PageUp') target = addMonths(day, -1)
              else if (event.key === 'PageDown') target = addMonths(day, 1)
              else if (event.key === 'Home') target = days[row * 7]
              else if (event.key === 'End') target = days[row * 7 + 6]
              if (!target) return
              event.preventDefault()
              if (min && target < min) target = min
              if (max && target > max) target = max
              if (!enabled(target) && disableUnavailable) {
                const candidates = availableDates.filter(enabled).sort()
                const requested = target
                target = requested > day ? candidates.find(date => date >= requested) : candidates.reverse().find(date => date <= requested)
              }
              if (!target) return
              if (enabled(target)) { setActive(target); setMonth(target) }
            }}>{new Intl.NumberFormat(locale).format(parseDate(day).getDate())}</button>)}
        </div>)}
      </div>
      {disableUnavailable && !days.some(enabled) && <p role="status">No available dates in this month.</p>}
    </div>}
  </div>
}

export function HubTimeSpinner({ label, value, onChange, disabled = false, embedded = false, min = 0, max = 86399 }: {
  label: string; value: number; onChange: (value: number) => void; disabled?: boolean; embedded?: boolean; min?: number; max?: number
}) {
  const [inputError, setInputError] = useState('')
  if (![value, min, max].every(Number.isInteger) || min < 0 || max > 86399 || min > max || value < min || value > max) {
    throw new RangeError('Time spinner requires whole seconds within its min/max bounds and one day')
  }
  return <div><div className={`hub-time-spinner ${embedded ? 'is-embedded' : ''}`} role="group" aria-label={label}>
    {[{ name: 'Hours', unit: 3600, max: 23 }, { name: 'Minutes', unit: 60, max: 59 }, { name: 'Seconds', unit: 1, max: 59 }].map((segment, index) =>
      <span key={segment.name}>{index > 0 && <span aria-hidden="true">:</span>}
        <input type="number" aria-label={`${label} ${segment.name.toLowerCase()}`} disabled={disabled} min={0} max={segment.max}
          value={String(Math.floor(value / segment.unit) % (segment.max + 1)).padStart(2, '0')}
          onChange={event => {
            const next = event.target.valueAsNumber
            if (!Number.isInteger(next)) {
              setInputError(`Enter a whole number for ${segment.name.toLowerCase()}.`)
              return
            }
            setInputError('')
            const previous = Math.floor(value / segment.unit) % (segment.max + 1)
            onChange(Math.max(min, Math.min(max, value + (Math.min(segment.max, Math.max(0, next)) - previous) * segment.unit)))
          }} />
      </span>)}
  </div>{inputError && <p className="hub-field-error" role="alert">{inputError}</p>}</div>
}
