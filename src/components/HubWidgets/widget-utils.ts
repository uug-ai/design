export type HubRangeSegment = { start: number; end: number }
export type HubScheduleDay = {
  day: number
  enabled: boolean
  timezone: string
  segments: HubRangeSegment[]
}

export function contrastText(color: string): 'black' | 'white' {
  if (!/^#[a-f\d]{6}$/i.test(color)) throw new RangeError('Color must be a six-digit HEX value')
  const channels = [1, 3, 5].map(index => parseInt(color.slice(index, index + 2), 16) / 255)
    .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722 > 0.179 ? 'black' : 'white'
}

export function parseDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError(`Invalid date: ${value}`)
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(0)
  date.setFullYear(year, month - 1, day)
  date.setHours(0, 0, 0, 0)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new RangeError(`Invalid date: ${value}`)
  }
  return date
}

export function dateKey(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function addDays(value: string, days: number): string {
  const date = parseDate(value)
  date.setDate(date.getDate() + days)
  return dateKey(date)
}

export function addMonths(value: string, months: number): string {
  const date = parseDate(value)
  const day = date.getDate()
  date.setDate(1)
  date.setMonth(date.getMonth() + months)
  const last = new Date(date.getTime())
  last.setMonth(last.getMonth() + 1, 0)
  date.setDate(Math.min(day, last.getDate()))
  return dateKey(date)
}

export function calendarDays(month: string): string[] {
  const first = `${month.slice(0, 7)}-01`
  const offset = (parseDate(first).getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, index) => addDays(first, index - offset))
}

export function formatMinutes(value: number): string {
  if (!Number.isInteger(value) || value < 0 || value > 1440) throw new RangeError('Minutes must be between 0 and 1440')
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`
}

export function validateSegments(segments: readonly HubRangeSegment[], minDuration = 1): void {
  if (!Number.isInteger(minDuration) || minDuration < 1) throw new RangeError('Minimum segment duration must be a positive minute count')
  let previousEnd = 0
  for (const { start, end } of segments) {
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < previousEnd ||
        start < 0 || end > 1440 || end - start < minDuration) {
      throw new RangeError('Time segments must be ordered, non-overlapping minute ranges within one day')
    }
    previousEnd = end
  }
}

export function nextSegment(segments: readonly HubRangeSegment[], duration = 60): HubRangeSegment | undefined {
  validateSegments(segments)
  if (!Number.isInteger(duration) || duration < 1 || duration > 1440) throw new RangeError('Segment duration must be between 1 and 1440 minutes')
  let start = 0
  for (const segment of [...segments, { start: 1440, end: 1440 }]) {
    if (segment.start - start >= duration) return { start, end: start + duration }
    start = segment.end
  }
  return undefined
}

export function updateSegment(
  segments: readonly HubRangeSegment[], index: number, handle: 'start' | 'end' | 'move',
  value: number, minDuration = 1,
): HubRangeSegment[] {
  validateSegments(segments, minDuration)
  const segment = segments[index]
  if (!segment || !Number.isFinite(value)) throw new RangeError('Invalid segment update')
  const min = segments[index - 1]?.end ?? 0
  const max = segments[index + 1]?.start ?? 1440
  const clamp = (number: number, low: number, high: number) => Math.min(high, Math.max(low, Math.round(number)))
  const updated = handle === 'start'
    ? { ...segment, start: clamp(value, min, segment.end - minDuration) }
    : handle === 'end'
      ? { ...segment, end: clamp(value, segment.start + minDuration, max) }
      : { start: clamp(value, min, max - (segment.end - segment.start)),
        end: clamp(value, min, max - (segment.end - segment.start)) + segment.end - segment.start }
  return segments.map((item, current) => current === index ? updated : { ...item })
}

export function validateSchedule(value: readonly HubScheduleDay[]): void {
  const days = new Set<number>()
  for (const entry of value) {
    if (!Number.isInteger(entry.day) || entry.day < 0 || entry.day > 6 || days.has(entry.day) ||
        typeof entry.enabled !== 'boolean') throw new RangeError('Schedule days must be unique integers from 0 to 6')
    new Intl.DateTimeFormat('en', { timeZone: entry.timezone }).format()
    validateSegments(entry.segments.map(segment => ({ start: segment.start / 60, end: segment.end / 60 })))
    days.add(entry.day)
  }
}

export function updateScheduleDay(value: readonly HubScheduleDay[], day: number, segments: HubRangeSegment[], timezone: string): HubScheduleDay[] {
  validateSchedule(value)
  validateSegments(segments)
  const existing = value.find(entry => entry.day === day)
  const replacement: HubScheduleDay = { ...existing, day, timezone: existing?.timezone ?? timezone, enabled: segments.length > 0,
    segments: segments.map(segment => ({ start: segment.start * 60, end: segment.end * 60 })) }
  validateSchedule([replacement])
  return existing ? value.map(entry => entry.day === day ? replacement : entry) : [...value, replacement]
}
