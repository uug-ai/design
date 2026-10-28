import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/components/HubWidgets/widget-utils.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } })
const {
  addDays, addMonths, calendarDays, contrastText, dateKey, formatMinutes, nextSegment, parseDate,
  updateScheduleDay, updateSegment, validateSchedule, validateSegments,
} = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)

test('calendar parses local dates without normalizing impossible dates', () => {
  assert.equal(dateKey(parseDate('2024-02-29')), '2024-02-29')
  for (const date of ['2025-02-29', '2026-04-31', '2026-13-01', '2026-00-01', '2026-1-01', 'not-a-date']) {
    assert.throws(() => parseDate(date), RangeError)
  }
})

test('calendar moves across leap years, month ends and year boundaries', () => {
  assert.equal(addMonths('2024-01-31', 1), '2024-02-29')
  assert.equal(addMonths('2025-01-31', 1), '2025-02-28')
  assert.equal(addMonths('2026-12-31', 1), '2027-01-31')
  assert.equal(addDays('2026-12-31', 1), '2027-01-01')
  assert.equal(addDays('2026-01-01', -1), '2025-12-31')
})

test('calendar grid contains six complete Monday-first weeks', () => {
  const days = calendarDays('2026-11-15')
  assert.equal(days.length, 42)
  assert.equal(parseDate(days[0]).getDay(), 1)
  assert.equal(new Set(days).size, 42)
  assert.ok(days.includes('2026-11-01'))
  assert.ok(days.includes('2026-11-30'))
})

test('calendar day arithmetic preserves dates across a daylight-saving boundary', () => {
  const previous = process.env.TZ
  process.env.TZ = 'Europe/Brussels'
  try {
    assert.equal(addDays('2026-03-29', 1), '2026-03-30')
    assert.equal(addDays('2026-10-25', 1), '2026-10-26')
  } finally {
    if (previous === undefined) delete process.env.TZ
    else process.env.TZ = previous
  }
})

test('time formatting preserves end-of-day instead of wrapping to zero', () => {
  assert.equal(formatMinutes(0), '00:00')
  assert.equal(formatMinutes(541), '09:01')
  assert.equal(formatMinutes(1440), '24:00')
  for (const value of [-1, 1441, 1.5, NaN, Infinity]) assert.throws(() => formatMinutes(value), RangeError)
})

test('segment validation rejects overlaps, reversed ranges and unsupported precision', () => {
  validateSegments([{ start: 0, end: 1440 }])
  validateSegments([{ start: 0, end: 1 }, { start: 1, end: 2 }])
  for (const segments of [
    [{ start: 0, end: 10 }, { start: 9, end: 20 }],
    [{ start: -1, end: 5 }], [{ start: 0, end: 1441 }],
    [{ start: 10, end: 10 }], [{ start: 10, end: 9 }], [{ start: 0.5, end: 10 }],
  ]) assert.throws(() => validateSegments(segments), RangeError)
  assert.throws(() => validateSegments([], 0), RangeError)
})

test('adding a segment finds a real gap and respects full-day occupancy', () => {
  assert.deepEqual(nextSegment([], 60), { start: 0, end: 60 })
  assert.deepEqual(nextSegment([{ start: 0, end: 60 }, { start: 120, end: 1440 }]), { start: 60, end: 120 })
  assert.equal(nextSegment([{ start: 0, end: 1440 }]), undefined)
  assert.equal(nextSegment([{ start: 30, end: 1440 }]), undefined)
  assert.throws(() => nextSegment([], 0), RangeError)
})

test('resizing clamps handles without overlapping neighbours or mutating input', () => {
  const original = [{ start: 0, end: 120 }, { start: 180, end: 240 }, { start: 300, end: 360 }]
  assert.deepEqual(updateSegment(original, 1, 'start', 10)[1], { start: 120, end: 240 })
  assert.deepEqual(updateSegment(original, 1, 'end', 500)[1], { start: 180, end: 300 })
  assert.deepEqual(updateSegment(original, 1, 'start', 500, 15)[1], { start: 225, end: 240 })
  assert.deepEqual(original[1], { start: 180, end: 240 })
  assert.throws(() => updateSegment(original, 99, 'start', 0), RangeError)
  assert.throws(() => updateSegment(original, 0, 'start', NaN), RangeError)
})

test('moving a segment retains its duration within neighbouring bounds', () => {
  const segments = [{ start: 0, end: 120 }, { start: 180, end: 240 }, { start: 300, end: 360 }]
  assert.deepEqual(updateSegment(segments, 1, 'move', 0)[1], { start: 120, end: 180 })
  assert.deepEqual(updateSegment(segments, 1, 'move', 1000)[1], { start: 240, end: 300 })
})

test('weekly schedules use seconds, valid timezones and unique Sunday-zero days', () => {
  validateSchedule([{ day: 0, enabled: true, timezone: 'UTC', segments: [{ start: 0, end: 86400 }] }])
  const entry = { day: 1, enabled: false, timezone: 'Europe/Brussels', segments: [] }
  assert.throws(() => validateSchedule([entry, entry]), RangeError)
  assert.throws(() => validateSchedule([{ ...entry, day: 7 }]), RangeError)
  assert.throws(() => validateSchedule([{ ...entry, timezone: 'Not/A_Timezone' }]), RangeError)
  assert.throws(() => validateSchedule([{ ...entry, segments: [{ start: 1, end: 60 }] }]), RangeError)
})

test('editing one schedule day preserves untouched days, empty days and timezone', () => {
  const value = [
    { day: 1, enabled: true, timezone: 'Europe/Brussels', segments: [{ start: 32400, end: 61200 }] },
    { day: 0, enabled: false, timezone: 'UTC', segments: [] },
  ]
  const next = updateScheduleDay(value, 1, [{ start: 541, end: 1440 }], 'UTC')
  assert.deepEqual(next[0], { day: 1, enabled: true, timezone: 'Europe/Brussels', segments: [{ start: 32460, end: 86400 }] })
  assert.strictEqual(next[1], value[1])
  assert.deepEqual(value[0].segments, [{ start: 32400, end: 61200 }])
  const cleared = updateScheduleDay(next, 1, [], 'UTC')
  assert.equal(cleared[0].enabled, false)
  assert.deepEqual(cleared[0].segments, [])
  assert.equal(cleared[1].enabled, false)
})

test('adding a missing schedule day does not fill or rewrite other days', () => {
  const next = updateScheduleDay([], 6, [{ start: 0, end: 1440 }], 'UTC')
  assert.equal(next.length, 1)
  assert.deepEqual(next[0], { day: 6, timezone: 'UTC', enabled: true, segments: [{ start: 0, end: 86400 }] })
})

test('label colors choose contrasting foregrounds and reject invalid HEX', () => {
  assert.equal(contrastText('#000000'), 'white')
  assert.equal(contrastText('#ffffff'), 'black')
  assert.equal(contrastText('#f3b13e'), 'black')
  assert.throws(() => contrastText('red'), RangeError)
})
