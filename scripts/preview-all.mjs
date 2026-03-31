import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { createServer } from 'node:http'

const port = Number(process.env.PORT || 4173)
const distRoot = join(process.cwd(), 'dist')
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function sendFile(response, filePath) {
  const extension = extname(filePath)
  response.writeHead(200, {
    'Content-Type': mimeTypes[extension] || 'application/octet-stream',
    'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  })
  createReadStream(filePath).pipe(response)
}

function sendNotFound(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  response.end('Not found')
}

function safeJoin(base, relativePath) {
  const resolvedPath = normalize(join(base, relativePath))

  if (!resolvedPath.startsWith(base)) {
    return null
  }

  return resolvedPath
}

function resolveStaticFile(relativePath) {
  const filePath = safeJoin(distRoot, relativePath)

  if (!filePath || !existsSync(filePath)) {
    return null
  }

  if (statSync(filePath).isDirectory()) {
    const indexFile = join(filePath, 'index.html')
    return existsSync(indexFile) ? indexFile : null
  }

  return filePath
}

createServer((request, response) => {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
  const pathname = requestUrl.pathname

  if (pathname.startsWith('/storybook/')) {
    const storybookPath = pathname.replace('/storybook/', 'storybook/')
    const exactFile = resolveStaticFile(storybookPath)

    if (exactFile) {
      sendFile(response, exactFile)
      return
    }

    const fallbackFile = resolveStaticFile('storybook/index.html')

    if (fallbackFile) {
      sendFile(response, fallbackFile)
      return
    }
  }

  const appPath = pathname === '/' ? 'index.html' : pathname.slice(1)
  const exactFile = resolveStaticFile(appPath)

  if (exactFile) {
    sendFile(response, exactFile)
    return
  }

  const fallbackFile = resolveStaticFile('index.html')

  if (fallbackFile) {
    sendFile(response, fallbackFile)
    return
  }

  sendNotFound(response)
}).listen(port, '0.0.0.0', () => {
  console.log(`Previewing integrated build at http://localhost:${port}/`)
  console.log(`Storybook is available at http://localhost:${port}/storybook/`)
})