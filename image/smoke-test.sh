#!/usr/bin/env bash
set -euo pipefail

image=${1:?image reference required}
container=design-smoke
cleanup() {
  docker logs "$container" > smoke.log 2>&1
  docker rm -f "$container"
}
docker run -d --name "$container" --read-only --cap-drop ALL \
  --security-opt no-new-privileges \
  --tmpfs /tmp:rw,noexec,nosuid,size=16m,mode=1777 \
  -p 127.0.0.1::8080 "$image"
trap cleanup EXIT
origin="http://$(docker port "$container" 8080/tcp)"
ready=false
for attempt in $(seq 1 30); do
  if curl --fail --silent --max-time 2 "$origin/healthz" > /dev/null; then
    ready=true
    break
  fi
  sleep 1
done
test "$ready" = true
test "$(docker inspect "$container" --format '{{.Config.User}}')" = 65532:65532
curl --fail --silent --show-error "$origin/" > smoke-index.html
for route in colors typography spacing branding components; do
  curl --fail --silent --show-error "$origin/$route" > smoke-route.html
  cmp smoke-index.html smoke-route.html
done
curl --fail --silent --show-error "$origin/storybook/" > smoke-storybook.html
! cmp -s smoke-index.html smoke-storybook.html
curl --fail --silent --show-error "$origin/storybook/iframe.html" > smoke-iframe.html
curl --fail --silent --show-error "$origin/storybook/index.json" > smoke-stories.json
node -e 'const fs = require("node:fs"); const data = JSON.parse(fs.readFileSync("smoke-stories.json")); if (!Object.keys(data.entries).length) process.exit(1)'
for path in /favicon.ico /favicon-32x32.png /site.webmanifest /worldmap.svg /brand/uug-favicon-set.zip; do
  curl --fail --silent --show-error "$origin$path" > /dev/null
done
node --input-type=module - "$origin" <<'JS'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const origin = process.argv[2]
for (const [file, base] of [['smoke-index.html', '/'], ['smoke-storybook.html', '/storybook/'], ['smoke-iframe.html', '/storybook/']]) {
  const html = readFileSync(file, 'utf8')
  const assets = [...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)]
  assert.ok(assets.length, `no browser assets in ${file}`)
  for (const [, path] of assets) {
    const url = new URL(path, `${origin}${base}`)
    if (url.origin !== origin) continue
    const response = await fetch(url)
    assert.equal(response.status, 200, url.href)
    assert.match(response.headers.get('content-type'), /\.(?:js)(?:\?|$)/.test(path) ? /javascript/ : /css/, url.href)
    assert.ok((await response.arrayBuffer()).byteLength, url.href)
  }
}
JS
