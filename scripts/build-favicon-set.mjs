import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { strToU8, zipSync } from 'fflate'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const iconFiles = [
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
]

const headHtml = `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" href="/favicon.ico">
<link rel="manifest" href="/site.webmanifest">
`

const instructions = `UUG midnight favicon set

1. Copy all six icon files and site.webmanifest into your website's public
   directory, so they are served from the root (for example /favicon.ico).
   For React/Vite or Next.js projects, this is normally the public/ folder.
2. Paste the contents of head.html inside your page's <head>. If your framework
   provides a metadata API, register the same icon and manifest URLs there.
3. Change name and short_name in site.webmanifest to your website's name.
4. If you put the files in a subdirectory, update the href paths in head.html.
   Keep site.webmanifest alongside the PNG files: its icon paths are relative.
5. Deploy the files with your site. Browsers cache favicons aggressively; a
   hard refresh, new tab, or version query on the icon URLs may be needed.

Included artwork:
- favicon.ico: 16, 32, and 48px browser icons.
- favicon-16x16.png and favicon-32x32.png: native-size PNG browser icons.
- apple-touch-icon.png: 180px Apple touch icon.
- android-chrome-192x192.png and android-chrome-512x512.png: app icons.

The full white UUG wordmark appears on the midnight background. Browser icons
have rounded corners; touch/app icons are square so the platform can crop them.
No external fonts, scripts, or network requests are required by the artwork.
`

export async function buildFaviconSet(outputFile = join(projectRoot, 'public/brand/uug-favicon-set.zip')) {
  const entries = await Promise.all(iconFiles.map(async (name) => [
    name, await readFile(join(projectRoot, 'public', name)),
  ]))
  const manifest = JSON.parse(await readFile(join(projectRoot, 'public/site.webmanifest'), 'utf8'))
  manifest.name = 'UUG'
  manifest.short_name = 'UUG'
  manifest.icons = manifest.icons.map((icon) => ({
    ...icon,
    src: icon.src.split('?')[0].replace(/^\//, ''),
  }))
  const files = {
    ...Object.fromEntries(entries),
    'site.webmanifest': strToU8(`${JSON.stringify(manifest, null, 2)}\n`),
    'head.html': strToU8(headHtml),
    'README.txt': strToU8(instructions),
  }
  const archive = zipSync(files, { level: 9, mtime: new Date('2020-01-01T00:00:00Z') })
  await mkdir(dirname(outputFile), { recursive: true })
  await writeFile(outputFile, archive)
  return outputFile
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildFaviconSet()
  console.log('Packaged full favicon set in public/brand/uug-favicon-set.zip')
}
