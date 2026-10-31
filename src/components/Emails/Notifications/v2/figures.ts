import { box, frame, FRONT, onPlane, P, range, SIDE, TOP, type Vec3 } from '../../../IsoIllustration/iso'

// Spot illustrations for the v2 notification emails, drawn with the iso kernel of the
// Illustrations section. Email clients ignore stylesheets and most drop inline SVG, so
// each figure is a standalone SVG with its colours baked in: Storybook shows it as a
// data URI and the emails get a PNG export of it.

export type EmailFigure =
  | 'welcome' | 'activate' | 'forgot' | 'newip' | 'detection' | 'device' | 'device_group'
  | 'disable' | 'highupload' | 'share' | 'share_case' | 'share_case_otp' | 'assign_task'

interface Drawing { markup: string; bounds: Vec3[] }

const grid = (x0: number, y0: number, x1: number, y1: number, step = 20) => onPlane(TOP(0, 0, 0),
  range(x0, x1, step).map(at => `<line class="g" x1="${at}" y1="${y0}" x2="${at}" y2="${y1}"/>`).join('')
  + range(y0, y1, step).map(at => `<line class="g" x1="${x0}" y1="${at}" x2="${x1}" y2="${at}"/>`).join(''))

// The corners of the block from (x0, y0, 0) to (x1, y1, z), for fitting a frame to the objects.
const block = (x0: number, y0: number, x1: number, y1: number, z: number): Vec3[] =>
  [[x0, y1, 0], [x1, y1, 0], [x1, y0, 0], [x0, y0, z], [x0, y1, z], [x1, y0, z]]

const lines = (x: number, y: number, width: number, count: number, gap = 5) =>
  range(0, count - 1, 1).map(i => `<line class="d" x1="${x}" y1="${y + i * gap}" x2="${x + (i === count - 1 ? width * 0.6 : width)}" y2="${y + i * gap}"/>`).join('')

// A camera on a pole facing the viewer, its recording light lit.
function camera(x: number, y: number, pole = 40) {
  return box(x, y + 20, 0, 4, 4, pole)
    + box(x - 3, y, pole, 10, 26, 10)
    + onPlane(FRONT(x - 3, y + 26, pole + 10), '<circle class="t" cx="5" cy="5" r="3.4"/><circle class="d" cx="5" cy="5" r="1.8"/>')
    + onPlane(SIDE(x + 7, y + 26, pole + 10), '<circle class="lit" cx="3" cy="3" r="1"/>')
}

// An Agent box with two status lights; `on` lights the first one.
function agentBox(x: number, y: number, on = true) {
  return box(x, y, 0, 22, 16, 12)
    + onPlane(FRONT(x, y + 16, 12), `<rect class="${on ? 'lit' : 'd'}" x="3" y="3" width="4" height="2"/><rect class="d" x="9" y="3" width="4" height="2"/><line class="d" x1="3" y1="8" x2="19" y2="8"/>`)
    + onPlane(SIDE(x + 22, y + 16, 12), range(3, 13, 3).map(u => `<line class="d" x1="${u}" y1="3" x2="${u}" y2="9"/>`).join(''))
}

// A screen standing on a foot, `content` drawn on its front face (60 x 36).
function screen(x: number, y: number, z: number, content: string) {
  return box(x + 24, y, 0, 12, 8, 3) + box(x + 28, y + 2, 3, 4, 3, z - 3)
    + box(x, y + 2, z, 60, 3, 36) + onPlane(FRONT(x, y + 5, z + 36), content)
}

const FIGURES: Record<EmailFigure, () => Drawing> = {
  // An envelope with a welcome letter standing up out of it.
  welcome: () => ({
    markup: grid(-20, -10, 120, 90)
      + box(10, 20, 0, 80, 50, 4)
      + onPlane(TOP(10, 20, 4), '<path class="d" d="M 0 0 L 40 26 L 80 0"/>')
      + box(20, 40, 4, 60, 3, 50)
      + onPlane(FRONT(20, 43, 54), '<rect class="lit" x="6" y="6" width="14" height="14" rx="7"/>' + lines(6, 28, 48, 3))
      + box(10, 58, 0, 80, 12, 16)
      + onPlane(FRONT(10, 70, 16), '<path class="d" d="M 0 0 L 40 12 L 80 0"/>'),
    bounds: block(10, 20, 90, 70, 54),
  }),
  // A switch flipped on in front of a check badge: the account is active.
  activate: () => ({
    markup: grid(-20, -10, 120, 90)
      + box(38, 15, 0, 34, 4, 44)
      + onPlane(FRONT(38, 19, 44), '<circle class="lit" cx="17" cy="16" r="11"/><path class="w" d="M 11.5 16 L 15.5 20 L 22.5 12"/>' + lines(7, 34, 20, 2))
      + box(10, 34, 0, 80, 36, 8)
      + onPlane(TOP(10, 34, 8), '<rect class="lit" x="14" y="8" width="52" height="20" rx="10"/><circle class="t" cx="56" cy="18" r="7.5"/>'),
    bounds: block(10, 15, 90, 70, 58),
  }),
  // A padlock with its key lying in front of it.
  forgot: () => ({
    markup: grid(-20, -10, 120, 90)
      + onPlane(FRONT(32, 30, 86), '<path class="shackle" d="M 6 30 V 14 A 14 14 0 0 1 34 14 V 30"/>')
      + box(28, 20, 0, 44, 22, 56)
      + onPlane(FRONT(28, 42, 56), '<circle class="lit" cx="22" cy="20" r="5"/><rect class="lit" x="20" y="22" width="4" height="12"/>' + lines(8, 44, 28, 2))
      + onPlane(TOP(30, 60, 1), '<circle class="t" cx="8" cy="8" r="8"/><circle class="d" cx="8" cy="8" r="3"/><rect class="t" x="15" y="6" width="34" height="4"/><rect class="lit" x="38" y="10" width="4" height="6"/><rect class="lit" x="44" y="10" width="4" height="4"/>'),
    bounds: [...block(28, 20, 80, 76, 56), [32, 30, 86], [76, 30, 86]],
  }),
  // A laptop with a location pin over it: a sign-in from somewhere new.
  newip: () => {
    const [px, py] = P(55, 40, 78)
    return {
      markup: grid(-20, -10, 120, 90)
        + box(20, 30, 0, 70, 44, 3)
        + onPlane(TOP(20, 30, 3), range(0, 4, 1).map(i => `<line class="d" x1="8" y1="${8 + i * 6}" x2="62" y2="${8 + i * 6}"/>`).join(''))
        + box(20, 26, 3, 70, 4, 44)
        + onPlane(FRONT(20, 30, 47), '<rect class="pane" x="5" y="5" width="60" height="34"/>' + lines(12, 14, 30, 3))
        + `<ellipse class="halo" cx="${P(55, 52, 0)[0]}" cy="${P(55, 52, 0)[1]}" rx="18" ry="9"/>`
        + `<path class="lit" d="M ${px} ${py + 22} C ${px - 4} ${py + 14}, ${px - 12} ${py + 8}, ${px - 12} ${py} A 12 12 0 1 1 ${px + 12} ${py} C ${px + 12} ${py + 8}, ${px + 4} ${py + 14}, ${px} ${py + 22} Z"/>`
        + `<circle class="t" cx="${px}" cy="${py}" r="4.5"/>`,
      bounds: [...block(20, 26, 90, 74, 47), [55, 40, 92]],
    }
  },
  // A camera whose view cone falls on a person, framed by a detection box.
  detection: () => ({
    markup: grid(-20, -10, 140, 90)
      + onPlane(TOP(0, 0, 0), '<path class="cone" d="M 6 30 L 70 6 L 110 50 L 6 34 Z"/>')
      + camera(0, 10, 44)
      + box(78, 28, 0, 8, 8, 28) + box(79, 29, 28, 6, 6, 7)
      + onPlane(FRONT(70, 40, 42), '<rect class="frame" x="0" y="0" width="26" height="44"/>')
      + onPlane(FRONT(70, 40, 50), '<rect class="lit" x="0" y="0" width="26" height="7"/>'),
    bounds: [...block(-3, 6, 112, 52, 54), [96, 40, 50]],
  }),
  // A camera and its Agent with the wire between them cut: one device changed status.
  device: () => ({
    markup: grid(-20, -10, 120, 90)
      + onPlane(TOP(0, 0, 0), '<path class="wire" d="M 12 60 H 40"/><path class="wire" d="M 52 60 H 74"/><path class="cut" d="M 43 55 L 49 65 M 49 55 L 43 65"/>')
      + camera(0, 34, 40)
      + agentBox(70, 52, false)
      + onPlane(FRONT(70, 68, 40), '<path class="warn" d="M 11 0 L 22 19 H 0 Z"/><line class="w" x1="11" y1="6" x2="11" y2="12"/><circle class="wdot" cx="11" cy="15.5" r="1"/>'),
    bounds: block(-3, 34, 96, 72, 50),
  }),
  // Three cameras on one site platform, two of them off: several devices changed together.
  device_group: () => ({
    markup: grid(-20, -20, 140, 100)
      + box(0, 0, 0, 120, 70, 6)
      + onPlane(TOP(0, 0, 6), '<rect class="pane" x="6" y="6" width="108" height="58" rx="4"/><text class="label" x="10" y="16">SITE</text>')
      + [[20, 4], [55, 18], [90, 32]].map(([x, y], i) => onPlaneCamera(x, y, i === 2)).join(''),
    bounds: [...block(0, 0, 120, 70, 6), [17, 4, 52], [87, 32, 52]],
  }),
  // A storage meter filled to the brim with a pause sign: the daily limit is reached.
  disable: () => ({
    markup: grid(-20, -10, 120, 90)
      + box(30, 20, 0, 40, 30, 70)
      + onPlane(FRONT(30, 50, 70), range(0, 6, 1).map(i => `<rect class="lit" x="6" y="${8 + i * 8.5}" width="28" height="6"/>`).join(''))
      + onPlane(SIDE(70, 50, 70), lines(5, 10, 20, 3, 6))
      + box(74, 40, 0, 26, 26, 4)
      + onPlane(TOP(74, 40, 4), '<circle class="t" cx="13" cy="13" r="11"/><rect class="lit" x="8" y="7" width="3.5" height="12"/><rect class="lit" x="14.5" y="7" width="3.5" height="12"/>'),
    bounds: block(30, 20, 100, 66, 70),
  }),
  // An Agent sending a tall stack of recordings up: unusually many uploads.
  highupload: () => ({
    markup: grid(-20, -10, 120, 90)
      + agentBox(14, 50)
      + range(0, 4, 1).map(i => box(58, 22, i * 9, 32, 22, 6)
        + onPlane(FRONT(58, 44, i * 9 + 6), `<rect class="${i === 4 ? 'lit' : 'd'}" x="3" y="2" width="8" height="2"/>`)).join('')
      + onPlane(FRONT(36, 58, 70), '<path class="arrow" d="M 8 40 V 4 M 2 10 L 8 4 L 14 10"/><path class="arrow" d="M 22 30 V 0 M 16 6 L 22 0 L 28 6"/>'),
    bounds: [...block(14, 22, 90, 66, 42), [36, 58, 72]],
  }),
  // A video tile with a play button, sent on to a second screen.
  share: () => ({
    markup: grid(-20, -10, 140, 90)
      + screen(0, 30, 10, '<rect class="pane" x="4" y="4" width="52" height="28"/><path class="lit" d="M 25 11 L 36 18 L 25 25 Z"/>')
      + onPlane(TOP(0, 0, 0), '<path class="wire wire--dash" d="M 66 36 H 96"/><path class="lit" d="M 96 32 L 102 36 L 96 40 Z"/>')
      + box(104, 20, 0, 22, 34, 4) + box(106, 22, 4, 18, 30, 3),
    bounds: [...block(0, 30, 126, 54, 46)],
  }),
  // A case folder held shut by a link: someone shared a case.
  share_case: () => ({
    markup: grid(-20, -10, 120, 90)
      + box(18, 20, 0, 64, 46, 10)
      + onPlane(TOP(18, 20, 10), '<path class="pane" d="M 0 0 H 24 L 30 6 H 64 V 46 H 0 Z"/>')
      + box(24, 26, 10, 52, 34, 6)
      + onPlane(FRONT(24, 60, 16), '<text class="label" x="4" y="5">CASE</text>')
      + onPlane(TOP(24, 26, 16), lines(6, 8, 32, 3, 6))
      + onPlane(FRONT(36, 60, 44), '<rect class="link" x="0" y="8" width="18" height="10" rx="5"/><rect class="link link--lit" x="12" y="8" width="18" height="10" rx="5"/>'),
    bounds: [...block(18, 20, 82, 66, 16), [36, 60, 44], [66, 60, 44]],
  }),
  // A phone showing a six-digit code next to a padlock: a one-time code.
  share_case_otp: () => ({
    markup: grid(-20, -10, 120, 90)
      + box(20, 30, 0, 30, 4, 56)
      + onPlane(FRONT(20, 34, 56), '<rect class="pane" x="3" y="4" width="24" height="44" rx="2"/>'
        + range(0, 2, 1).map(i => `<rect class="lit" x="${6 + i * 6.5}" y="20" width="5" height="7" rx="1"/>`).join('')
        + range(0, 2, 1).map(i => `<rect class="lit" x="${6 + i * 6.5}" y="29" width="5" height="7" rx="1"/>`).join(''))
      + onPlane(FRONT(64, 50, 46), '<path class="shackle" d="M 3 16 V 9 A 8 8 0 0 1 19 9 V 16"/>')
      + box(62, 40, 0, 26, 12, 30)
      + onPlane(FRONT(62, 52, 30), '<circle class="lit" cx="13" cy="11" r="3"/><rect class="lit" x="11.5" y="12" width="3" height="7"/>'),
    bounds: [...block(20, 30, 88, 52, 56), [64, 50, 46]],
  }),
  // A clipboard with a checklist, the first item ticked: a task assigned to you.
  assign_task: () => ({
    markup: grid(-20, -10, 120, 90)
      + box(30, 34, 0, 50, 4, 66)
      + box(43, 33, 64, 24, 6, 6)
      + onPlane(FRONT(30, 38, 66), '<rect class="pane" x="4" y="8" width="42" height="54"/>'
        + range(0, 3, 1).map(i => `<rect class="${i === 0 ? 'lit' : 't'}" x="9" y="${15 + i * 11}" width="6" height="6"/><line class="d" x1="19" y1="${18 + i * 11}" x2="${i === 3 ? 30 : 40}" y2="${18 + i * 11}"/>`).join('')
        + '<path class="w" d="M 10 18 L 12 20 L 14.5 16"/>'),
    bounds: block(30, 33, 80, 38, 70),
  }),
}

// A camera standing on the site platform; `off` greys its light and marks it with a cross.
function onPlaneCamera(x: number, y: number, on: boolean) {
  const lift = 6
  const pole = 30
  return box(x, y + 20, lift, 4, 4, pole)
    + box(x - 3, y, lift + pole, 10, 26, 10)
    + onPlane(FRONT(x - 3, y + 26, lift + pole + 10), '<circle class="t" cx="5" cy="5" r="3.4"/><circle class="d" cx="5" cy="5" r="1.8"/>')
    + onPlane(SIDE(x + 7, y + 26, lift + pole + 10), on ? '<circle class="ok" cx="3" cy="3" r="1.2"/>' : '<circle class="lit" cx="3" cy="3" r="1.2"/>')
    + (on ? '' : onPlane(FRONT(x - 3, y + 26, lift + pole + 22), '<path class="cut" d="M 2 0 L 8 6 M 8 0 L 2 6"/>'))
}

export const EMAIL_FIGURES = Object.keys(FIGURES) as EmailFigure[]

/** A standalone SVG for an email figure, coloured with `accent`. */
export function renderEmailFigure(figure: EmailFigure, accent: string) {
  const { markup, bounds } = FIGURES[figure]()
  const style = [
    'line,path,rect,circle,ellipse{stroke-linejoin:round;stroke-linecap:round}',
    '.iso-face{stroke:rgba(11,11,18,.42);stroke-width:.7}',
    '.iso-top{fill:#ffffff}.iso-front{fill:#f7f6fa}.iso-side{fill:#ebe8f2}',
    '.t{fill:#ffffff;stroke:rgba(11,11,18,.42);stroke-width:.7}',
    '.d{fill:none;stroke:rgba(11,11,18,.2);stroke-width:.7}',
    `.g{stroke:${accent};stroke-opacity:.12;stroke-width:.6}`,
    `.lit{fill:${accent};stroke:none}`,
    `.pane{fill:${accent};fill-opacity:.1;stroke:${accent};stroke-opacity:.5;stroke-width:.6}`,
    `.halo{fill:${accent};opacity:.12}`,
    `.cone{fill:${accent};fill-opacity:.1;stroke:${accent};stroke-opacity:.35;stroke-width:.6}`,
    `.frame{fill:none;stroke:${accent};stroke-width:1.2;stroke-dasharray:3 2}`,
    `.wire{fill:none;stroke:rgba(11,11,18,.42);stroke-width:.8}.wire--dash{stroke:${accent};stroke-dasharray:3 3}`,
    `.cut{fill:none;stroke:${accent};stroke-width:1.6}`,
    `.warn{fill:${accent};stroke:none}.w{fill:none;stroke:#ffffff;stroke-width:1.6}.wdot{fill:#ffffff}`,
    `.arrow{fill:none;stroke:${accent};stroke-width:2}`,
    `.shackle{fill:none;stroke:rgba(11,11,18,.42);stroke-width:5}`,
    `.link{fill:none;stroke:rgba(11,11,18,.42);stroke-width:2}.link--lit{stroke:${accent}}`,
    '.ok{fill:#5fab6d;stroke:none}',
    `.label{font:600 4px Inter,Arial,sans-serif;letter-spacing:.6px;fill:${accent}}`,
  ].join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame(bounds, 4)}"><style>${style}</style>${markup}</svg>`
}
