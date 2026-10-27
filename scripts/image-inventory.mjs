import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('package.json', 'utf8'))
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'))

// Storybook and its addons ship browser code despite being devDependencies.
// Classify the entire locked build tree conservatively as runtime inventory
// so scanners that omit dev dependencies cannot miss the published bundles.
const dependencies = { ...manifest.devDependencies, ...manifest.dependencies }
manifest.dependencies = dependencies
delete manifest.devDependencies
lock.packages[''].dependencies = dependencies
delete lock.packages[''].devDependencies
for (const entry of Object.values(lock.packages)) {
  delete entry.dev
  delete entry.devOptional
}
mkdirSync('image-inventory', { recursive: true })
for (const [name, value] of [['package.json', manifest], ['package-lock.json', lock]]) {
  writeFileSync(`image-inventory/${name}`, `${JSON.stringify(value, null, 2)}\n`)
}
