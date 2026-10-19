import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildHtmlComponents } from './build-html-components.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const names = ['ApplicationLayout', 'EmptyState', 'MetricCard', 'Notice', 'SearchField', 'SegmentedControl', 'StatusBadge']
let output
let components

before(async () => {
  output = await mkdtemp(join(tmpdir(), 'uug-html-components-'))
  components = await buildHtmlComponents(output)
})

after(async () => {
  await rm(output, { recursive: true, force: true })
})

test('exports the Hub layout and six native widgets without a framework bundle', async () => {
  assert.deepEqual(components, ['application-layout', 'empty-state', 'metric-card', 'notice', 'search-field', 'segmented-control', 'status-badge'])
  for (const id of components) {
    const html = await readFile(join(output, id, 'index.html'), 'utf8')
    assert.match(html, /^<!doctype html>/)
    assert.match(html, /name="viewport"/)
    assert.match(html, /href="\.\.\/hub-tokens\.css"/)
    assert.match(html, /class="hub-ui-example"/)
    assert.doesNotMatch(html, /<script[^>]+src=|\/assets\/|node_modules|className=|\[ngClass\]|\{\{/)
  }
})

test('publishes the exact HTML and CSS sources shown in the catalogue', async () => {
  for (const name of names) {
    const id = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    const source = join(root, 'src/components', name)
    for (const file of ['example.html', 'component.css']) {
      assert.equal(await readFile(join(output, id, file), 'utf8'), await readFile(join(source, file), 'utf8'))
    }
    const example = await readFile(join(source, 'example.html'), 'utf8')
    assert.ok((await readFile(join(output, id, 'index.html'), 'utf8')).includes(example))
    assert.match(example, /class="/)
    assert.doesNotMatch(example, /className=|\*ng|\[ngClass\]|\{\{|<script/)
  }
})

test('ships shared theme tokens and complete component styles without imports', async () => {
  const tokens = await readFile(join(output, 'tokens.css'), 'utf8')
  const hubTokens = await readFile(join(output, 'hub-tokens.css'), 'utf8')
  assert.equal(tokens, await readFile(join(root, 'src/tokens.css'), 'utf8'))
  assert.match(tokens, /\[data-theme='dark'\]/)
  assert.equal(hubTokens, await readFile(join(root, 'src/hub-tokens.css'), 'utf8'))
  assert.match(hubTokens, /url\('\.\/fonts\/Inter-roman\.var\.woff2'\)/)
  assert.match(hubTokens, /\.hub-ui-example\s*{[^}]*background:\s*var\(--hub-ui-card\)/)
  assert.doesNotMatch(hubTokens, /@import|https?:/)
  for (const id of components) {
    const css = await readFile(join(output, id, 'component.css'), 'utf8')
    assert.doesNotMatch(css, /@import|https?:|React|Angular/)
    const declared = new Set([...`${hubTokens}\n${css}`.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]))
    for (const [, variable] of css.matchAll(/var\((--[\w-]+)/g)) {
      assert.ok(declared.has(variable), `${id} is missing the ${variable} token`)
    }
  }
})

test('only interactive examples load dependency-free native behavior', async () => {
  const script = await readFile(join(output, 'behaviors.js'), 'utf8')
  assert.doesNotMatch(script, /^import\s|from ['"]|require\(/m)
  assert.match(script, /export function enhanceComponents/)
  for (const id of components) {
    const html = await readFile(join(output, id, 'index.html'), 'utf8')
    assert.equal(html.includes('type="module"'), ['application-layout', 'segmented-control', 'notice'].includes(id))
  }
  const files = await readdir(output)
  assert.ok(files.includes('behaviors.js'))
})

test('keeps search clearing opt-in and ships every layout stylesheet', async () => {
  const search = await readFile(join(output, 'search-field/example.html'), 'utf8')
  assert.doesNotMatch(search, /data-ui-clear|data-ui-component/)
  const clearable = await readFile(join(output, 'search-field/clearable.html'), 'utf8')
  assert.match(clearable, /data-ui-clear/)
  assert.equal(clearable, await readFile(join(root, 'src/components/SearchField/clearable.html'), 'utf8'))
  const layout = await readFile(join(output, 'application-layout/index.html'), 'utf8')
  for (const id of components.filter((id) => id !== 'application-layout')) {
    assert.ok(layout.includes(`href="../${id}/component.css"`), `Layout is missing ${id} CSS`)
  }
  assert.deepEqual(await readFile(join(output, 'fonts/Inter-roman.var.woff2')),
    await readFile(join(root, 'src/fonts/Inter-roman.var.woff2')))
  assert.match(await readFile(join(output, 'fonts/Inter-LICENSE.txt'), 'utf8'), /SIL OPEN FONT LICENSE/)
})

test('tracks the actual Hub light/dark tokens and font when Hub source is available', async (t) => {
  const hub = join(root, '../hub-frontend/kerberos.ng/src')
  let source
  try {
    source = await readFile(join(hub, 'scss/_app.variables.scss'), 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return t.skip('Hub source is absent in a standalone design checkout')
    throw error
  }
  const tokens = await readFile(join(root, 'src/hub-tokens.css'), 'utf8')
  const aliases = { accent: 'hub', 'accent-hsl': 'hub-hsl', 'accent-darker': 'hub-darker',
    'text-inverse': 'text-darker', 'upper-gradient': 'upper-gradient' }
  const names = ['accent', 'accent-hsl', 'accent-darker', 'text', 'text-muted', 'text-muted-hsl',
    'text-light', 'text-inverse', 'card', 'card-muted', 'bg', 'bg-muted', 'bg-muted-hsl',
    'bg-white', 'info', 'info-hsl', 'success', 'success-hsl', 'warning', 'warning-hsl',
    'alert', 'alert-hsl', 'radius', 'upper-gradient']
  const declaration = (css, name) => {
    const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`))
    assert.ok(match, `Missing ${name}`)
    return match[1].trim()
  }
  for (const name of names) {
    assert.equal(declaration(tokens, `hub-ui-${name}`), declaration(source, aliases[name] ?? name), name)
  }
  const darkSource = source.slice(source.indexOf('body.dark-theme,'))
  const darkTokens = tokens.slice(tokens.indexOf("[data-theme='dark'],"))
  for (const name of ['text', 'text-muted', 'text-muted-hsl', 'text-light', 'text-inverse',
    'card', 'card-muted', 'bg', 'bg-muted', 'bg-muted-hsl', 'bg-white', 'upper-gradient']) {
    assert.equal(declaration(darkTokens, `hub-ui-${name}`), declaration(darkSource, aliases[name] ?? name), `dark ${name}`)
  }
  assert.deepEqual(await readFile(join(root, 'src/fonts/Inter-roman.var.woff2')),
    await readFile(join(hub, 'fonts/Inter/Inter-roman.var.woff2')))
  for (const name of ['search', 'info-circle', 'exclamation-circle']) {
    assert.deepEqual(await readFile(join(root, `src/components/html/icons/${name}.svg`)),
      await readFile(join(hub, `assets/images/icon/${name}.svg`)), `Hub ${name} glyph`)
  }
})
