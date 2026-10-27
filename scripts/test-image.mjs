import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'

const json = (path) => JSON.parse(readFileSync(path, 'utf8'))

test('image inventory preserves every locked dependency including Storybook', () => {
  const source = json('package-lock.json')
  const inventory = json('image-inventory/package-lock.json')
  const manifest = json('image-inventory/package.json')
  assert.deepEqual(Object.keys(inventory.packages), Object.keys(source.packages))
  assert.ok(manifest.dependencies.storybook)
  assert.ok(manifest.dependencies['@storybook/addon-docs'])
  assert.equal(manifest.devDependencies, undefined)
  for (const [path, entry] of Object.entries(source.packages)) {
    const copy = inventory.packages[path]
    for (const field of ['version', 'resolved', 'integrity']) {
      assert.equal(copy[field], entry[field], `${path}: ${field}`)
    }
    assert.equal(copy.dev, undefined, path)
    assert.equal(copy.devOptional, undefined, path)
  }
})

test('production app and Storybook retain local browser asset paths', () => {
  for (const [path, base] of [['index.html', '/'], ['storybook/index.html', '/storybook/'], ['storybook/iframe.html', '/storybook/']]) {
    const html = readFileSync(`dist/${path}`, 'utf8')
    const assets = [...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)]
    assert.ok(assets.length, path)
    for (const [, asset] of assets) {
      const url = new URL(asset, `https://design.example${base}`)
      if (url.origin !== 'https://design.example') continue
      assert.ok(statSync(resolve('dist', `.${url.pathname}`)).size, `${path}: ${asset}`)
    }
  }
  const stories = json('dist/storybook/index.json')
  assert.ok(Object.keys(stories.entries).length)
  for (const path of ['favicon.ico', 'site.webmanifest', 'worldmap.svg', 'brand/uug-favicon-set.zip']) {
    assert.ok(statSync(`dist/${path}`).size, path)
  }
})
