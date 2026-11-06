import { expect, test } from '@playwright/test'
import { cookieConsentKey } from '../src/config/cookieConsent'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(key => localStorage.setItem(key, 'denied'), cookieConsentKey)
})

test('all design routes share the public website footer', async ({ page }) => {
  for (const route of ['/', '/draw', '/components', '/colors', '/typography', '/spacing', '/branding']) {
    await page.goto(route)
    const footer = page.getByRole('contentinfo')
    await expect(footer).toHaveCount(1)
    await expect(footer.locator('.site-footer-brand h2')).toHaveCount(0)
    await expect(footer.locator('.site-footer-brand')).toContainText('Deploy, manage, and automate camera fleets across edge, hybrid, and cloud environments.')
    await expect(footer.getByRole('navigation', { name: 'Footer navigation' })).toBeVisible()
    for (const group of ['Platform', 'Products', 'Resources', 'Company']) {
      await expect(footer.getByRole('heading', { name: group, exact: true })).toBeVisible()
    }
    await expect(footer).toContainText(`${new Date().getFullYear()} UUG.AI`)
    await expect(footer).toContainText('VAT BE1013644852')
    await expect(footer.getByRole('button', { name: 'Cookie settings', exact: true })).toBeVisible()
  }
})

test('footer website destinations are canonical and Design system stays local', async ({ page }) => {
  await page.goto('/draw')
  const footer = page.getByRole('contentinfo')
  const navigation = footer.getByRole('navigation', { name: 'Footer navigation' })
  const links = [
    ['Control tower', 'https://uug.ai/#scale'],
    ['Deployment modes', 'https://uug.ai/#platform'],
    ['Platform stack', 'https://uug.ai/#composition'],
    ['Workflow designer', 'https://uug.ai/#workflows'],
    ['Enterprise features', 'https://uug.ai/#features'],
    ['Agent', 'https://uug.ai/products/agent/'],
    ['Factory', 'https://uug.ai/products/factory/'],
    ['Vault', 'https://uug.ai/products/vault/'],
    ['Hub', 'https://uug.ai/products/hub/'],
    ['Documentation', 'https://learn.uug.ai'],
    ['Design system', '/'],
    ['Live demo', 'https://app-demo.kerberos.io'],
    ['GitHub', 'https://github.com/uug-ai'],
    ['AI-readable site guide', 'https://uug.ai/llms.txt'],
    ['Careers', 'https://uug.ai/careers/'],
    ['Financials', 'https://uug.ai/financials/'],
    ['Contact', 'https://uug.ai/contact/'],
    ['Our office', 'https://uug.ai/contact/#office-heading'],
    ['OpenStreetMap', 'https://www.openstreetmap.org/?mlat=51.0466373&mlon=3.7148417#map=18/51.0466373/3.7148417'],
  ]
  await expect(navigation.getByRole('link')).toHaveCount(links.length)
  for (const [name, href] of links) {
    await expect(navigation.getByRole('link', { name, exact: true })).toHaveAttribute('href', href)
  }
  for (const name of ['Documentation', 'Live demo', 'GitHub', 'OpenStreetMap']) {
    const link = navigation.getByRole('link', { name, exact: true })
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noreferrer')
  }
  await expect(footer.getByRole('link', { name: 'UUG.AI home', exact: true })).toHaveAttribute('href', 'https://uug.ai/')
  await expect(footer.getByRole('link', { name: 'Talk to our team', exact: true })).toHaveAttribute('href', 'https://uug.ai/contact/')
  await expect(footer.getByRole('link', { name: '09 390 80 78', exact: true })).toHaveAttribute('href', 'tel:+3293908078')
  await expect(footer.getByRole('link', { name: 'support@uug.ai', exact: true })).toHaveAttribute('href', 'mailto:support@uug.ai')
  await expect(footer.getByRole('link', { name: 'UUG.AI on GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/uug-ai')
  await navigation.getByRole('link', { name: 'Design system', exact: true }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('AUGMENT VISION')
})

for (const theme of ['light', 'dark']) {
  for (const width of [1280, 1024, 768, 600, 390, 320]) {
    test(`public footer fits ${theme} at ${width}px with keyboard focus`, async ({ page }) => {
      await page.addInitScript(theme => localStorage.setItem('uug-design-theme', theme), theme)
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/draw')
      const footer = page.getByRole('contentinfo')
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      await expect(footer).toHaveCSS('color', theme === 'dark' ? 'rgb(245, 244, 255)' : 'rgb(11, 11, 18)')
      const groups = await footer.locator('.site-footer-group').evaluateAll(elements => elements.map(element => {
        const box = element.getBoundingClientRect()
        return { x: box.x, y: box.y }
      }))
      if (width > 720) {
        expect(groups.every(group => group.y === groups[0].y)).toBe(true)
        expect(groups[3].x).toBeGreaterThan(groups[0].x)
      } else if (width > 420) {
        expect(groups[0].y).toBe(groups[1].y)
        expect(groups[2].y).toBeGreaterThan(groups[0].y)
      } else {
        expect(groups.every(group => group.x === groups[0].x)).toBe(true)
        expect(groups[3].y).toBeGreaterThan(groups[0].y)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      await footer.getByRole('link', { name: 'UUG.AI home', exact: true }).focus()
      await page.keyboard.press('Tab')
      const cta = footer.getByRole('link', { name: 'Talk to our team', exact: true })
      await expect(cta).toBeFocused()
      await expect(cta).toHaveCSS('outline-style', 'solid')
      await expect(cta).toHaveCSS('outline-width', '3px')
    })
  }
}

test('home and navigation lead to the Storybook introduction before launching the library', async ({ page, context }) => {
  await page.goto('/')
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' })
  await expect(navigation.getByRole('link', { name: 'Storybook', exact: true })).toHaveAttribute('href', '/components')
  await expect(page.getByRole('link', { name: 'Explore Storybook', exact: true })).toHaveAttribute('href', '/components')
  await page.getByRole('link', { name: 'Storybook One component library', exact: false }).click()
  await expect(page).toHaveURL(/\/components$/)
  await expect(navigation.getByRole('link', { name: 'Storybook', exact: true })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('One shared component library.')
  await expect(page.getByRole('link', { name: 'Open Storybook', exact: true })).toHaveAttribute('href', '/storybook/')
  const popupPromise = context.waitForEvent('page')
  await page.getByRole('link', { name: 'Open Storybook', exact: true }).click()
  const storybook = await popupPromise
  await expect(storybook).toHaveURL(/\/storybook\/$/)
  await expect(storybook.locator('#storybook-preview-iframe')).toBeVisible()
})

test('direct component entry lists all four canonical product pages and preserves Draw Docs access', async ({ page }) => {
  await page.goto('/components')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('One shared component library.')
  for (const product of ['Agent', 'Vault', 'Factory', 'Hub']) {
    await expect(page.getByRole('heading', { name: product, exact: true })).toBeVisible()
    const link = page.getByRole('link', { name: `Explore ${product}`, exact: true })
    await expect(link).toHaveAttribute('href', `https://uug.ai/products/${product.toLowerCase()}/`)
    await expect(link).toHaveAttribute('target', '_blank')
  }
  await expect(page.getByRole('link', { name: 'Browse Draw building blocks', exact: true }))
    .toHaveAttribute('href', '/storybook/?path=%2Fdocs%2Fdraw-building-blocks--docs')
  await page.reload()
  await expect(page).toHaveURL(/\/components$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('One shared component library.')
})

for (const theme of ['light', 'dark']) {
  test(`Storybook product copy and website colours remain readable in ${theme}`, async ({ page }) => {
    await page.addInitScript(theme => localStorage.setItem('uug-design-theme', theme), theme)
    await page.goto('/components')
    const products = [
      {
        name: 'Agent',
        description: 'Connect mixed camera brands through one interface for live video, local recording and camera controls, ready for Vault and Hub.',
        accent: 'rgb(255, 0, 89)',
        soft: 'rgba(255, 0, 89, 0.14)',
      },
      {
        name: 'Vault',
        description: 'Collect and index Agent recordings in object storage you control, on-premise or in the cloud. Deliver new media to Hub and your processing pipelines.',
        accent: 'rgb(116, 38, 255)',
        soft: 'rgba(116, 38, 255, 0.14)',
      },
      {
        name: 'Factory',
        description: 'Deploy, configure and upgrade an Agent for every camera on your own Kubernetes cluster. Manage fleet-wide settings and troubleshoot from one place.',
        accent: 'rgb(39, 19, 255)',
        soft: 'rgba(39, 19, 255, 0.14)',
      },
      {
        name: 'Hub',
        description: 'Watch live cameras, search recordings across sites and automate video AI workflows. Manage alerts and collect recordings into evidence cases.',
        accent: 'rgb(162, 57, 215)',
        soft: 'rgba(162, 57, 215, 0.14)',
      },
    ]
    for (const product of products) {
      const card = page.getByRole('article', { name: product.name, exact: true })
      await expect(card.locator('p')).toHaveText(product.description)
      await expect(card).toHaveCSS('border-top-color', product.accent)
      await expect(card).toHaveCSS('border-top-width', '4px')
      await expect(card.getByRole('heading')).toHaveCSS('background-color', product.soft)
      await expect(card.getByRole('link')).toHaveAttribute('href', `https://uug.ai/products/${product.name.toLowerCase()}/`)
      const contrasts = await card.evaluate(card => {
        const rgb = (color: string) => color.match(/[\d.]+/g)!.map(Number)
        const luminance = (color: number[]) => color.slice(0, 3)
          .map(value => value / 255)
          .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
          .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0)
        const background = rgb(getComputedStyle(card).backgroundColor)
        return ['h3', 'p', 'a'].map(selector => {
          const element = card.querySelector(selector)!
          const style = getComputedStyle(element)
          const overlay = rgb(style.backgroundColor)
          const alpha = overlay[3] ?? 1
          const surface = background.map((channel, index) => overlay[index] * alpha + channel * (1 - alpha))
          const [light, dark] = [luminance(rgb(style.color)), luminance(surface)].sort((a, b) => b - a)
          return (light + 0.05) / (dark + 0.05)
        })
      })
      for (const contrast of contrasts) expect(contrast).toBeGreaterThanOrEqual(4.5)
      const link = card.getByRole('link')
      await link.focus()
      await expect(link).toHaveCSS('outline-style', 'solid')
      await expect(link).toHaveCSS('outline-width', '2px')
    }
    await expect(page.getByText('Part of the UUG.AI family, connected through our shared component library.', { exact: true })).toHaveCount(0)
  })
}

for (const theme of ['light', 'dark']) {
  for (const width of [1280, 1024, 390, 320]) {
    test(`Storybook introduction and mobile navigation fit ${theme} at ${width}px`, async ({ page }) => {
      await page.addInitScript(theme => localStorage.setItem('uug-design-theme', theme), theme)
      await page.setViewportSize({ width, height: 900 })
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto('/components')
      await expect(page.locator('.storybook-page .tool-landing-card')).toHaveCount(4)
      const cards = await page.locator('.storybook-product-card').evaluateAll(elements => elements.map(element => {
        const box = element.getBoundingClientRect()
        return { x: box.x, y: box.y, width: box.width, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth }
      }))
      expect(cards.every(card => card.scrollWidth <= card.clientWidth)).toBe(true)
      if (width > 600) {
        expect(cards[0].y).toBe(cards[1].y)
        expect(cards[1].x).toBeGreaterThan(cards[0].x)
        expect(cards[2].y).toBeGreaterThan(cards[0].y)
      } else {
        expect(cards.every(card => card.x === cards[0].x)).toBe(true)
        expect(cards[3].y).toBeGreaterThan(cards[0].y)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      if (width <= 900) {
        await page.getByRole('button', { name: 'Open navigation menu', exact: true }).click()
      }
      const navigation = page.getByRole('navigation', { name: 'Primary navigation' })
      await expect(navigation.getByRole('link', { name: /^Storybook(?: ›)?$/ })).toBeVisible()
      await navigation.getByRole('link', { name: /^Draw(?: ›)?$/ }).click()
      await expect(page).toHaveURL(/\/draw$/)
      if (width <= 900) {
        await expect(page.getByRole('button', { name: 'Open navigation menu', exact: true })).toHaveAttribute('aria-expanded', 'false')
      }
      await page.getByRole('link', { name: 'Explore our component library', exact: true }).click()
      await expect(page).toHaveURL(/\/components$/)
      expect(errors).toEqual([])
    })
  }
}
