import { expect, test } from '@playwright/test'
import { cookieConsentKey } from '../src/config/cookieConsent'

test('first visit explains design-only preferences without adding trackers', async ({ page }) => {
  const trackingRequests: string[] = []
  page.on('request', request => {
    if (/googletagmanager\.com|google-analytics\.com|doubleclick\.net/.test(request.url())) {
      trackingRequests.push(request.url())
    }
  })
  await page.goto('/draw')
  const notice = page.getByRole('region', { name: 'Cookie settings', exact: true })
  await expect(notice).toBeVisible()
  await expect(notice).toContainText('No analytics or advertising trackers are loaded, regardless of your choice.')
  await expect(notice.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', 'https://uug.ai/privacy/')
  await expect(notice.getByRole('button')).toHaveCount(2)
  expect(await page.evaluate(key => localStorage.getItem(key), cookieConsentKey)).toBeNull()
  for (const choice of ['Accept cookies', 'Reject cookies']) {
    await notice.getByRole('button', { name: choice, exact: true }).click()
    await expect(notice).toHaveCount(0)
    expect(await page.evaluate(() => ({
      tag: 'gtag' in window,
      layer: 'dataLayer' in window,
      analyticsCookies: document.cookie.split(';').filter(cookie => cookie.trim().startsWith('_ga')),
    }))).toEqual({ tag: false, layer: false, analyticsCookies: [] })
    await page.getByRole('contentinfo').getByRole('button', { name: 'Cookie settings', exact: true }).click()
  }
  expect(trackingRequests).toEqual([])
})

for (const [label, value] of [['Accept cookies', 'granted'], ['Reject cookies', 'denied']]) {
  test(`${label} persists through reload and direct entry`, async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: label, exact: true }).click()
    const notice = page.getByRole('region', { name: 'Cookie settings', exact: true })
    await expect(notice).toHaveCount(0)
    expect(await page.evaluate(key => localStorage.getItem(key), cookieConsentKey)).toBe(value)
    await page.reload()
    await expect(notice).toHaveCount(0)
    await page.goto('/components')
    await expect(notice).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('One shared component library.')
    await page.getByRole('contentinfo').getByRole('button', { name: 'Cookie settings', exact: true }).click()
    await expect(notice).toBeVisible()
  })
}

test('footer reopens preferences with keyboard focus and permits changing the choice', async ({ page }) => {
  await page.addInitScript(key => {
    if (localStorage.getItem(key) === null) localStorage.setItem(key, 'denied')
  }, cookieConsentKey)
  await page.goto('/draw')
  const trigger = page.getByRole('contentinfo').getByRole('button', { name: 'Cookie settings', exact: true })
  await trigger.focus()
  await expect(trigger).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Cookie settings', exact: true })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Privacy policy', exact: true })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Accept cookies', exact: true })).toBeFocused()
  await expect(page.getByRole('button', { name: 'Accept cookies', exact: true })).toHaveCSS('outline-width', '2px')
  await page.keyboard.press('Enter')
  await expect(trigger).toBeFocused()
  expect(await page.evaluate(key => localStorage.getItem(key), cookieConsentKey)).toBe('granted')
  await page.keyboard.press('Enter')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Reject cookies', exact: true })).toBeFocused()
  await page.keyboard.press('Space')
  await expect(trigger).toBeFocused()
  expect(await page.evaluate(key => localStorage.getItem(key), cookieConsentKey)).toBe('denied')
})

test('choices and clearing preferences synchronize between tabs', async ({ page, context }) => {
  await page.goto('/draw')
  const other = await context.newPage()
  await other.goto('/components')
  const notice = page.getByRole('region', { name: 'Cookie settings', exact: true })
  await other.getByRole('button', { name: 'Accept cookies', exact: true }).click()
  await expect(notice).toHaveCount(0)
  await page.getByRole('contentinfo').getByRole('button', { name: 'Cookie settings', exact: true }).click()
  await page.getByRole('button', { name: 'Reject cookies', exact: true }).click()
  expect(await other.evaluate(key => localStorage.getItem(key), cookieConsentKey)).toBe('denied')
  await other.evaluate(key => localStorage.removeItem(key), cookieConsentKey)
  await expect(notice).toBeVisible()
  await page.getByRole('button', { name: 'Reject cookies', exact: true }).click()
  await other.evaluate(() => localStorage.clear())
  await expect(notice).toBeVisible()
})

test('opening settings focuses an already visible first-visit notice', async ({ page }) => {
  await page.goto('/draw')
  const notice = page.getByRole('region', { name: 'Cookie settings', exact: true })
  await expect(notice).toBeVisible()
  await page.getByRole('contentinfo').getByRole('button', { name: 'Cookie settings', exact: true }).click()
  await expect(notice.getByRole('heading', { name: 'Cookie settings', exact: true })).toBeFocused()
})

test('invalid saved preferences warn and ask again', async ({ page }) => {
  const warnings: string[] = []
  page.on('console', message => {
    if (message.type() === 'warning') warnings.push(message.text())
  })
  await page.addInitScript(key => localStorage.setItem(key, 'invalid'), cookieConsentKey)
  await page.goto('/')
  await expect(page.getByRole('region', { name: 'Cookie settings', exact: true })).toBeVisible()
  expect(warnings).toContain('Unrecognized cookie preference; asking again.')
  await page.getByRole('button', { name: 'Reject cookies', exact: true }).click()
  expect(await page.evaluate(key => localStorage.getItem(key), cookieConsentKey)).toBe('denied')
})

test('unreadable preferences surface an error and still allow a new choice', async ({ page }) => {
  await page.addInitScript(key => {
    const getItem = Storage.prototype.getItem
    Storage.prototype.getItem = function (name) {
      if (name === key) throw new DOMException('Storage blocked', 'SecurityError')
      return getItem.call(this, name)
    }
  }, cookieConsentKey)
  await page.goto('/')
  const notice = page.getByRole('region', { name: 'Cookie settings', exact: true })
  await expect(notice.getByRole('alert')).toHaveText('Your cookie preference could not be read. Check your browser storage settings.')
  await notice.getByRole('button', { name: 'Reject cookies', exact: true }).click()
  await expect(notice).toHaveCount(0)
})

test('unsaved preferences stay open with an explicit error for either choice', async ({ page }) => {
  await page.addInitScript(key => {
    const setItem = Storage.prototype.setItem
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('Storage full', 'QuotaExceededError')
      return setItem.call(this, name, value)
    }
  }, cookieConsentKey)
  await page.goto('/draw')
  const notice = page.getByRole('region', { name: 'Cookie settings', exact: true })
  for (const choice of ['Accept cookies', 'Reject cookies']) {
    await notice.getByRole('button', { name: choice, exact: true }).click()
    await expect(notice).toBeVisible()
    await expect(notice.getByRole('alert')).toHaveText('Your preference could not be saved. Check your browser storage settings.')
    expect(await page.evaluate(key => localStorage.getItem(key), cookieConsentKey)).toBeNull()
  }
})

for (const theme of ['light', 'dark']) {
  for (const [width, height] of [[1280, 900], [390, 844], [320, 568], [568, 240]]) {
    test(`cookie notice fits ${theme} at ${width}x${height}`, async ({ page }) => {
      await page.addInitScript(theme => localStorage.setItem('uug-design-theme', theme), theme)
      await page.setViewportSize({ width, height })
      await page.goto('/draw')
      const notice = page.getByRole('region', { name: 'Cookie settings', exact: true })
      await expect(notice).toBeVisible()
      await expect(notice).toHaveCSS('color', theme === 'dark' ? 'rgb(245, 244, 255)' : 'rgb(11, 11, 18)')
      const box = await notice.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x).toBeGreaterThanOrEqual(16)
      expect(box!.y).toBeGreaterThanOrEqual(16)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width - 16)
      expect(box!.y + box!.height).toBeLessThanOrEqual(height - 16)
      expect(await notice.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      if (width <= 640) {
        for (const name of ['Accept cookies', 'Reject cookies']) {
          expect((await notice.getByRole('button', { name, exact: true }).boundingBox())!.height).toBeGreaterThanOrEqual(44)
        }
      }
      await notice.getByRole('button', { name: 'Reject cookies', exact: true }).click()
      await expect(notice).toHaveCount(0)
      const trigger = page.getByRole('contentinfo').getByRole('button', { name: 'Cookie settings', exact: true })
      await trigger.click()
      await expect(notice).toBeVisible()
      await page.emulateMedia({ media: 'print' })
      await expect(notice).toBeHidden()
    })
  }
}
