import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolve, join, dirname } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { build } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const check = process.argv.includes('--check')
const source = resolve(process.argv.slice(2).find(arg => arg !== '--check') ?? join(root, '../collaborate/web'))
const selected = ['basic-setup', 'hybrid-setup', 'cloud-setup']
const require = createRequire(import.meta.url)

async function output(path, content) {
  const destination = join(root, path)
  if (check) {
    if (!(await readFile(destination)).equals(Buffer.from(content))) throw new Error(`Draw template snapshot is out of sync: ${path}`)
  } else {
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(destination, content)
  }
}

const modules = {
  'templates/catalogue.ts': ['learnTemplates'],
  'templates/diagram.ts': ['diagramShapes'],
  'components/ConnectorView.tsx': ['Shapes'],
  'components/BlockView.tsx': ['BlockShadow'],
  'geometry.ts': ['bounds', 'union'],
}
const bundle = await build({
  configFile: false,
  root,
  logLevel: 'error',
  plugins: [{
    name: 'draw-template-snapshot',
    resolveId(id) {
      if (id === 'draw-template-snapshot' || id === join(root, 'draw-template-snapshot')) return '\0draw-template-snapshot'
    },
    load(id) {
      if (id === '\0draw-template-snapshot') return Object.entries(modules)
        .map(([path, names]) => `export { ${names.join(', ')} } from ${JSON.stringify(join(source, 'src', path))};`).join('\n')
    },
  }],
  build: {
    write: false,
    minify: false,
    lib: { entry: 'draw-template-snapshot', formats: ['es'] },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: { paths: id => pathToFileURL(require.resolve(id)).href },
    },
  },
})

const outputs = Array.isArray(bundle) ? bundle.flatMap(result => result.output) : bundle.output
const chunk = outputs.find(output => output.type === 'chunk')
if (!chunk) throw new Error('Draw template renderer bundle is missing')
const { learnTemplates, diagramShapes, Shapes, BlockShadow, bounds, union } =
  await import(`data:text/javascript;base64,${Buffer.from(chunk.code).toString('base64')}`)
const css = await readFile(join(source, 'src/index.css'), 'utf8')
const palette = css.match(/:root \{[^}]+\}/)?.[0]
if (!palette) throw new Error('Missing Draw light palette')
const styles = ['block-card', 'block-title', 'block-subtitle', 'block-shadow'].map(name => {
  const rule = css.match(new RegExp(`\\.${name} \\{[^}]+\\}`))?.[0]
  if (!rule) throw new Error(`Missing Draw block style: ${name}`)
  return rule
})
const metadata = []
for (const id of selected) {
  const template = learnTemplates.find(template => template.id === id)
  if (!template) throw new Error(`Missing Draw template: ${id}`)
  let index = 0
  const shapes = diagramShapes(template.diagram, () => `template-${id}-${index++}`)
  const box = union(shapes.map(bounds))
  if (!box) throw new Error(`Empty Draw template: ${id}`)
  const area = { x: box.x - 24, y: box.y - 24, w: box.w + 48, h: box.h + 48 }
  let svg = renderToStaticMarkup(createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: `${area.x} ${area.y} ${area.w} ${area.h}`,
    width: area.w,
    height: area.h,
  },
  createElement('title', null, `${template.title} architecture template`),
  createElement('style', null, `${palette}\n${styles.join('\n')}`),
  createElement('rect', { x: area.x, y: area.y, width: area.w, height: area.h, fill: 'var(--canvas)' }),
  createElement('defs', null, createElement(BlockShadow)),
  createElement(Shapes, { shapes })))
  for (const href of new Set([...svg.matchAll(/<image[^>]+href="([^"]+)"/g)].map(match => match[1]))) {
    if (!/^\/(?:badges|cloud|generic|kubernetes)\/[\w.-]+\.svg$/.test(href)) throw new Error(`Unexpected Draw template asset: ${href}`)
    const asset = await readFile(join(source, 'public', href.slice(1)))
    svg = svg.replaceAll(`href="${href}"`, `href="data:image/svg+xml;base64,${asset.toString('base64')}"`)
  }
  const preview = `/draw-templates/${id}.svg`
  await output(`public${preview}`, `<!-- Generated from Draw's ${id} template by scripts/sync-draw-templates.mjs. -->\n${svg}\n`)
  metadata.push({
    id,
    title: template.title,
    description: template.description,
    source: template.source,
    preview,
  })
}
await output('src/config/drawTemplates.json', `${JSON.stringify(metadata, null, 2)}\n`)
console.log(`${check ? 'Verified' : 'Synchronized'} ${metadata.length} real Draw architecture templates and self-contained previews.`)
