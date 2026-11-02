import { expect, test } from '@playwright/test'
import { blockSections } from '../src/components/DrawBlocks/production/blocks'

const blocks = blockSections.flatMap(section => section.blocks)

test('home and navigation expose the Draw building-block section', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Design building blocks', exact: true })).toHaveAttribute('href', '/draw')
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Draw', exact: true }).click()
  await expect(page).toHaveURL(/\/draw$/)
  await expect(page.getByRole('heading', { name: 'Building blocks', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Storybook controls', exact: true })).toHaveAttribute('href', /draw-building-blocks--single-block/)
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
      await expect(page.locator('.draw-workbench-toolbar select option')).toHaveCount(blocks.length)
      await expect(page.locator('.draw-design-stage .block-card')).toHaveCSS('fill', theme === 'dark' ? 'rgb(36, 35, 47)' : 'rgb(255, 255, 255)')
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

test('controls design the real card and reset without changing catalogue defaults', async ({ page }) => {
  await page.goto('/draw')
  const stage = page.locator('.draw-design-stage')
  await page.getByLabel('Title', { exact: true }).fill('Entrance Agent')
  await page.getByLabel('Subtitle', { exact: true }).fill('Front door camera')
  await page.getByLabel('Header', { exact: true }).fill('SITE')
  await expect(stage.locator('.block-title')).toHaveText('Entrance Agent')
  await expect(stage.locator('.block-subtitle')).toHaveText('Front door camera')
  await expect(stage.getByText('SITE', { exact: true })).toBeVisible()
  await page.getByLabel('Header colour', { exact: true }).fill('#ff0000')
  await expect(stage.locator('.block > g[clip-path] > rect')).toHaveCSS('fill', 'rgb(255, 0, 0)')
  await page.getByLabel('Card colour', { exact: true }).fill('#eeeeee')
  await expect(stage.locator('.block-card')).toHaveCSS('fill', 'rgb(238, 238, 238)')
  await page.getByRole('checkbox', { name: 'docker', exact: true }).uncheck()
  await expect(stage.locator('image[href$="/docker.svg"]')).toHaveCount(0)
  await expect(page.locator('[data-block-key="agent"] .block-title')).toHaveText('Agent')
  await stage.getByText('Design settings', { exact: true }).click()
  const settings = JSON.parse(await page.getByLabel('Block design JSON').inputValue())
  expect(settings).toMatchObject({ blockKey: 'agent', header: 'SITE', title: 'Entrance Agent', headerColor: '#ff0000', cardColor: '#eeeeee' })
  await page.getByRole('button', { name: 'Reset design', exact: true }).click()
  await expect(stage.locator('.block-title')).toHaveText('Agent')
  await expect(stage.locator('.block-card')).toHaveCSS('fill', 'rgb(255, 255, 255)')
})

test('search, catalogue selection and empty results work', async ({ page }) => {
  await page.goto('/draw')
  const search = page.getByRole('searchbox', { name: 'Search building blocks' })
  await search.fill('iso-camera')
  await expect(page.locator('.draw-catalogue-item')).toHaveCount(4)
  await page.getByRole('button', { name: 'Design Bullet camera', exact: true }).click()
  await expect(page.getByLabel('Building block', { exact: true })).toHaveValue('iso-camera-bullet')
  await expect(page.getByRole('textbox', { name: 'Header', exact: true })).toBeDisabled()
  await expect(page.locator('.draw-design-stage').getByRole('img', { name: 'Bullet camera building block' })).toBeVisible()
  await page.getByLabel('Accent colour', { exact: true }).fill('#ff0000')
  await expect(page.locator('.draw-design-stage [fill="var(--iso-accent, #7426ff)"]').first()).toHaveCSS('fill', 'rgb(255, 0, 0)')
  await search.fill('no-such-building-block')
  await expect(page.getByText('No building blocks match your search.')).toBeVisible()
  await search.clear()
  await expect(page.locator('.draw-catalogue-item')).toHaveCount(blocks.length)
})

test('preview themes and isometric accents follow production palettes', async ({ page }) => {
  await page.goto('/draw')
  await page.getByLabel('Preview theme').selectOption('dark')
  await expect(page.locator('.draw-design-stage .block-card')).toHaveCSS('fill', 'rgb(36, 35, 47)')
  await page.getByLabel('Building block', { exact: true }).selectOption('iso-camera-bullet')
  await page.getByLabel('Preview theme').selectOption('dark')
  await expect(page.locator('.draw-design-stage [fill="var(--iso-accent, #7426ff)"]').first()).toHaveCSS('fill', 'rgb(160, 124, 255)')
  await page.getByLabel('Preview theme').selectOption('light')
  await expect(page.locator('.draw-design-stage [fill="var(--iso-accent, #7426ff)"]').first()).toHaveCSS('fill', 'rgb(116, 38, 255)')
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

test('copy errors are explicit and leave JSON available for manual copying', async ({ page }) => {
  await page.goto('/draw')
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { throw new Error('Clipboard permission denied') },
    } })
  })
  await page.getByText('Design settings', { exact: true }).click()
  await page.getByRole('button', { name: 'Copy design settings', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveText('Could not copy settings. Select and copy the JSON above instead.')
  await expect(page.getByLabel('Block design JSON')).toBeVisible()
})

test('copying settings exposes the selected design and reports success', async ({ page }) => {
  await page.goto('/draw')
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (value: string) => { sessionStorage.setItem('copied-draw-settings', value) },
    } })
  })
  await page.getByLabel('Title', { exact: true }).fill('Designed Agent')
  await page.getByText('Design settings', { exact: true }).click()
  await page.getByRole('button', { name: 'Copy design settings', exact: true }).click()
  await expect(page.getByText('Design settings copied.', { exact: true })).toBeVisible()
  const copied = await page.evaluate(() => JSON.parse(sessionStorage.getItem('copied-draw-settings')!))
  expect(copied).toMatchObject({ blockKey: 'agent', title: 'Designed Agent' })
})

test('resizing keeps production clipping behaviour and applies design radius', async ({ page }) => {
  await page.goto('/draw')
  await page.getByRole('slider', { name: /^Width:/ }).fill('140')
  await page.getByRole('slider', { name: /^Height:/ }).fill('90')
  await page.getByRole('slider', { name: /^Corner radius:/ }).fill('24')
  const stage = page.locator('.draw-design-stage')
  await expect(stage.locator('.block-card')).toHaveAttribute('width', '140')
  await expect(stage.locator('.block-card')).toHaveAttribute('height', '90')
  await expect(stage.locator('.block-card')).toHaveCSS('rx', '24px')
  await expect(stage.locator('image')).toHaveCount(0)
  await expect(stage.locator('.block-subtitle')).toHaveText('Process stream')
  await expect(stage.locator('.block > g[clip-path]')).toHaveAttribute('clip-path', /^url\(#draw-.+\)$/)
  await expect(stage.locator('.block-title')).toHaveText('Agent')
})

for (const story of ['playground', 'single-block', 'catalogue', 'general', 'uug-ai', 'cloud-providers', 'kubernetes', 'isometric', 'compact-card', 'dark-mode']) {
  test(`Storybook Draw section renders ${story}`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`/storybook/iframe.html?id=draw-building-blocks--${story}&viewMode=story`)
    await expect(page.locator('.draw-block-preview').first()).toBeVisible()
    expect(errors).toEqual([])
  })
}
