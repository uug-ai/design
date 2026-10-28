import { useEffect, useRef, useState } from 'react'
import { EditPencil, Plus, Trash } from 'iconoir-react'
import {
  HubButton, HubColorInput, HubMultiSelect, HubSearch, HubSelect, HubTags,
} from './controls'
import { HubDateInput, HubDatePicker, HubTimeSpinner } from './datetime'
import { HubRangeSlider, HubWeeklySchedule } from './scheduling'
import { HubActionsMenu, HubAspectRatioToggle, HubBreadcrumb, HubControlsPopup, HubGridToggle, HubLanguageSwitcher } from './navigation'
import { HubLoadMore, HubTable } from './data'
import { HubBlockStatus } from './feedback'
import { HubIdentityBadge, HubLabelTag, HubToastContainer } from './notifications'
import type { HubToastItem } from './notifications'
import type { HubRangeSegment, HubScheduleDay } from './widget-utils'

const sites = [{ value: 'ghent', text: 'Ghent - Bijlokehof' }, { value: 'new-york', text: 'New York - Midtown' },
  { value: 'cape-town', text: 'Cape Town - Waterfront' }, { value: 'locked', text: 'Managed site', disabled: true }]

export function SelectionExample({ disabled = false, readOnly = false, loading = false, error = '', searchable = true, locked = false }: {
  disabled?: boolean; readOnly?: boolean; loading?: boolean; error?: string; searchable?: boolean; locked?: boolean
}) {
  const [site, setSite] = useState('ghent')
  const [selected, setSelected] = useState(['ghent', 'new-york'])
  return <div className="hub-stack">
    <HubSelect label="Primary site" options={sites} value={site} onChange={setSite} disabled={disabled}
      readOnly={readOnly} error={error} searchable={searchable} clearable loading={loading} />
    <HubMultiSelect label="Monitored sites" options={sites} value={selected} onChange={setSelected} disabled={disabled}
      readOnly={readOnly} error={error} searchable={searchable} locked={locked ? ['ghent'] : []} clearable loadingMore={loading} />
    {locked && <p>Ghent is locked. Clearing keeps locked selections.</p>}
    <output>Selected sites: {selected.join(', ') || 'none'}</output>
  </div>
}

export function AdditionalFieldsExample({ view = 'all', disabled = false, error = '' }: {
  view?: 'all' | 'search' | 'color' | 'tags'; disabled?: boolean; error?: string
}) {
  const [query, setQuery] = useState('')
  const [color, setColor] = useState('#84569f')
  const [tags, setTags] = useState(['Entrance', 'Outdoor'])
  return <div className="hub-stack">
    {(view === 'all' || view === 'search') && <><HubSearch label="Search cameras" value={query} onChange={event => setQuery(event.target.value)} disabled={disabled} />
      <output>Search: {query || 'all cameras'}</output></>}
    {(view === 'all' || view === 'color') && <><HubColorInput value={color} onChange={setColor} disabled={disabled} error={error} />
      <div className="hub-row"><HubLabelTag color={color}>Entrance</HubLabelTag><HubLabelTag color="#f3b13e">Needs review</HubLabelTag></div></>}
    {(view === 'all' || view === 'tags') && <HubTags label="Camera labels" value={tags} onChange={setTags} disabled={disabled} error={error} />}
  </div>
}

export function DateTimeExample({ view = 'all', disabled = false, locale = 'en-GB', appearance = 'field', error = '' }: {
  view?: 'all' | 'calendar' | 'available' | 'input' | 'time'
  disabled?: boolean; locale?: string; appearance?: 'field' | 'filter' | 'button'; error?: string
}) {
  const [date, setDate] = useState('2026-10-28')
  const [time, setTime] = useState(9 * 3600 + 30 * 60)
  return <div className="hub-stack">
    {(view === 'all' || view === 'calendar' || view === 'available') && <HubDatePicker label="Recording date" value={date}
      onChange={setDate} min="2026-10-01" max="2026-12-31" availableDates={['2026-10-26', '2026-10-28', '2026-10-30']}
      disableUnavailable={view === 'available'} clearable locale={locale} appearance={appearance} disabled={disabled} error={error} />}
    {(view === 'all' || view === 'input') && <HubDateInput label="Retention date" value={date} onChange={setDate}
      min="2026-10-01" max="2026-12-31" disabled={disabled} error={error} />}
    {(view === 'all' || view === 'time') && <HubTimeSpinner label="Playback time" value={time} onChange={setTime} disabled={disabled} />}
    <output>Date: {date || 'none'}; time: {time} seconds</output>
  </div>
}

const initialSegments: HubRangeSegment[] = [{ start: 540, end: 720 }, { start: 780, end: 1020 }]
const initialSchedule: HubScheduleDay[] = [1, 2, 3, 4, 5, 6, 0].map(day => ({
  day, timezone: 'Europe/Brussels', enabled: day > 0 && day < 6,
  segments: day > 0 && day < 6 ? [{ start: 9 * 3600, end: 17 * 3600 }] : [],
}))

export function SchedulingExample({ weekly = false, disabled = false, maxSegments = 2 }: {
  weekly?: boolean; disabled?: boolean; maxSegments?: number
}) {
  const [segments, setSegments] = useState(initialSegments)
  const [schedule, setSchedule] = useState(initialSchedule)
  return <div className="hub-stack">
    {weekly ? <HubWeeklySchedule value={schedule} onChange={setSchedule} timezone="Europe/Brussels" disabled={disabled} maxSegments={maxSegments} />
      : <HubRangeSlider label="Recording hours" value={segments} onChange={setSegments} disabled={disabled} maxSegments={maxSegments} />}
    <HubButton variant="outlined" disabled={disabled} onClick={() => { setSegments(initialSegments); setSchedule(initialSchedule) }}>Reset schedule</HubButton>
    <pre className="hub-demo-output" aria-label="Schedule value">{JSON.stringify(weekly ? schedule : segments, null, 2)}</pre>
  </div>
}

export function MenuExample({ single = false, empty = false, allDisabled = false }: { single?: boolean; empty?: boolean; allDisabled?: boolean }) {
  const [result, setResult] = useState('No action selected')
  const items = empty ? [] : [
    { id: 'edit', text: 'Edit camera', icon: <EditPencil />, disabled: allDisabled, onSelect: () => setResult('Edit camera selected') },
    { id: 'delete', text: 'Delete camera', icon: <Trash />, danger: true, disabled: allDisabled, hidden: single, onSelect: () => setResult('Delete camera selected') },
    { id: 'restricted', text: 'Restricted action', disabled: true, hidden: single, onSelect: () => setResult('Restricted action selected') },
    { id: 'hidden', text: 'Hidden action', hidden: true, onSelect: () => setResult('Hidden action selected') },
  ]
  return <div className="hub-stack"><div className="hub-row">
    <HubActionsMenu items={items} /><HubControlsPopup items={items} />
  </div><output role="status">{empty ? 'No visible actions; triggers are hidden.' : result}</output></div>
}

const cameraRows = Array.from({ length: 15 }, (_, index) => ({
  id: `camera-${index + 1}`, name: `Camera ${String(index + 1).padStart(2, '0')}`,
  site: index % 2 ? 'Ghent' : 'New York', recordings: 100 + index * 12,
}))

export function DataExample({ view = 'table', empty = false, loading = false }: {
  view?: 'table' | 'load-more'; empty?: boolean; loading?: boolean
}) {
  const [query, setQuery] = useState('')
  const [count, setCount] = useState(5)
  const [fetching, setFetching] = useState(false)
  useEffect(() => {
    if (!fetching) return
    const timer = window.setTimeout(() => { setCount(previous => Math.min(previous + 5, cameraRows.length)); setFetching(false) }, 500)
    return () => window.clearTimeout(timer)
  }, [fetching])
  const rows = empty ? [] : cameraRows.filter(row => `${row.name} ${row.site}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="hub-stack">
    {view === 'table' ? <>
      <HubSearch label="Filter cameras" value={query} onChange={event => setQuery(event.target.value)} />
      <HubTable label="Cameras" rows={rows} pageSize={5} loading={loading}
        columns={[{ key: 'name', label: 'Camera', emphasis: true }, { key: 'site', label: 'Site' }, { key: 'recordings', label: 'Recordings', align: 'end' }]} />
    </> : <>
      <ul>{rows.slice(0, count).map(row => <li key={row.id}>{row.name}</li>)}</ul>
      <output>{Math.min(count, rows.length)} of {rows.length} cameras</output>
      <HubLoadMore canLoadMore={count < rows.length} loading={loading || fetching} onLoad={() => setFetching(true)} />
    </>}
  </div>
}

export function NavigationExample({ disabled = false }: { disabled?: boolean }) {
  const [grid, setGrid] = useState('2')
  const [ratio, setRatio] = useState('16:9')
  const [language, setLanguage] = useState('en')
  const [result, setResult] = useState('')
  return <div className="hub-stack">
    <HubBreadcrumb title="Cameras" items={[{ text: 'Sites', href: '#sites' }, { text: 'Ghent', href: '#ghent' }, { text: 'Entrance' }]}
      actions={<HubButton icon={<Plus />} disabled={disabled} onClick={() => setResult('Add camera selected')}>Add camera</HubButton>} />
    <div className="hub-row"><HubGridToggle value={grid} onChange={setGrid} disabled={disabled} />
      <HubAspectRatioToggle value={ratio} onChange={setRatio} disabled={disabled} /></div>
    <HubLanguageSwitcher value={language} onChange={setLanguage} disabled={disabled} />
    <output>Grid: {grid}; aspect ratio: {ratio}; selected language: {language}. {result}</output>
  </div>
}

export function NotificationExample({ autoDismiss = false, fixed = false }: { autoDismiss?: boolean; fixed?: boolean }) {
  const [items, setItems] = useState<HubToastItem[]>([])
  const [result, setResult] = useState('')
  const generation = useRef(0)
  const show = () => {
    generation.current += 1
    setItems((['success', 'info', 'warning', 'error'] as const).map(kind => ({
      id: `${kind}-${generation.current}`, kind, title: `${kind[0].toUpperCase()}${kind.slice(1)} notification`,
      message: 'A local demonstration. No Hub data was changed.', duration: autoDismiss ? 2000 : 0,
      action: { text: 'View details', onClick: () => setResult(`${kind} details selected`) },
    })))
  }
  return <div className="hub-stack">
    <div className="hub-row"><HubButton onClick={show}>Show notifications</HubButton>
      <HubButton variant="outlined" onClick={() => setItems([])}>Clear notifications</HubButton></div>
    <HubToastContainer items={items} onDismiss={id => setItems(previous => previous.filter(item => item.id !== id))} inline={!fixed} />
    <HubBlockStatus tone="loading">Applying camera settings...</HubBlockStatus>
    <div className="hub-row"><HubIdentityBadge name="Ghent Site" color="#84569f" />
      <HubIdentityBadge name="Camera Group" color="#36a8ff" variant="group" />
      <HubIdentityBadge name="Online camera" color="#35d06b" variant="camera" />
      <HubLabelTag color="#f3b13e">Needs review</HubLabelTag></div>
    <output role="status">{result || 'Notifications pause while hovered or keyboard-focused.'}</output>
  </div>
}
