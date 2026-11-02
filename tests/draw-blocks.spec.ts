import { expect, test } from '@playwright/test'
import { toId } from 'storybook/internal/csf'
import { drawBlockCategories, drawBlockStoryId } from '../src/components/DrawBlocks/catalogue'

const blocks = drawBlockCategories.flatMap(category => category.blocks)

test('home and navigation expose the Draw building-block section', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Browse building blocks', exact: true })).toHaveAttribute('href', '/draw')
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Draw', exact: true }).click()
  await expect(page).toHaveURL(/\/draw$/)
  await expect(page.getByRole('heading', { name: 'Building blocks', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'All blocks in Storybook', exact: true })).toHaveAttribute('href', /draw-building-blocks--docs/)
  await expect(page.getByRole('link', { name: 'Launch Draw', exact: true })).toHaveAttribute('href', 'https://draw.uug.ai/')
})

for (const theme of ['light', 'dark']) {
  for (const width of [1280, 1024, 390, 320]) {
    test(`catalogue and navigation fit ${theme} at ${width}px`, async ({ page }) => {
      await page.addInitScript(theme => localStorage.setItem('uug-design-theme', theme), theme)
      await page.setViewportSize({ width, height: 900 })
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto('/draw')
      await expect(page.locator('.draw-catalogue-item')).toHaveCount(blocks.length)
      await expect(page.locator('.draw-catalogue-section')).toHaveCount(drawBlockCategories.length)
      await expect(page.locator('[data-block-key="agent"] .block-card')).toHaveCSS('fill', theme === 'dark' ? 'rgb(36, 35, 47)' : 'rgb(255, 255, 255)')
      const geometry = await page.evaluate(() => {
        const header = document.querySelector('.header')!.getBoundingClientRect()
        return { width: document.documentElement.scrollWidth, viewport: innerWidth, height: header.height }
      })
      expect(geometry.width).toBeLessThanOrEqual(geometry.viewport)
      expect(geometry.height).toBeLessThanOrEqual(width <= 900 ? 100 : 80)
      const ids = await page.locator('.draw-block-preview [id]').evaluateAll(elements => elements.map(element => element.id))
      expect(new Set(ids).size).toBe(ids.length)
      if (width <= 900) {
        await page.getByRole('button', { name: 'Open navigation menu', exact: true }).click()
      }
      await expect(page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: /^Draw(?: ›)?$/ })).toBeVisible()
      expect(errors).toEqual([])
    })
  }
}

test('every production block has exactly one individual, correctly categorised story', async ({ request }) => {
  const response = await request.get('/storybook/index.json')
  expect(response.ok()).toBe(true)
  const index: { entries: Record<string, { id: string; title: string; name: string; type: string }> } = await response.json()
  const stories = Object.values(index.entries).filter(entry => entry.type === 'story' && entry.title.startsWith('Draw/'))
  expect(blocks).toHaveLength(141)
  expect(stories).toHaveLength(blocks.length)
  expect([...new Set(stories.map(story => story.title))].sort()).toEqual(drawBlockCategories.map(category => `Draw/Building blocks/${category.name}`).sort())
  expect(index.entries['draw-building-blocks--docs']).toMatchObject({ title: 'Draw/Building blocks', type: 'docs' })
  for (const category of drawBlockCategories) {
    expect(index.entries[toId(`Draw/Building blocks/${category.name}`, 'docs')], category.name).toMatchObject({
      title: `Draw/Building blocks/${category.name}`, type: 'docs',
    })
    for (const block of category.blocks) {
      expect(index.entries[drawBlockStoryId(category.name, block.key)], block.key).toMatchObject({
        title: `Draw/Building blocks/${category.name}`, name: block.label ?? block.title, type: 'story',
      })
    }
  }
  expect(stories.some(story => ['Playground', 'Single Block', 'Catalogue'].includes(story.name))).toBe(false)
})

test('gallery links each block to its own story without filters or configuration controls', async ({ page }) => {
  await page.goto('/draw')
  for (const category of drawBlockCategories) {
    for (const block of category.blocks) {
      await expect(page.locator(`[data-block-key="${block.key}"]`).getByRole('link')).toHaveAttribute(
        'href', `/storybook/?path=${encodeURIComponent(`/story/${drawBlockStoryId(category.name, block.key)}`)}`)
    }
  }
  await expect(page.getByRole('combobox')).toHaveCount(0)
  await expect(page.getByRole('searchbox')).toHaveCount(0)
  await expect(page.getByRole('navigation', { name: 'Building-block categories' })).toHaveCount(0)
  await expect(page.getByRole('slider')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Design controls' })).toHaveCount(0)
  await expect(page.getByLabel('Block design JSON')).toHaveCount(0)
})

for (const width of [1280, 390]) {
  test(`main Docs lists every block without filters at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/storybook/iframe.html?id=draw-building-blocks--docs&viewMode=docs')
    await expect(page.getByRole('heading', { level: 1, name: /Building blocks$/ })).toBeVisible()
    await expect(page.locator('.draw-catalogue-item')).toHaveCount(blocks.length)
    await expect(page.locator('.draw-catalogue-section')).toHaveCount(drawBlockCategories.length)
    await expect(page.locator('.draw-catalogue input, .draw-catalogue select')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'View Agent in Storybook', exact: true })).toHaveAttribute('href', /draw-building-blocks-uug-ai--agent/)
    for (const category of drawBlockCategories) {
      await expect(page.getByRole('heading', { name: category.name, exact: true })).toHaveCount(1)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    expect(errors).toEqual([])
  })
}

test('a gallery card opens its individual entry in the Storybook sidebar', async ({ page }) => {
  await page.goto('/draw')
  const opened = page.waitForEvent('popup')
  await page.getByRole('link', { name: 'View Agent in Storybook', exact: true }).click()
  const storybook = await opened
  await expect(storybook).toHaveURL(/draw-building-blocks-uug-ai--agent/)
  await expect(storybook.getByText('Building blocks', { exact: true }).first()).toBeVisible()
  await expect(storybook.getByText('uug.ai', { exact: true }).first()).toBeVisible()
  const preview = storybook.frameLocator('#storybook-preview-iframe')
  await expect(preview.locator('.draw-block-preview')).toHaveCount(1)
  await expect(preview.getByRole('img', { name: 'Agent building block', exact: true })).toBeVisible()
})

test('every production logo and badge is bundled locally with SVG MIME type', async ({ page, request }) => {
  await page.goto('/draw')
  const hrefs = await page.locator('.draw-block-preview image').evaluateAll(elements =>
    [...new Set(elements.map(element => element.getAttribute('href')!))])
  expect(hrefs.length).toBeGreaterThan(100)
  for (const href of hrefs) {
    expect(href).toMatch(/^\/draw-blocks\/(?:badges|cloud|generic|kubernetes)\/.+\.svg$/)
    const response = await request.get(href)
    expect(response.status(), href).toBe(200)
    expect(response.headers()['content-type'], href).toContain('image/svg+xml')
    expect(await response.text(), href).toContain('<svg')
  }
})

for (const category of drawBlockCategories) {
  for (const width of [1280, 390]) {
    test(`${category.name} Docs shows only its category side by side at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto(`/storybook/iframe.html?id=${toId(`Draw/Building blocks/${category.name}`, 'docs')}&viewMode=docs`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${category.name} building blocks`)
      await expect(page.locator('.draw-catalogue-section')).toHaveCount(1)
      await expect(page.getByRole('status')).toHaveText(`${category.blocks.length} building blocks`)
      await expect(page.locator('.draw-catalogue-item')).toHaveCount(category.blocks.length)
      expect(await page.locator('.draw-catalogue-item').evaluateAll(items => items.map(item => item.getAttribute('data-block-key'))))
        .toEqual(category.blocks.map(block => block.key))
      for (const block of category.blocks) {
        await expect(page.locator(`[data-block-key="${block.key}"]`).getByRole('link')).toHaveAttribute(
          'href', `/storybook/?path=${encodeURIComponent(`/story/${drawBlockStoryId(category.name, block.key)}`)}`)
      }
      if (width === 1280) {
        const [first, second] = await page.locator('.draw-catalogue-item').evaluateAll(items =>
          items.slice(0, 2).map(item => ({ x: item.getBoundingClientRect().x, y: item.getBoundingClientRect().y })))
        expect(second.x).toBeGreaterThan(first.x)
        expect(second.y).toBe(first.y)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      expect(errors).toEqual([])
    })
  }

  for (const theme of ['light', 'dark']) {
    test(`individual ${category.name} blocks render their production defaults in ${theme}`, async ({ page }) => {
      test.setTimeout(Math.max(30_000, category.blocks.length * 3_000))
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      for (const block of category.blocks) {
        await page.goto(`/storybook/iframe.html?id=${drawBlockStoryId(category.name, block.key)}&viewMode=story&globals=hubTheme:${theme}`)
        await expect(page.locator('.draw-block-preview'), block.key).toHaveCount(1)
        await expect(page.getByRole('img', { name: `${block.title} building block`, exact: true }), block.key).toBeVisible()
        await expect(page.locator('.draw-block-preview > svg'), block.key).toHaveAttribute('viewBox', `0 0 ${block.w + 40} ${block.h + 40}`)
        if (block.icon) {
          await expect(page.locator('[fill="var(--iso-accent, #7426ff)"]').first(), block.key).toHaveCSS(
            'fill', theme === 'dark' ? 'rgb(160, 124, 255)' : 'rgb(116, 38, 255)')
        } else {
          await expect(page.locator('.block-card'), block.key).toHaveCSS(
            'fill', theme === 'dark' ? 'rgb(36, 35, 47)' : 'rgb(255, 255, 255)')
          await expect(page.locator('.block-title'), block.key).toHaveText(block.title)
        }
      }
      expect(errors).toEqual([])
    })
  }
}
