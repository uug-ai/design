import { access, copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export async function buildHtmlComponents(outputRoot = join(projectRoot, 'public/ui')) {
  const sourceRoot = join(projectRoot, 'src/components')
  const directories = await readdir(sourceRoot, { withFileTypes: true })
  const components = []
  await mkdir(outputRoot, { recursive: true })
  await copyFile(join(projectRoot, 'src/tokens.css'), join(outputRoot, 'tokens.css'))
  await copyFile(join(projectRoot, 'src/hub-tokens.css'), join(outputRoot, 'hub-tokens.css'))
  await mkdir(join(outputRoot, 'fonts'), { recursive: true })
  for (const file of ['Inter-roman.var.woff2', 'Inter-LICENSE.txt']) {
    await copyFile(join(projectRoot, 'src/fonts', file), join(outputRoot, 'fonts', file))
  }
  await copyFile(join(sourceRoot, 'html/behaviors.js'), join(outputRoot, 'behaviors.js'))

  for (const directory of directories.filter((entry) => entry.isDirectory())) {
    const files = await readdir(join(sourceRoot, directory.name))
    if (!files.includes('example.html')) continue
    const source = join(sourceRoot, directory.name)
    await access(join(source, 'component.css'), constants.R_OK)
    const title = directory.name.replace(/([a-z])([A-Z])/g, '$1 $2')
    const id = title.toLowerCase().replaceAll(' ', '-')
    const destination = join(outputRoot, id)
    const html = await readFile(join(source, 'example.html'), 'utf8')
    const dependencies = id === 'application-layout'
      ? ['status-badge', 'empty-state', 'metric-card', 'segmented-control', 'search-field', 'notice']
      : []
    const dependencyLinks = dependencies.map((dependency) => `  <link rel="stylesheet" href="../${dependency}/component.css">`).join('\n')
    const script = html.includes('data-ui-component=')
      ? '<script type="module">import { enhanceComponents } from "../behaviors.js"; enhanceComponents(document);</script>'
      : ''
    await mkdir(destination, { recursive: true })
    await copyFile(join(source, 'example.html'), join(destination, 'example.html'))
    if (files.includes('clearable.html')) {
      await copyFile(join(source, 'clearable.html'), join(destination, 'clearable.html'))
    }
    await copyFile(join(source, 'component.css'), join(destination, 'component.css'))
    await writeFile(join(destination, 'index.html'), `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} - UUG.AI Components</title>
  <link rel="stylesheet" href="../hub-tokens.css">
${dependencyLinks}
  <link rel="stylesheet" href="./component.css">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; color: var(--hub-ui-text); background: var(--hub-ui-bg); font-family: var(--hub-ui-font); }
    main { max-width: 1440px; margin: auto; padding: 2rem 1rem; }
    h1, h2 { font-family: var(--hub-ui-font); }
    h2 { margin-block: 2rem 1rem; font-size: 1.25rem; }
  </style>
</head>
<body>
  <main class="hub-ui">
    <h1>${title}</h1>
    <p>Current Hub visual reference in native HTML and CSS. No Angular or React runtime is required.</p>
    <h2>Example</h2>
    <div class="hub-ui-example"${id === 'application-layout' ? ' style="padding: 0"' : ''}>
${html}
    </div>
  </main>
  ${script}
</body>
</html>
`)
    components.push(id)
  }

  if (components.length === 0) throw new Error('No native HTML component examples were found')
  return components.sort()
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const components = await buildHtmlComponents()
  console.log(`Exported ${components.length} native HTML/CSS components to public/ui/`)
}
