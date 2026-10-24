import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { strFromU8, unzipSync } from 'fflate'
import { buildFaviconSet } from './build-favicon-set.mjs'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

test('full favicon set contains current artwork and portable website setup files', async (t) => {
  const temporary = await mkdtemp(join(tmpdir(), 'uug-favicon-set-'))
  t.after(() => rm(temporary, { recursive: true, force: true }))
  const outputFile = join(temporary, 'uug-favicon-set.zip')
  await buildFaviconSet(outputFile)
  const archive = await readFile(outputFile)
  const files = unzipSync(archive)
  assert.deepEqual(Object.keys(files).sort(), [
    'README.txt',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'apple-touch-icon.png',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon.ico',
    'head.html',
    'site.webmanifest',
  ].sort())

  for (const name of Object.keys(files).filter((name) => /\.(png|ico)$/.test(name))) {
    assert.deepEqual(Buffer.from(files[name]), await readFile(join(projectRoot, 'public', name)))
  }
  for (const [name, size] of [
    ['favicon-16x16.png', 16], ['favicon-32x32.png', 32],
    ['apple-touch-icon.png', 180], ['android-chrome-192x192.png', 192],
    ['android-chrome-512x512.png', 512],
  ]) {
    const png = Buffer.from(files[name])
    assert.equal(png.readUInt32BE(16), size)
    assert.equal(png.readUInt32BE(20), size)
  }

  const ico = Buffer.from(files['favicon.ico'])
  assert.equal(ico.readUInt16LE(2), 1)
  assert.equal(ico.readUInt16LE(4), 3)
  assert.deepEqual([0, 1, 2].map((index) => ico[6 + index * 16]), [16, 32, 48])

  const manifest = JSON.parse(strFromU8(files['site.webmanifest']))
  assert.equal(manifest.name, 'UUG')
  assert.equal(manifest.short_name, 'UUG')
  assert.deepEqual(manifest.icons.map((icon) => icon.sizes), ['192x192', '512x512'])
  for (const icon of manifest.icons) {
    assert.ok(files[icon.src], `${icon.src} is included in the ZIP`)
    assert.equal(icon.type, 'image/png')
    const rootUrl = new URL(icon.src, 'https://example.com/site.webmanifest')
    const subdirectoryUrl = new URL(icon.src, 'https://example.com/brand/site.webmanifest')
    assert.equal(rootUrl.pathname, `/${icon.src}`)
    assert.equal(subdirectoryUrl.pathname, `/brand/${icon.src}`)
  }
  const head = strFromU8(files['head.html'])
  const links = [...head.matchAll(/href="\/([^"]+)"/g)].map((match) => match[1])
  assert.deepEqual(links, [
    'apple-touch-icon.png', 'favicon-32x32.png', 'favicon-16x16.png',
    'favicon.ico', 'site.webmanifest',
  ])
  for (const name of links) assert.ok(files[name], `${name} in head.html is included`)
  assert.ok(strFromU8(files['README.txt']).includes('public/'))
  assert.ok(strFromU8(files['README.txt']).includes('name and short_name'))

  await buildFaviconSet(outputFile)
  assert.deepEqual(await readFile(outputFile), archive, 'rebuilding unchanged assets is deterministic')
})
