import { Fragment, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { MinusCircle, PlusCircle } from 'iconoir-react'
import { HubButton } from './controls'
import { formatMinutes, nextSegment, updateScheduleDay, updateSegment, validateSchedule, validateSegments } from './widget-utils'
import type { HubRangeSegment, HubScheduleDay } from './widget-utils'

export function HubRangeSlider({ label, value, onChange, disabled = false, maxSegments = 2,
  step = 15, minDuration = 1, defaultDuration = 60,
}: {
  label: string; value: HubRangeSegment[]; onChange: (segments: HubRangeSegment[]) => void
  disabled?: boolean; maxSegments?: number; step?: number; minDuration?: number; defaultDuration?: number
}) {
  validateSegments(value, minDuration)
  if (!Number.isInteger(step) || step < 1 || !Number.isInteger(maxSegments) || maxSegments < 0 || defaultDuration < minDuration) {
    throw new RangeError('Invalid range slider limits')
  }
  const [selected, setSelected] = useState(0)
  const [inputError, setInputError] = useState('')
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ index: number; handle: 'start' | 'end' | 'move'; x: number; initial: HubRangeSegment[] } | null>(null)
  const available = nextSegment(value, defaultDuration)
  const selectedIndex = Math.min(selected, Math.max(0, value.length - 1))
  const startDrag = (event: PointerEvent<HTMLElement>, index: number, handle: 'start' | 'end' | 'move') => {
    if (disabled) return
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { index, handle, x: event.clientX, initial: value.map(segment => ({ ...segment })) }
    setSelected(index)
  }
  const moveDrag = (event: PointerEvent<HTMLElement>) => {
    const current = drag.current
    if (!current || disabled || !trackRef.current) return
    const width = trackRef.current.getBoundingClientRect().width
    const segment = current.initial[current.index]
    const delta = Math.round(((event.clientX - current.x) / width * 1440) / step) * step
    onChange(updateSegment(current.initial, current.index, current.handle,
      (current.handle === 'end' ? segment.end : segment.start) + delta, minDuration))
  }
  const endDrag = () => { drag.current = null }
  return <div className={`hub-range-slider ${disabled ? 'is-disabled' : ''}`}>
    <div className="hub-range-header"><strong>{label}</strong><div className="hub-row">
      <HubButton variant="outlined" icon={<MinusCircle />} aria-label={`Remove ${label} segment`} disabled={disabled || !value.length}
        onClick={() => onChange(value.filter((_, index) => index !== selectedIndex))} />
      <HubButton variant="outlined" icon={<PlusCircle />} aria-label={`Add ${label} segment`}
        disabled={disabled || value.length >= maxSegments || !available} onClick={() => {
          if (available) {
            const next = [...value, available].sort((a, b) => a.start - b.start)
            setSelected(next.indexOf(available))
            onChange(next)
          }
        }} />
    </div></div>
    <div className="hub-range-ticks" aria-hidden="true">{[0, 360, 720, 1080, 1440].map(minute => <span key={minute}>{formatMinutes(minute)}</span>)}</div>
    <div ref={trackRef} className="hub-range-track" role="group" aria-label={`${label} segments`} aria-disabled={disabled}>
      {value.map((segment, index) => <Fragment key={index}>
        <div className={`hub-range-segment ${selectedIndex === index ? 'is-selected' : ''}`}
          style={{ left: `${segment.start / 14.4}%`, width: `${(segment.end - segment.start) / 14.4}%` }}
          onPointerDown={event => startDrag(event, index, 'move')} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} />
        {(['start', 'end'] as const).map(handle => <button key={handle} type="button" role="slider" className="hub-range-thumb"
          style={{ left: `${segment[handle] / 14.4}%` }} disabled={disabled} aria-orientation="horizontal"
          aria-label={`${label} segment ${index + 1} ${handle}`} aria-valuenow={segment[handle]}
          aria-valuetext={formatMinutes(segment[handle])}
          aria-valuemin={handle === 'start' ? value[index - 1]?.end ?? 0 : segment.start + minDuration}
          aria-valuemax={handle === 'end' ? value[index + 1]?.start ?? 1440 : segment.end - minDuration}
          onFocus={() => setSelected(index)} onPointerDown={event => startDrag(event, index, handle)}
          onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}
          onKeyDown={event => {
            let next: number
            if (event.key === 'Home') next = handle === 'start' ? value[index - 1]?.end ?? 0 : segment.start + minDuration
            else if (event.key === 'End') next = handle === 'end' ? value[index + 1]?.start ?? 1440 : segment.end - minDuration
            else if (['ArrowRight', 'ArrowUp'].includes(event.key)) next = segment[handle] + step
            else if (['ArrowLeft', 'ArrowDown'].includes(event.key)) next = segment[handle] - step
            else return
            event.preventDefault()
            onChange(updateSegment(value, index, handle, next, minDuration))
          }} />)}
      </Fragment>)}
    </div>
    <div className="hub-range-readouts">
      {value.map((segment, index) => <div key={index} className="hub-row">
        <span>Segment {index + 1}</span>
        {(['start', 'end'] as const).map(handle => <label key={handle}>
          <span className="hub-sr-only">{label} segment {index + 1} {handle} time</span>
          <input type="time" step={60} disabled={disabled} value={formatMinutes(segment[handle] % 1440)}
            onFocus={() => setSelected(index)} onChange={event => {
              if (!event.target.value) {
                setInputError('Enter a valid time.')
                event.target.setCustomValidity('Enter a valid time.')
                event.target.reportValidity()
                return
              }
              const [hours, minutes] = event.target.value.split(':').map(Number)
              const next = handle === 'end' && hours === 0 && minutes === 0 ? 1440 : hours * 60 + minutes
              const updated = updateSegment(value, index, handle, next, minDuration)
              if (updated[index][handle] !== next) {
                setInputError('Time must stay within this segment and not overlap another segment.')
                event.target.setCustomValidity('Time must stay within this segment and not overlap another segment.')
                event.target.reportValidity()
                return
              }
              event.target.setCustomValidity('')
              setInputError('')
              onChange(updated)
            }} />
        </label>)}
        {segment.end === 1440 && <small>Ends at midnight (next day)</small>}
      </div>)}
      {!value.length && <p>No time segments. Add a segment to enable this period.</p>}
    </div>
    {inputError && <p className="hub-field-error" role="alert">{inputError}</p>}
  </div>
}

export function HubWeeklySchedule({ value, onChange, timezone = 'UTC', disabled = false, maxSegments = 2 }: {
  value: HubScheduleDay[]; onChange: (value: HubScheduleDay[]) => void; timezone?: string; disabled?: boolean; maxSegments?: number
}) {
  validateSchedule(value)
  new Intl.DateTimeFormat('en', { timeZone: timezone }).format()
  const days = [{ day: 1, label: 'Monday' }, { day: 2, label: 'Tuesday' }, { day: 3, label: 'Wednesday' },
    { day: 4, label: 'Thursday' }, { day: 5, label: 'Friday' }, { day: 6, label: 'Saturday' }, { day: 0, label: 'Sunday' }]
  return <div className="hub-stack" role="group" aria-label="Weekly schedule">
    <p>Times use {timezone}. End-of-day midnight is preserved as 86400 seconds.</p>
    {days.map(({ day, label }) => {
      const current = value.find(entry => entry.day === day)
      return <HubRangeSlider key={day} label={`${label} (${current?.timezone ?? timezone})`} disabled={disabled} maxSegments={maxSegments}
        value={current?.enabled ? current.segments.map(segment => ({ start: segment.start / 60, end: segment.end / 60 })) : []}
        onChange={segments => onChange(updateScheduleDay(value, day, segments, timezone))} />
    })}
  </div>
}
