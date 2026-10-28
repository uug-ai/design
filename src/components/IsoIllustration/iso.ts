// Isometric projection kernel for the iso illustrations (after the iso-figure /
// iso-glow kernel). Framework free: everything returns SVG strings, so the
// Angular Hub frontend and the website can reuse it as is.
// +x runs down-right, +y down-left, +z up. Faces are drawn as ordinary SVG
// inside a plane transform, so rects, lines and circles land on the face.
// Paint order is the only depth sort: draw back to front.

export type Vec3 = [number, number, number]

const C = Math.cos(Math.PI / 6)
const S = Math.sin(Math.PI / 6)
const round = (value: number) => Math.round(value * 1000) / 1000

export const P = (x: number, y: number, z: number): [number, number] => [
  round((x - y) * C),
  round((x + y) * S - z),
]

function plane(origin: Vec3, u: Vec3, v: Vec3) {
  const [ox, oy] = P(...origin)
  const [ux, uy] = P(...u)
  const [vx, vy] = P(...v)
  return `matrix(${ux} ${uy} ${vx} ${vy} ${ox} ${oy})`
}

export const TOP = (x: number, y: number, z: number) => plane([x, y, z], [1, 0, 0], [0, 1, 0])
// The y = max face (lower left); local v grows downward from the top edge.
export const FRONT = (x: number, y: number, z: number) => plane([x, y, z], [1, 0, 0], [0, 0, -1])
// The x = max face (lower right); local u runs along -y.
export const SIDE = (x: number, y: number, z: number) => plane([x, y, z], [0, -1, 0], [0, 0, -1])

export const onPlane = (transform: string, content: string) => `<g transform="${transform}">${content}</g>`

/** A box is its three visible faces: front (max y), side (max x) and top. */
export function box(x: number, y: number, z: number, w: number, d: number, h: number) {
  return '<g>'
    + `<rect class="iso-face iso-front" transform="${FRONT(x, y + d, z + h)}" width="${w}" height="${h}"/>`
    + `<rect class="iso-face iso-side" transform="${SIDE(x + w, y + d, z + h)}" width="${d}" height="${h}"/>`
    + `<rect class="iso-face iso-top" transform="${TOP(x, y, z + h)}" width="${w}" height="${d}"/>`
    + '</g>'
}

/** viewBox that fits the projected extreme points, with padding. */
export function frame(points: Vec3[], pad = 6) {
  const projected = points.map((point) => P(...point))
  const xs = projected.map(([x]) => x)
  const ys = projected.map(([, y]) => y)
  const minX = Math.min(...xs) - pad
  const minY = Math.min(...ys) - pad
  return `${round(minX)} ${round(minY)} ${round(Math.max(...xs) + pad - minX)} ${round(Math.max(...ys) + pad - minY)}`
}

export const range = (from: number, to: number, step: number) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step)
