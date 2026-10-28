import { box, frame, FRONT, onPlane, P, range, SIDE, TOP } from './iso'

export type IsoFigure = 'agent' | 'control-tower'

export const ISO_FIGURE_NAMES: IsoFigure[] = ['agent', 'control-tower']

interface FigureDrawing {
  viewBox: string
  markup: string
  // Glow and bloom blur radius in scene units, so large scenes glow as softly as small ones.
  glow: number
  bloom: number
}

// A camera on a pole with an Agent box at its foot, wired to a small Hub control
// tower. A pulse leaves the Agent, runs along the wire and lights the tower cab
// when it arrives; the radar on the roof keeps sweeping. Used for empty states.
function agent(): FigureDrawing {
  const wire = 'M 38 66 H 118 V 20'

  const grid = range(-20, 160, 20).map((at) =>
    `<line class="iso-grid" x1="${at}" y1="-40" x2="${at}" y2="100"/>`,
  ).join('') + range(-40, 100, 20).map((at) =>
    `<line class="iso-grid" x1="-20" y1="${at}" x2="160" y2="${at}"/>`,
  ).join('')

  const panes = range(0, 2, 1).map((i) =>
    `<rect class="iso-pane iso-lit" x="${1.5 + i * 7.5}" y="3" width="6" height="8"/>`,
  ).join('')

  const [beaconX, beaconY] = P(128.75, -11.25, 106)
  const [cabX, cabY] = P(120, 0, 80)

  const markup = [
    onPlane(TOP(0, 0, 0), grid
      + `<path class="iso-wire iso-wire--dashed" d="${wire}"/>`
      + `<path class="iso-pulse iso-lit" d="${wire}" pathLength="1000"/>`),

    `<ellipse class="iso-halo" cx="${cabX}" cy="${cabY}" rx="26" ry="18"/>`,

    // Hub control tower: podium, shaft, catwalk, glazed cab, roof.
    box(100, -20, 0, 40, 40, 8),
    box(113, -7, 8, 14, 14, 60),
    onPlane(SIDE(127, 7, 68), range(6, 48, 10).map((v) =>
      `<rect class="iso-detail" x="5" y="${v}" width="4" height="5"/>`,
    ).join('')),
    box(105, -15, 68, 30, 30, 4),
    box(108, -12, 72, 24, 24, 14),
    onPlane(FRONT(108, 12, 86), panes),
    onPlane(SIDE(132, 12, 86), panes),
    box(106, -14, 86, 28, 28, 3),
    box(128, -12, 89, 1.5, 1.5, 17),
    `<circle class="iso-beacon iso-lit" cx="${beaconX}" cy="${beaconY}" r="1.6"/>`,
    box(118, -2, 89, 4, 4, 2),
    onPlane(TOP(120, 0, 91),
      '<g class="iso-radar">'
      + '<path class="iso-sweep" d="M 0 0 L 14 0 A 14 14 0 0 0 10.7 -9 Z"/>'
      + '<rect class="iso-face iso-top" x="-9" y="-1.5" width="18" height="3"/>'
      + '</g>'),

    // Camera on a pole, lens facing the viewer, recording light on its side.
    box(0, 60, 0, 5, 5, 46),
    box(-3, 40, 46, 11, 30, 11),
    onPlane(FRONT(-3, 70, 57),
      '<circle class="iso-face iso-top" cx="5.5" cy="5.5" r="3.8"/>'
      + '<circle class="iso-detail" cx="5.5" cy="5.5" r="2"/>'),
    onPlane(SIDE(8, 70, 57), '<circle class="iso-rec iso-lit" cx="3.5" cy="3" r="1.1"/>'),

    // Agent box: status lights on the front, vents on the side.
    box(14, 56, 0, 24, 18, 14),
    onPlane(FRONT(14, 74, 14),
      '<rect class="iso-led iso-lit" x="3" y="4" width="4" height="2"/>'
      + '<rect class="iso-detail" x="9" y="4" width="4" height="2"/>'
      + '<line class="iso-detail" x1="3" y1="10" x2="21" y2="10"/>'),
    onPlane(SIDE(38, 74, 14), range(3, 15, 3).map((u) =>
      `<line class="iso-detail" x1="${u}" y1="3" x2="${u}" y2="11"/>`,
    ).join('')),
  ].join('')

  return {
    viewBox: frame([[-3, 70, 0], [-3, 40, 57], [140, -20, 0], [128.75, -11.25, 108], [134, 14, 89], [38, 74, 0], [118, 66, 0]]),
    markup,
    glow: 1.6,
    bloom: 10,
  }
}

// A tall air-traffic control tower for hero backgrounds.
// Cab panes light up one after another, the radar sweeps, the mast beacon blinks
// and pulses run along four ground wires into the podium. The ground wires
// start outside the viewBox on purpose, so they enter from beyond the frame.
function controlTower(): FigureDrawing {
  const shaft = 760
  const shaftTop = 22 + shaft
  const cab = shaftTop + 18
  const roof = cab + 42 + 8
  const radarReach = 46
  const radarSweep = 42 * (Math.PI / 180)

  const grid = range(-250, 250, 50).map((at) =>
    `<line class="iso-grid" x1="${at}" y1="-250" x2="${at}" y2="250"/>`
    + `<line class="iso-grid" x1="-250" y1="${at}" x2="250" y2="${at}"/>`,
  ).join('')

  const wires = ['M 340 30 H 60', 'M -30 340 V 60', 'M -340 -20 H -60', 'M 20 -340 V -60'].map((d, i) =>
    `<path class="iso-wire" d="${d}"/>`
    + `<path class="iso-pulse iso-lit" d="${d}" pathLength="1000" style="animation-delay: ${i * 1.1}s"/>`,
  ).join('')

  // Four panes per visible face, scanning around the cab: front first, then side.
  const panes = (offset: number) => range(0, 3, 1).map((i) =>
    `<rect class="iso-pane iso-lit" x="${4 + i * 21}" y="8" width="17" height="28" style="animation-delay: ${round1((i + offset) * 0.6)}s"/>`,
  ).join('')

  const [beaconX, beaconY] = P(31.5, -42.5, roof + 52)
  const [cabX, cabY] = P(0, 0, cab + 22)
  const sweepEnd = `${round1(radarReach * Math.cos(radarSweep))} ${round1(-radarReach * Math.sin(radarSweep))}`

  const markup = [
    onPlane(TOP(0, 0, 0), grid + wires),

    `<ellipse class="iso-halo" cx="${cabX}" cy="${cabY}" rx="110" ry="70"/>`,

    // Podium with an entrance and a strip of office windows.
    box(-60, -60, 0, 120, 120, 22),
    onPlane(FRONT(-60, 60, 22),
      '<rect class="iso-detail" x="50" y="6" width="20" height="16"/>'
      + '<line class="iso-detail" x1="0" y1="4" x2="120" y2="4"/>'),
    onPlane(SIDE(60, 60, 22), range(0, 8, 1).map((i) =>
      `<rect class="iso-detail" x="${10 + i * 11.5}" y="8" width="7" height="8"/>`,
    ).join('')),

    // Shaft with hairline ribs and a column of stairwell windows, two of them lit.
    box(-24, -24, 22, 48, 48, shaft),
    onPlane(FRONT(-24, 24, shaftTop),
      `<line class="iso-detail" x1="8" y1="12" x2="8" y2="${shaft - 8}"/>`
      + `<line class="iso-detail" x1="40" y1="12" x2="40" y2="${shaft - 8}"/>`),
    onPlane(SIDE(24, 24, shaftTop), range(0, 11, 1).map((i) =>
      `<rect class="${i === 4 || i === 9 ? 'iso-window iso-lit' : 'iso-detail'}" x="20" y="${40 + i * 60}" width="8" height="16"/>`,
    ).join('')),

    // Collar, catwalk, glazed cab and roof.
    box(-34, -34, shaftTop, 68, 68, 10),
    box(-50, -50, shaftTop + 10, 100, 100, 8),
    box(-44, -44, cab, 88, 88, 42),
    onPlane(FRONT(-44, 44, cab + 42), panes(0)),
    onPlane(SIDE(44, 44, cab + 42), panes(4)),
    box(-50, -50, cab + 42, 100, 100, 8),

    // Antenna mast at the back corner, topped with a blinking beacon.
    box(30, -44, roof, 3, 3, 52),
    `<circle class="iso-beacon-halo" cx="${beaconX}" cy="${beaconY}" r="12"/>`,
    `<circle class="iso-beacon iso-lit" cx="${beaconX}" cy="${beaconY}" r="3"/>`,

    // Radar: mast plus a rotating antenna and sweep drawn in the roof plane.
    box(-5, -5, roof, 10, 10, 24),
    onPlane(TOP(0, 0, roof + 26),
      '<g class="iso-radar">'
      + `<path class="iso-sweep" d="M 0 0 L ${radarReach} 0 A ${radarReach} ${radarReach} 0 0 0 ${sweepEnd} Z"/>`
      + '<rect class="iso-face iso-top" x="-30" y="-4" width="60" height="8"/>'
      + '<line class="iso-antenna iso-lit" x1="-28" y1="0" x2="28" y2="0"/>'
      + '</g>'),
  ].join('')

  return { viewBox: '-150 -925 300 1065', markup, glow: 3, bloom: 22 }
}

const round1 = (value: number) => Math.round(value * 10) / 10

const FIGURES: Record<IsoFigure, () => FigureDrawing> = {
  agent,
  'control-tower': controlTower,
}

/**
 * The complete <svg> for a figure, or '' for an unknown name. `id` must be
 * unique on the page: it names this instance's glow filters, which the
 * stylesheet only switches on when the illustration glows.
 */
export function renderIsoSvg(figure: IsoFigure, id: string) {
  const build = FIGURES[figure]
  if (!build) {
    return ''
  }

  const { viewBox, markup, glow, bloom } = build()
  const [x, y, width, height] = viewBox.split(' ').map(Number)
  // Filters work in scene units over a generous region: a perfectly straight
  // wire has a zero-height bounding box and would vanish under the default one.
  const region = `filterUnits="userSpaceOnUse" x="${x - width}" y="${y - height}" width="${width * 3}" height="${height * 3}"`

  return `<svg class="iso-figure iso-figure--${figure}" viewBox="${viewBox}" focusable="false"`
    + ` style="--iso-glow: url(#${id}); --iso-bloom: url(#${id}-bloom)">`
    + `<defs><filter id="${id}" ${region}>`
    + `<feGaussianBlur stdDeviation="${glow}" result="blur"/>`
    + '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>'
    + '</filter>'
    + `<filter id="${id}-bloom" ${region}><feGaussianBlur stdDeviation="${bloom}"/></filter></defs>`
    + markup
    + '</svg>'
}
