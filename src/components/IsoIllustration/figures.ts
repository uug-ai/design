import { box, frame, FRONT, onPlane, P, range, SIDE, TOP, type Vec3 } from './iso'

export type IsoFigure = 'agent' | 'control-tower' | 'hub' | 'vault' | 'factory'

export const ISO_FIGURE_NAMES: IsoFigure[] = ['agent', 'control-tower', 'hub', 'vault', 'factory']

interface FigureDrawing {
  viewBox: string
  markup: string
  // Glow and bloom blur radius in scene units, so large scenes glow as softly as small ones.
  glow: number
  bloom: number
  // Length of the animation round in seconds. Parts marked data-iso-at (seconds
  // into the round where their moment starts) let a page seek the figure there.
  loop?: number
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

// Convex hull of projected points (monotone chain), for round solids.
function hull(points: [number, number][]) {
  const sorted = [...points].sort(([ax, ay], [bx, by]) => ax - bx || ay - by)
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const half = (list: [number, number][]) => list.reduce<[number, number][]>((chain, point) => {
    while (chain.length >= 2 && cross(chain[chain.length - 2], chain[chain.length - 1], point) <= 0) {
      chain.pop()
    }
    chain.push(point)
    return chain
  }, [])
  const lower = half(sorted)
  const upper = half([...sorted].reverse())
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]
}

// Round solids for small parts such as cameras. A cylinder stands on z with
// its axis up; a sphere (or its upper half) is the hull of points on it.
function cylinder(cx: number, cy: number, z: number, r: number, h: number) {
  const ring = (zz: number) => range(0, 35, 1).map((k) => {
    const a = (k * Math.PI) / 18
    return P(cx + r * Math.cos(a), cy + r * Math.sin(a), zz)
  })
  const top = ring(z + h)
  return `<polygon class="iso-face iso-side" points="${hull([...ring(z), ...top]).map(([x, y]) => `${x},${y}`).join(' ')}"/>`
    + `<polygon class="iso-face iso-top" points="${top.map(([x, y]) => `${x},${y}`).join(' ')}"/>`
}

function sphere(cx: number, cy: number, cz: number, r: number, cls: string, upperHalf = false) {
  const points = range(upperHalf ? 0 : -6, 6, 1).flatMap((lat) => range(0, 23, 1).map((lon) => {
    const [a, b] = [(lat * Math.PI) / 12, (lon * Math.PI) / 12]
    return P(cx + r * Math.cos(a) * Math.cos(b), cy + r * Math.cos(a) * Math.sin(b), cz + r * Math.sin(a))
  }))
  return `<polygon class="${cls}" points="${hull(points).map(([x, y]) => `${x},${y}`).join(' ')}"/>`
}

// A lens seen from the front: a rim and a pupil around a projected point.
function lens([x, y]: [number, number], r: number) {
  return `<circle class="iso-face iso-top" cx="${x}" cy="${y}" r="${r}"/><circle class="iso-detail" cx="${x}" cy="${y}" r="${round1(r / 2)}"/>`
}

// A camera of the given kind standing on (x, y) at height z, lens facing +y.
type CameraKind = 'bullet' | 'dome' | 'ptz' | 'turret'

function cameraHead(kind: CameraKind, x: number, y: number, z: number) {
  switch (kind) {
    case 'bullet':
      return box(x - 5, y - 3, z, 3, 3, 10)
        + box(x - 10, y - 10, z + 10, 12, 16, 9)
        + onPlane(FRONT(x - 10, y + 6, z + 19), '<circle class="iso-face iso-top" cx="4.5" cy="4.5" r="3"/><circle class="iso-detail" cx="4.5" cy="4.5" r="1.5"/>')
    case 'dome':
      return cylinder(x, y, z, 8, 2) + sphere(x, y, z + 2, 7, 'iso-face iso-front', true) + lens(P(x, y + 4.6, z + 6.5), 1.6)
    case 'ptz':
      return cylinder(x, y, z, 3.5, 7) + cylinder(x, y, z + 7, 7, 2)
        + box(x - 8, y - 2, z + 9, 2, 4, 11) + sphere(x, y, z + 15, 5.5, 'iso-face iso-top') + box(x + 6, y - 2, z + 9, 2, 4, 11)
        + lens(P(x, y + 5.2, z + 15), 2)
    case 'turret':
      return cylinder(x, y, z, 7.5, 3) + sphere(x, y, z + 8, 6, 'iso-face iso-top') + lens(P(x, y + 5.6, z + 9), 2.1)
  }
}

// The Hub building: a podium, three pipeline floors (workflows, analyse,
// notify) whose window panes take `pane(floor)` as their attributes, and a
// roof core with an antenna whose beacon takes `beacon`. Pass labels = false
// for a plain building, with windows across the whole front. Drawn with its podium at (160, 80); other figures
// place and scale it with placeAt().
const HUB_FLOORS = ['WORKFLOWS', 'ANALYSE', 'NOTIFY']

function hubBuilding(pane: (floor: number) => string, beacon: string, labels = true) {
  const [beaconX, beaconY] = P(223, 123, 136)
  const floors = HUB_FLOORS.map((name, f) => {
    const z = 18 + f * 28
    const panes = (count: number, step: number) => range(0, count - 1, 1).map((i) =>
      `<rect ${pane(f)} x="${4 + i * step}" y="7" width="9" height="13"/>`,
    ).join('')
    return box(176, 96, z, 78, 78, 26)
      + onPlane(FRONT(176, 174, z + 26), labels
        ? `<text class="iso-label" x="39" y="17" font-size="6">${name}</text>${panes(3, 11)}`
        : panes(6, 12.2))
      + onPlane(SIDE(254, 174, z + 26), panes(6, 12.2))
      + box(172, 92, z + 26, 86, 86, 2)
  }).join('')

  return box(160, 80, 8, 110, 110, 10)
    + onPlane(FRONT(160, 190, 18), (labels ? '<text class="iso-label" x="6" y="7.5" font-size="6">HUB</text>' : '')
      + '<line class="iso-detail" x1="30" y1="5" x2="104" y2="5"/>')
    + floors
    + box(200, 120, 102, 30, 30, 14)
    + onPlane(SIDE(230, 150, 116), '<line class="iso-detail" x1="4" y1="5" x2="26" y2="5"/>'
      + '<line class="iso-detail" x1="4" y1="9" x2="26" y2="9"/>')
    + box(222, 122, 116, 2, 2, 18)
    + `<circle ${beacon} cx="${beaconX}" cy="${beaconY}" r="2.2"/>`
}

// Moves a drawing made around `from` to `to`, scaled by `scale`. The
// projection is linear, so a uniform scale in space is the same scale on screen.
function placeAt(markup: string, from: Vec3, to: Vec3, scale: number) {
  const [fx, fy] = P(...from)
  const [tx, ty] = P(...to)
  return `<g transform="translate(${round1(tx - fx * scale)} ${round1(ty - fy * scale)}) scale(${scale})">${markup}</g>`
}

// The Hub end to end: three cameras on site, each wired to its own Agent (the
// three Agents share one gateway machine), the Hub with its three pipeline
// floors (workflows, analyse, notify), and the operators' videowall and phone.
// Every 3s something happens in front of one camera in turn (a person walks or
// a car drives into its field of view), the camera fires, a pulse runs to that
// camera's Agent, then
// over the gateway's uplink into the Hub, the floors light bottom to top, then the detection appears on
// that camera's videowall tile and the phone shows an alert. The stylesheet
// times it all; per-camera parts carry their own animation delay.
function hub(): FigureDrawing {
  const cams = [130, 190, 250]
  const scenes = ['person', 'car', 'person']
  const detections = ['PERSON 94%', 'VEHICLE 91%', 'PERSON 88%']
  const delay = (seconds: number) => `style="animation-delay: ${seconds}s"`
  // Each camera and its Agent mark the moment its event starts (the scene walks
  // in 0.6s before the camera fires), so a page can replay that event on click.
  const at = (i: number) => `data-iso-at="${round1(i * 3 - 0.6)}"`
  const pulse = (d: string, cls: string, extra = '') =>
    `<path class="iso-wire" d="${d}"/><path class="iso-pulse iso-lit ${cls}" d="${d}" pathLength="1000" ${extra}/>`

  // What a camera sees: a person walking or a car driving past its lens.
  const person = (cy: number) => box(28, cy + 28, 8, 6, 5, 15) + box(28.5, cy + 28.5, 23, 5, 4, 5)
  const car = (cy: number) => box(8, cy + 22, 8, 40, 17, 9)
    + box(17, cy + 24, 17, 20, 14, 7)
    + onPlane(FRONT(17, cy + 38, 24), '<line class="iso-detail" x1="10" y1="1" x2="10" y2="7"/>')
    + onPlane(FRONT(8, cy + 39, 17), '<line class="iso-detail" x1="2" y1="4" x2="38" y2="4"/>')

  const grid = range(30, 390, 30).map((x) => `<line class="iso-grid" x1="${x}" y1="10" x2="${x}" y2="290"/>`).join('')
    + range(30, 270, 30).map((y) => `<line class="iso-grid" x1="10" y1="${y}" x2="410" y2="${y}"/>`).join('')

  const wires = cams.map((cy, i) => pulse(`M 24 ${cy + 2} H 70`, 'iso-hub-cam-pulse', delay(i * 3))).join('')
    + pulse('M 106 200 H 205 V 190', 'iso-hub-uplink-pulse')
    + pulse('M 270 100 H 355 V 26', 'iso-hub-out-pulse')
    + pulse('M 270 160 H 351 V 144', 'iso-hub-out-pulse')

  const tiles = '<rect class="iso-face iso-side" x="2" y="2" width="86" height="52" rx="2"/>'
    + range(0, 3, 1).map((i) => {
      const x = 3 + (i % 2) * 43
      const y = 3 + Math.floor(i / 2) * 25.5
      const live = i < 3
      return `<rect class="iso-pane iso-lit${live ? ' iso-hub-tile' : ''}" x="${x}" y="${y}" width="41" height="24" rx="1"${live ? ` ${delay(i * 3)}` : ''}/>`
        + `<text class="iso-label" x="${x + 2.5}" y="${y + 5.5}" font-size="3.6">${live ? `CAM ${i + 1}` : 'OVERVIEW'}</text>`
        + (live
          ? `<g class="iso-hub-reveal iso-hub-tile-reveal" ${delay(i * 3)}>`
            + `<rect class="iso-det" x="${x + 15}" y="${y + 7}" width="11" height="14"/>`
            + `<text class="iso-screen-text" x="${x + 15}" y="${y + 5.6}" font-size="3.4">${detections[i]}</text></g>`
          : '')
    }).join('')

  const [haloX, haloY] = P(215, 135, 90)
  const markup = [
    // Ground plate with a grid and the three zones.
    box(0, 0, 0, 420, 300, 8),
    onPlane(TOP(0, 0, 8), '<rect class="iso-detail" x="8" y="8" width="404" height="284" rx="10"/>'
      + grid
      + '<text class="iso-label iso-label--zone" x="70" y="290" font-size="7">SITE · AGENTS</text>'
      + '<text class="iso-label iso-label--zone" x="160" y="214" font-size="7">HUB · PIPELINE</text>'
      + '<text class="iso-label iso-label--zone" x="300" y="182" font-size="7">OPERATORS</text>'
      + cams.map((cy, i) =>
        `<path class="iso-hub-fov" d="M 22 ${cy + 8} L 4 ${cy + 44} H 56 Z" ${delay(i * 3)}/>`,
      ).join('')
      + wires),

    // Videowall at the back right, facing the Hub.
    box(325, 21, 8, 4, 4, 14),
    box(380, 21, 8, 4, 4, 14),
    box(310, 20, 22, 90, 6, 56),
    onPlane(FRONT(310, 26, 78), tiles),

    // Hub: podium, pipeline floors, roof core with an antenna beacon.
    `<ellipse class="iso-halo" cx="${haloX}" cy="${haloY}" rx="70" ry="48"/>`,
    hubBuilding((f) => `class="iso-pane iso-lit iso-hub-floor" ${delay(f * 0.35)}`, 'class="iso-beacon iso-lit"'),

    // Phone on a dock: the operator's alert.
    box(336, 128, 8, 32, 16, 4),
    box(342, 136, 12, 20, 5, 40),
    onPlane(FRONT(342, 141, 52),
      '<rect class="iso-pane iso-lit iso-hub-phone" x="2" y="3" width="16" height="32" rx="2"/>'
      + '<g class="iso-hub-reveal iso-hub-phone-reveal">'
      + '<text class="iso-screen-text" x="10" y="12" font-size="4.2" text-anchor="middle">ALERT</text>'
      + '<text class="iso-screen-text" x="10" y="19" font-size="3.2" text-anchor="middle">event</text>'
      + '</g>'),

    // Site: three cameras on poles, each with what triggers it in front of
    // the lens, and each wired to its own Agent; the Agents run side by side on
    // one gateway machine with a single uplink to Hub.
    cams.map((cy, i) => `<g class="iso-trigger" ${at(i)}>`
      + box(20, cy, 8, 4, 4, 42)
      + box(17, cy - 16, 50, 10, 22, 10)
      + onPlane(FRONT(17, cy + 6, 60), '<circle class="iso-face iso-top" cx="5" cy="5" r="3.4"/>'
        + '<circle class="iso-detail" cx="5" cy="5" r="1.8"/>')
      + onPlane(SIDE(27, cy + 6, 60), `<circle class="iso-led iso-lit iso-hub-rec" cx="4" cy="3" r="1.2" ${delay(i * 3)}/>`
        + `<text class="iso-label" x="9" y="7.5" font-size="5">${i + 1}</text>`)
      + '</g>'
      + `<g class="iso-hub-event" ${delay(i * 3 - 9)}>${scenes[i] === 'car' ? car(cy) : person(cy)}</g>`,
    ).join(''),
    box(70, 116, 8, 36, 150, 12),
    onPlane(SIDE(106, 266, 20), '<rect class="iso-led iso-lit iso-hub-uplink-led" x="4" y="4.5" width="4" height="2.4"/>'
      + '<text class="iso-label" x="11" y="7.6" font-size="4.6">GATEWAY</text>'
      + range(52, 140, 4).map((u) => `<line class="iso-detail" x1="${u}" y1="3" x2="${u}" y2="9"/>`).join('')),
    cams.map((cy, i) => `<g class="iso-trigger" ${at(i)}>`
      + box(74, cy - 9, 20, 28, 20, 12)
      + onPlane(FRONT(74, cy + 11, 32), `<rect class="iso-led iso-lit iso-hub-agent-led" x="3" y="4.5" width="4" height="2.4" ${delay(i * 3)}/>`
        + `<text class="iso-label" x="9.5" y="7.6" font-size="4.2">AGENT ${i + 1}</text>`)
      + onPlane(SIDE(102, cy + 11, 32), range(4, 16, 3).map((u) =>
        `<line class="iso-detail" x1="${u}" y1="4" x2="${u}" y2="9"/>`,
      ).join(''))
      + '</g>',
    ).join(''),
  ].join('')

  return {
    viewBox: frame([[0, 0, 0], [420, 0, 0], [0, 300, 0], [420, 300, 0], [223, 123, 140], [310, 20, 78], [400, 20, 78], [20, 130, 62]], 10),
    markup,
    glow: 2,
    bloom: 14,
    loop: 9,
  }
}

// Vault, recordings only: four Agents on site upload their recordings to the
// Vault, which sends each one out of a hatch as a crate; a gantry crane drops
// it into the bucket of the storage provider its account uses (bring your own
// storage). Alongside the fourth upload Hub fetches a recording straight
// from its bucket. A 12s round of four 3s beats; per-Agent parts run on the
// round with a 3s delay, the fetch with a 9s one (written -3s, so it is
// already running when the figure appears).
function vault(): FigureDrawing {
  // Agents sit so their wires leave on the grid (every 30 units).
  const agents = [48, 108, 168, 228]
  // Buckets in a row under the crane, which picks crates up at x = 246.
  const buckets = [['S3', 266], ['AZURE', 312], ['CEPH', 358]] as const
  const pickup = 246
  const files = ['CAM1_0412.MP4', 'CAM2_0413.MP4', 'CAM3_0414.MP4', 'CAM4_0415.MP4']
  // The bucket each Agent's account stores into (Agent 4 shares Azure).
  const targets = [0, 1, 2, 1]
  // Hub fetches from the middle bucket; its wire leaves the bucket's front on the grid.
  const source = 1
  const sourceX = buckets[source][1] + 18
  const fetch = -3
  const delay = (seconds: number) => `style="animation-delay: ${seconds}s"`

  const grid = range(30, 390, 30).map((x) => `<line class="iso-grid" x1="${x}" y1="10" x2="${x}" y2="290"/>`).join('')
    + range(30, 270, 30).map((y) => `<line class="iso-grid" x1="10" y1="${y}" x2="410" y2="${y}"/>`).join('')

  // Upload wires share one trunk to the Vault: draw each Agent's stub, the
  // trunk past every stub and its run to the Vault once (overlapping strokes
  // would draw it darker), with a pulse per Agent.
  const wires = agents.map((cy) => `<path class="iso-wire" d="M 58 ${cy + 12} H 90"/>`).join('')
    + `<path class="iso-wire" d="M 90 ${agents[0] + 12} V ${agents[agents.length - 1] + 12}"/>`
    + '<path class="iso-wire" d="M 90 210 H 180 V 180"/>'
    + agents.map((cy, i) => `<path class="iso-pulse iso-lit iso-vault-upload" d="M 58 ${cy + 12} H 90 V 210 H 180 V 180" pathLength="1000" ${delay(i * 3)}/>`).join('')
    + `<path class="iso-wire" d="M ${sourceX} 127 V 150 H 390 V 240 H 355"/>`
    + `<path class="iso-pulse iso-lit iso-vault-request" d="M 355 240 H 390 V 150 H ${sourceX} V 127" pathLength="1000" ${delay(fetch)}/>`
    + `<path class="iso-pulse iso-lit iso-vault-stream" d="M ${sourceX} 127 V 150 H 390 V 240 H 355" pathLength="1000" ${delay(fetch)}/>`

  // A drum whose axis runs along +y (toward the viewer): its outline is the
  // hull of its back and front rims. The caller draws the front face on top.
  const drum = (cx: number, y: number, cz: number, r: number, depth: number) => {
    const rims = range(0, 35, 1).flatMap((k) => {
      const a = (k * Math.PI) / 18
      return [P(cx + r * Math.cos(a), y, cz + r * Math.sin(a)), P(cx + r * Math.cos(a), y + depth, cz + r * Math.sin(a))]
    })
    return `<polygon class="iso-face iso-side" points="${hull(rims).map(([x, z]) => `${x},${z}`).join(' ')}"/>`
  }

  // Main door: a heavy drum in a recessed frame, with bolts, a
  // combination dial and a raised wheel that turns as the Vault works.
  const bolts = range(0, 11, 1).map((k) => {
    const a = (k * Math.PI) / 6
    return `<circle class="iso-detail" cx="${round1(40 + Math.cos(a) * 21)}" cy="${round1(34 + Math.sin(a) * 21)}" r="1"/>`
  }).join('')
  const spokes = range(0, 2, 1).map((k) => {
    const a = (k * Math.PI) / 3
    const [dx, dy] = [round1(Math.cos(a) * 16), round1(Math.sin(a) * 16)]
    return `<line class="iso-detail iso-vault-spoke" x1="${40 - dx}" y1="${34 - dy}" x2="${40 + dx}" y2="${34 + dy}"/>`
      + `<circle class="iso-face iso-top" cx="${40 - dx}" cy="${34 - dy}" r="1.8"/><circle class="iso-face iso-top" cx="${40 + dx}" cy="${34 + dy}" r="1.8"/>`
  }).join('')
  const ticks = range(0, 11, 1).map((k) => {
    const a = (k * Math.PI) / 6
    return `<line class="iso-detail" x1="${round1(66 + Math.cos(a) * 3.2)}" y1="${round1(14 + Math.sin(a) * 3.2)}" x2="${round1(66 + Math.cos(a) * 4.4)}" y2="${round1(14 + Math.sin(a) * 4.4)}"/>`
  }).join('')
  const door = onPlane(FRONT(140, 180, 72), '<text class="iso-label" x="5" y="8" font-size="6">VAULT</text>'
      + '<circle class="iso-face iso-side" cx="40" cy="34" r="27"/><circle class="iso-detail" cx="40" cy="34" r="25"/>')
    + drum(180, 180, 38, 23, 5)
    + onPlane(FRONT(140, 185, 72), '<circle class="iso-face iso-top" cx="40" cy="34" r="23"/>'
      + '<circle class="iso-pane iso-lit iso-vault-ring" cx="40" cy="34" r="19"/>'
      + '<circle class="iso-face iso-top" cx="40" cy="34" r="15"/>'
      + '<circle class="iso-detail" cx="40" cy="34" r="11"/><circle class="iso-detail" cx="40" cy="34" r="7"/>'
      + bolts)
    + drum(206, 180, 58, 5, 3)
    + onPlane(FRONT(140, 183, 72), `<circle class="iso-face iso-top" cx="66" cy="14" r="5"/>${ticks}`
      + '<line class="iso-detail" x1="66" y1="14" x2="66" y2="10.5"/>')
    + drum(180, 185, 38, 4, 3)
    + onPlane(FRONT(140, 188, 72), `<g class="iso-vault-wheel">${spokes}<circle class="iso-face iso-top" cx="40" cy="34" r="4"/></g>`)

  // Side: the display, vents and the hatch the conveyor runs out of.
  const side = onPlane(SIDE(220, 180, 72), '<rect class="iso-pane" x="8" y="8" width="64" height="18" rx="1.5"/>'
    + files.map((name, i) => `<g class="iso-vault-reveal iso-vault-file" ${delay(i * 3)}>`
      + '<text class="iso-label" x="11" y="13.5" font-size="3.6">STORED</text>'
      + `<text class="iso-screen-text" x="11" y="21.5" font-size="5">${name}</text></g>`).join('')
    + range(10, 50, 4).map((u) => `<line class="iso-detail" x1="${u}" y1="38" x2="${u}" y2="56"/>`).join('')
    + '<rect class="iso-face iso-front" x="58" y="40" width="20" height="21"/>'
    + '<rect class="iso-face iso-side" x="60" y="42" width="16" height="19"/>'
    + '<g class="iso-vault-hatch"><rect class="iso-face iso-top" x="60" y="42" width="16" height="19"/>'
    + range(46, 60, 3).map((v) => `<line class="iso-detail" x1="60" y1="${v}" x2="76" y2="${v}"/>`).join('') + '</g>')

  // Crates leave through the hatch (x 221 → 239) for the crane; --tx / --ty
  // carry each one's trip along x to its bucket.
  const crate = (x: number, cls: string, style: string) => `<g class="${cls}" style="${style}">`
    + box(x, 105, 13, 14, 14, 12)
    + onPlane(FRONT(x, 119, 25), '<text class="iso-screen-text" x="2.5" y="7.5" font-size="4.2">MP4</text>')
    + '</g>'
  const uploadCrate = (i: number, x0: number) => {
    const [tx, ty] = P(x0 + 18 - pickup, 0, 0)
    return crate(221, `iso-vault-crate${i === 0 ? ' iso-vault-crate--rest' : ''}`, `animation-delay: ${i * 3}s; --tx: ${tx}px; --ty: ${ty}px`)
  }

  // An open bucket: rim and opening (lit by each crate that lands in it, and
  // for the source bucket by Hub's fetch), then its crates, then the walls that hide them.
  const bucket = ([name, x0]: readonly [string, number], b: number) => {
    const uploads = range(0, agents.length - 1, 1).filter((i) => targets[i] === b)
    const opening = '<rect class="iso-pane" x="3" y="3" width="30" height="24" rx="1"/>'
    const lit = (cls: string, seconds: number) =>
      `<rect class="iso-pane iso-lit ${cls}" x="3" y="3" width="30" height="24" rx="1" ${delay(seconds)}/>`
    return onPlane(TOP(x0, 97, 48), '<rect class="iso-face iso-top" width="36" height="30"/>' + opening
      + uploads.map((i) => lit('iso-vault-fill', i * 3)).join('')
      + (b === source ? lit('iso-vault-fetch-fill', fetch) : ''))
    + uploads.map((i) => uploadCrate(i, x0)).join('')
    + `<rect class="iso-face iso-front" transform="${FRONT(x0, 127, 48)}" width="36" height="40"/>`
    + `<rect class="iso-face iso-side" transform="${SIDE(x0 + 36, 127, 48)}" width="30" height="40"/>`
    + onPlane(FRONT(x0, 127, 48), '<line class="iso-detail" x1="0" y1="4" x2="36" y2="4"/>'
      + `<text class="iso-label" x="4" y="12" font-size="5.5">${name}</text>`
      + range(6, 30, 6).map((u) => `<line class="iso-detail" x1="${u}" y1="18" x2="${u}" y2="36"/>`).join(''))
    + onPlane(SIDE(x0 + 36, 127, 48), '<line class="iso-detail" x1="0" y1="4" x2="30" y2="4"/>'
      + range(5, 25, 5).map((u) => `<line class="iso-detail" x1="${u}" y1="10" x2="${u}" y2="36"/>`).join(''))
  }

  // Each Agent has a different kind of camera on top.
  const cameras = ['bullet', 'dome', 'ptz', 'turret'] as const

  const [cableX, cableTop] = P(pickup, 112, 80)
  const [, cableBottom] = P(pickup, 112, 28)

  const markup = [
    // Ground plate with a grid and the zones.
    box(0, 0, 0, 420, 300, 8),
    onPlane(TOP(0, 0, 8), '<rect class="iso-detail" x="8" y="8" width="404" height="284" rx="10"/>'
      + grid
      + '<text class="iso-label iso-label--zone" x="20" y="286" font-size="7">SITE · AGENTS</text>'
      + '<text class="iso-label iso-label--zone" x="110" y="232" font-size="7">BRING YOUR OWN STORAGE</text>'
      + '<text class="iso-label iso-label--zone" x="300" y="172" font-size="7">YOUR BUCKETS</text>'
      + '<text class="iso-label iso-label--zone" x="292" y="286" font-size="7">HUB · PLAYBACK</text>'
      + wires),

    // Back legs of the crane's two portals.
    box(258, 90, 8, 4, 4, 84),
    box(400, 90, 8, 4, 4, 84),

    // The Vault: a safe with its main door, the display and the hatch.
    box(140, 100, 8, 80, 80, 64),
    door,
    side,

    // Conveyor out of the hatch, the buckets, then the rest of the crane.
    box(220, 104, 8, 36, 16, 5),
    onPlane(TOP(220, 104, 13), range(4, 34, 5).map((u) => `<line class="iso-detail" x1="${u}" y1="1" x2="${u}" y2="15"/>`).join('')),
    buckets.map(bucket).join(''),
    box(258, 132, 8, 4, 4, 84),
    box(400, 132, 8, 4, 4, 84),
    // The rail hangs under the two arches; the trolley runs beneath it.
    box(226, 108, 86, 180, 8, 6),
    onPlane(FRONT(226, 116, 92), range(8, 174, 12).map((u) => `<line class="iso-detail" x1="${u}" y1="1" x2="${u + 6}" y2="5"/>`).join('')),
    '<g class="iso-vault-trolley">'
      + box(240, 107, 80, 12, 10, 6)
      + `<line class="iso-wire iso-vault-cable" x1="${cableX}" y1="${cableTop}" x2="${cableX}" y2="${cableBottom}"/>`
      + `<g class="iso-vault-hook">${box(243.5, 109.5, 25, 5, 5, 3)}</g>`
      + '</g>',
    box(258, 90, 92, 4, 46, 4),
    box(400, 90, 92, 4, 46, 4),

    // Hub, at half size: it asks the bucket for the recording (the beacon
    // blinks) and its floors light bottom to top when the recording arrives.
    placeAt(hubBuilding(
      (f) => `class="iso-pane iso-lit iso-vault-hub-window" ${delay(fetch + f * 0.15)}`,
      `class="iso-beacon iso-lit iso-vault-beacon" ${delay(fetch)}`,
      false,
    ), [160, 80, 0], [300, 215, 0], 0.5),

    // Site: four Agents, each with its own kind of camera, uploading their
    // recordings.
    agents.map((cy, i) => box(24, cy, 8, 34, 24, 16)
      + onPlane(FRONT(24, cy + 24, 24), `<rect class="iso-led iso-lit iso-vault-agent-led" x="3" y="4.5" width="4" height="2.4" ${delay(i * 3)}/>`
        + `<text class="iso-label" x="9.5" y="7.6" font-size="4.6">AGENT ${i + 1}</text>`)
      + onPlane(SIDE(58, cy + 24, 24), range(4, 20, 3).map((u) => `<line class="iso-detail" x1="${u}" y1="4" x2="${u}" y2="11"/>`).join(''))
      + cameraHead(cameras[i], 41, cy + 12, 24)).join(''),
  ].join('')

  return {
    viewBox: frame([[0, 0, 0], [420, 0, 0], [0, 300, 0], [420, 300, 0], [258, 90, 96], [404, 136, 96], [331.5, 236.5, 68], [31, 50, 43]], 10),
    markup,
    glow: 2,
    bloom: 14,
  }
}

// Factory: the cameras on a site are found one at a time (a scan runs out to
// the camera); for each, Factory builds that camera's own Agent, a press
// stamps the global settings onto it and it rides the conveyor to the node it
// is deployed on. There it runs as a pod and records its camera: the stream
// runs from the camera to that node. A 12s round of four 3s beats, one camera
// per beat (3s delay each); the Factory's windows, hatch, beacon and press run
// on the beat.
function factory(): FigureDrawing {
  const cams = [60, 120, 180, 240]
  const kinds: CameraKind[] = ['bullet', 'dome', 'ptz', 'turret']
  // Cluster nodes (left x of each rack) and where each camera's Agent runs.
  const nodes = [290, 334, 378]
  const targets = [0, 1, 2, 0]
  const slots = [0, 0, 0, 1]
  const delay = (seconds: number) => `style="animation-delay: ${seconds}s"`
  const flow = (d: string, cls: string, i: number) =>
    `<path class="iso-pulse iso-lit ${cls}" d="${d}" pathLength="1000" ${delay(i * 3)}/>`

  const grid = range(30, 390, 30).map((x) => `<line class="iso-grid" x1="${x}" y1="10" x2="${x}" y2="290"/>`).join('')
    + range(30, 270, 30).map((y) => `<line class="iso-grid" x1="10" y1="${y}" x2="410" y2="${y}"/>`).join('')

  // Camera wires share one trunk (at x 60, clear of the Factory hall): down to
  // the Factory's front, which finds the cameras, and up and along the back to
  // the nodes, where each camera's own Agent records it once deployed.
  const nodeX = (k: number) => nodes[k] + 15
  const wires = cams.map((cy) => `<path class="iso-wire" d="M 32 ${cy} H 60"/>`).join('')
    + '<path class="iso-wire" d="M 60 30 V 210 H 150 V 200"/>'
    + `<path class="iso-wire" d="M 60 30 H ${nodeX(nodes.length - 1)}"/>`
    + nodes.map((_, k) => `<path class="iso-wire" d="M ${nodeX(k)} 30 V 100"/>`).join('')
    + cams.map((cy, i) => flow(`M 150 200 V 210 H 60 V ${cy} H 32`, 'iso-factory-scan', i)
      + flow(`M 32 ${cy} H 60 V 30 H ${nodeX(targets[i])} V 100`, 'iso-factory-record', i)).join('')

  // Sawtooth roof: four teeth rising toward the front, each with a glazed face.
  const polygon = (cls: string, points: Vec3[]) =>
    `<polygon class="${cls}" points="${points.map((point) => P(...point).join(',')).join(' ')}"/>`
  const tooth = (k: number) => {
    const [y0, y1] = [110 + k * 22.5, 132.5 + k * 22.5]
    return polygon('iso-face iso-top', [[120, y0, 48], [220, y0, 48], [220, y1, 60], [120, y1, 60]])
      + onPlane(FRONT(120, y1, 60), '<rect class="iso-face iso-front" width="100" height="12"/>'
        + range(0, 6, 1).map((j) => `<rect class="iso-pane iso-lit iso-factory-glass" x="${4 + j * 13.5}" y="2.5" width="10" height="7" ${delay(k * 0.08)}/>`).join(''))
      + polygon('iso-face iso-side', [[220, y0, 48], [220, y1, 48], [220, y1, 60]])
  }
  const [beaconX, beaconY] = P(213, 115, 80)

  // An Agent leaves the hatch (x 221), stops under the press (+23 units along
  // x), then rides to its node; --tx / --ty carry that last leg.
  const agent = (i: number) => {
    const [tx, ty] = P(nodes[targets[i]] + 8 - 244, 0, 0)
    return `<g class="iso-factory-agent" style="animation-delay: ${i * 3}s; --tx: ${tx}px; --ty: ${ty}px">`
      + box(221, 141, 13, 14, 14, 12)
      + onPlane(FRONT(221, 155, 25), `<rect class="iso-led iso-lit iso-factory-agent-led" x="2" y="2.5" width="3" height="1.8" ${delay(i * 3)}/>`
        + `<text class="iso-label" x="2" y="8.5" font-size="2.8">AGENT ${i + 1}</text>`)
      + '</g>'
  }

  const rack = (x: number, k: number) => box(x, 100, 8, 30, 30, 56)
    + onPlane(FRONT(x, 130, 64), `<text class="iso-label" x="3" y="7" font-size="4.4">NODE ${k + 1}</text>`
      + range(0, 3, 1).map((j) => `<rect class="iso-pane" x="3" y="${12 + j * 10}" width="24" height="6" rx="1"/>`).join('')
      + cams.map((_, i) => (targets[i] === k
        ? `<rect class="iso-pane iso-lit iso-factory-pod" x="3" y="${12 + slots[i] * 10}" width="24" height="6" rx="1" ${delay(i * 3)}/>`
          + `<text class="iso-label" x="5" y="${16.4 + slots[i] * 10}" font-size="3.2">AGENT ${i + 1}</text>`
        : '')).join(''))
    + onPlane(SIDE(x + 30, 130, 64), range(5, 26, 4).map((u) => `<line class="iso-detail" x1="${u}" y1="8" x2="${u}" y2="50"/>`).join(''))

  const markup = [
    // Ground plate with a grid and the zones.
    box(0, 0, 0, 420, 300, 8),
    onPlane(TOP(0, 0, 8), '<rect class="iso-detail" x="8" y="8" width="404" height="284" rx="10"/>'
      + grid
      + '<text class="iso-label iso-label--zone" x="20" y="286" font-size="7">SITE · CAMERAS</text>'
      + '<text class="iso-label iso-label--zone" x="112" y="232" font-size="7">FACTORY</text>'
      + '<text class="iso-label iso-label--zone" x="324" y="172" font-size="7">CLUSTER · AGENTS</text>'
      + wires),

    // Site: cameras of every kind on posts; each gets its own Agent.
    cams.map((cy, i) => box(28, cy - 2, 8, 4, 4, 22)
      + onPlane(FRONT(28, cy + 2, 27), `<rect class="iso-led iso-lit iso-factory-found" x="0.8" y="0.5" width="2.4" height="2.4" ${delay(i * 3)}/>`)
      // The bullet camera's own mount sits 5 units back and 3 to the left.
      + (kinds[i] === 'bullet' ? cameraHead('bullet', 35, cy + 3, 30) : cameraHead(kinds[i], 30, cy, 30))).join(''),

    // The Factory: a hall with a sawtooth roof, a chimney and a scanning antenna.
    box(120, 110, 8, 100, 90, 40),
    onPlane(FRONT(120, 200, 48), range(0, 3, 1).map((j) => `<rect class="iso-pane iso-lit iso-factory-glass" x="${6 + j * 14}" y="16" width="10" height="14" ${delay(0.3)}/>`).join('')
      + '<rect class="iso-face iso-side" x="62" y="14" width="30" height="26"/>'
      + range(18, 38, 4).map((v) => `<line class="iso-detail" x1="62" y1="${v}" x2="92" y2="${v}"/>`).join('')),
    onPlane(SIDE(220, 200, 48), range(6, 40, 4).map((u) => `<line class="iso-detail" x1="${u}" y1="10" x2="${u}" y2="30"/>`).join('')
      + '<rect class="iso-face iso-front" x="42" y="20" width="20" height="21"/>'
      + '<rect class="iso-face iso-side" x="44" y="22" width="16" height="19"/>'
      + '<g class="iso-factory-hatch"><rect class="iso-face iso-top" x="44" y="22" width="16" height="19"/>'
      + range(26, 40, 3).map((v) => `<line class="iso-detail" x1="44" y1="${v}" x2="60" y2="${v}"/>`).join('') + '</g>'),
    tooth(0),
    box(128, 116, 48, 8, 8, 34),
    box(212, 114, 50, 2, 2, 28),
    `<circle class="iso-beacon iso-lit iso-factory-beacon" cx="${beaconX}" cy="${beaconY}" r="2.2"/>`,
    range(1, 3, 1).map(tooth).join(''),

    // Cluster nodes behind the conveyor; each Agent slides into one as a pod.
    nodes.map(rack).join(''),

    // Conveyor out of the hatch, the settings press over it and the Agents.
    box(220, 140, 8, 180, 16, 5),
    onPlane(TOP(220, 140, 13), range(4, 178, 6).map((u) => `<line class="iso-detail" x1="${u}" y1="1" x2="${u}" y2="15"/>`).join('')),
    box(250, 132, 8, 3, 3, 40),
    cams.map((_, i) => agent(i)).join(''),
    box(250, 161, 8, 3, 3, 40),
    box(248, 130, 48, 8, 36, 5),
    onPlane(SIDE(256, 166, 53), '<text class="iso-label" x="4" y="3.9" font-size="3.4">SETTINGS</text>'),
    '<g class="iso-factory-press">' + box(247, 141, 30, 10, 14, 8)
      + onPlane(FRONT(247, 155, 38), '<circle class="iso-pane iso-lit iso-factory-gear" cx="5" cy="4" r="2.4"/>'
        + '<circle class="iso-face iso-top" cx="5" cy="4" r="0.9"/>')
      + box(250, 146, 38, 4, 4, 10) + '</g>',
  ].join('')

  return {
    viewBox: frame([[0, 0, 0], [420, 0, 0], [0, 300, 0], [420, 300, 0], [128, 116, 82], [213, 115, 82], [408, 100, 64], [20, 50, 49], [60, 20, 8]], 10),
    markup,
    glow: 2,
    bloom: 14,
  }
}

const FIGURES: Record<IsoFigure, () => FigureDrawing> = {
  agent,
  'control-tower': controlTower,
  hub,
  vault,
  factory,
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

  const { viewBox, markup, glow, bloom, loop } = build()
  const [x, y, width, height] = viewBox.split(' ').map(Number)
  // Filters work in scene units over a generous region: a perfectly straight
  // wire has a zero-height bounding box and would vanish under the default one.
  const region = `filterUnits="userSpaceOnUse" x="${x - width}" y="${y - height}" width="${width * 3}" height="${height * 3}"`

  return `<svg class="iso-figure iso-figure--${figure}" viewBox="${viewBox}" focusable="false"${loop ? ` data-iso-loop="${loop}"` : ''}`
    + ` style="--iso-glow: url(#${id}); --iso-bloom: url(#${id}-bloom)">`
    + `<defs><filter id="${id}" ${region}>`
    + `<feGaussianBlur stdDeviation="${glow}" result="blur"/>`
    + '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>'
    + '</filter>'
    + `<filter id="${id}-bloom" ${region}><feGaussianBlur stdDeviation="${bloom}"/></filter></defs>`
    + markup
    + '</svg>'
}
