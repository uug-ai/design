import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

async function expectSectionBelowNavigation(page: Page, id: string) {
  await expect.poll(() => page.evaluate(sectionId => {
    const section = document.getElementById(sectionId)?.getBoundingClientRect()
    const navigation = document.querySelector('.components-nav-sticky')?.getBoundingClientRect()
    const header = document.querySelector('.header')?.getBoundingClientRect()
    return !!section && !!navigation && !!header &&
      navigation.top >= header.bottom - 1 &&
      section.top >= navigation.bottom - 1 &&
      section.top <= navigation.bottom + 20 ? 'aligned' : {
        sectionTop: section?.top, navigationTop: navigation?.top,
        navigationBottom: navigation?.bottom, headerBottom: header?.bottom,
      }
  }, id)).toBe('aligned')
}

for (const theme of ['light', 'dark']) {
  test(`previews follow the saved ${theme} site theme and header toggles`, async ({ page }) => {
    await page.addInitScript(value => {
      if (!window.localStorage.getItem('uug-design-theme')) window.localStorage.setItem('uug-design-theme', value)
    }, theme)
    await page.goto('/components')
    await expect(page.getByLabel('Widget theme')).toHaveValue('auto')
    await expect(page.locator(`.component-demo > [data-hub-theme="${theme}"]`)).toHaveCount(13)
    const preview = page.locator('.component-demo > .hub-widgets').first()
    await expect(preview).toHaveCSS('color-scheme', theme)
    await expect(preview).toHaveCSS('background-color', theme === 'dark' ? 'rgb(26, 26, 26)' : 'rgb(238, 236, 236)')

    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    await page.getByRole('button', { name: `Switch to ${nextTheme} mode`, exact: true }).click()
    await expect(page.locator(`.component-demo > [data-hub-theme="${nextTheme}"]`)).toHaveCount(13)
    await expect(preview).toHaveCSS('color-scheme', nextTheme)
    await page.locator('#modal').getByRole('button', { name: 'Edit camera', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Edit camera', exact: true }))
      .toHaveCSS('background-color', nextTheme === 'dark' ? 'rgb(38, 38, 38)' : 'rgb(255, 255, 255)')
    await page.keyboard.press('Escape')
    await page.reload()
    await expect(page.getByLabel('Widget theme')).toHaveValue('auto')
    await expect(page.locator(`.component-demo > [data-hub-theme="${nextTheme}"]`)).toHaveCount(13)
  })
}

test('previews follow the system dark theme without a saved preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/components')
  await expect(page.getByLabel('Widget theme')).toHaveValue('auto')
  await expect(page.locator('.component-demo > [data-hub-theme="dark"]')).toHaveCount(13)
})

test('explicit widget themes override the site until Follow site is restored', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem('uug-design-theme', 'dark'))
  await page.goto('/components')
  const selector = page.getByLabel('Widget theme')
  await selector.selectOption('light')
  await expect(page.locator('.component-demo > [data-hub-theme="light"]')).toHaveCount(13)
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click()
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click()
  await expect(page.locator('.component-demo > [data-hub-theme="light"]')).toHaveCount(13)
  await selector.selectOption('auto')
  await expect(page.locator('.component-demo > [data-hub-theme="dark"]')).toHaveCount(13)
  await selector.selectOption('dark')
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click()
  await expect(page.locator('.component-demo > [data-hub-theme="dark"]')).toHaveCount(13)
  await selector.selectOption('auto')
  await expect(page.locator('.component-demo > [data-hub-theme="light"]')).toHaveCount(13)
})

for (const width of [320, 390, 768, 1440]) {
  test(`public previews and section navigation fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/components')
    await page.evaluate(() => document.fonts.ready)
    const previews = page.locator('.component-demo > .hub-widgets')
    await expect(previews).toHaveCount(13)
    for (const theme of ['light', 'dark']) {
      await page.getByLabel('Widget theme').selectOption(theme)
      await expect(page.locator(`.component-demo > [data-hub-theme="${theme}"]`)).toHaveCount(13)
      const bounds = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }))
      expect(bounds.content).toBeLessThanOrEqual(bounds.viewport)
    }
    await page.getByRole('navigation', { name: 'Component sections' })
      .getByRole('button', { name: 'Forms', exact: true }).click()
    await expectSectionBelowNavigation(page, 'forms')
    await expect(page.getByRole('navigation', { name: 'Component sections' })
      .getByRole('button', { name: 'Forms', exact: true })).toHaveAttribute('aria-pressed', 'true')
  })
}

for (const [fragment, section] of [['inputs', 'forms'], ['cards', 'surfaces'], ['loader', 'feedback']]) {
  test(`initial legacy #${fragment} link lands at its replacement section`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(`/components#${fragment}`)
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator(`#${section} #${fragment}`)).toHaveCount(1)
    await expectSectionBelowNavigation(page, section)
  })
}

test('public edit and confirmation dialogs retain working demo feedback and focus', async ({ page }) => {
  await page.goto('/components')
  const section = page.locator('#modal')
  const trigger = section.getByRole('button', { name: 'Edit camera', exact: true })
  await trigger.click()
  const edit = page.getByRole('dialog', { name: 'Edit camera', exact: true })
  await edit.getByRole('textbox', { name: 'Camera name', exact: true }).fill('Loading bay')
  await page.keyboard.press('Escape')
  await expect(edit).toBeHidden()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await edit.getByRole('button', { name: 'Save settings', exact: true }).click()
  await expect(edit).toBeHidden()
  await expect(section.getByRole('status')).toContainText('Camera settings saved in this demo.')
  await section.getByRole('button', { name: 'Delete camera', exact: true }).click()
  const confirmation = page.getByRole('dialog', { name: 'Delete camera?', exact: true })
  await confirmation.getByRole('button', { name: 'Delete camera', exact: true }).click()
  await expect(confirmation).toBeHidden()
  await expect(section.getByRole('status')).toContainText('No Hub data was changed.')
})

for (const width of [320, 1280]) {
  test(`modal section displays a complete in-flow preview at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/components')
    const section = page.locator('#modal')
    const preview = section.getByRole('region', { name: 'Edit camera preview', exact: true })
    await expect(preview.locator('.hub-modal-header').getByRole('heading', { name: 'Edit camera preview' })).toBeVisible()
    await expect(preview.locator('.hub-modal-body').getByRole('textbox', { name: 'Camera name', exact: true })).toBeVisible()
    await expect(preview.locator('.hub-modal-body').getByRole('textbox', { name: 'Description', exact: true })).toBeVisible()
    await expect(preview.locator('.hub-modal-actions').getByRole('button', { name: 'Cancel', exact: true })).toBeVisible()
    await expect(preview.locator('.hub-modal-actions').getByRole('button', { name: 'Save settings', exact: true })).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(preview.getByRole('textbox', { name: 'Camera name', exact: true })).not.toBeFocused()
    await expect(preview).toHaveCSS('position', 'static')

    for (const theme of ['light', 'dark']) {
      await page.getByLabel('Widget theme').selectOption(theme)
      await expect(preview).toHaveCSS('background-color', theme === 'dark' ? 'rgb(38, 38, 38)' : 'rgb(255, 255, 255)')
      const bounds = await preview.evaluate(element => ({
        left: element.getBoundingClientRect().left,
        right: element.getBoundingClientRect().right,
        scroll: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }))
      expect(bounds.left).toBeGreaterThanOrEqual(0)
      expect(bounds.right).toBeLessThanOrEqual(width)
      expect(bounds.scroll).toBeLessThanOrEqual(bounds.viewport)
    }

    await preview.getByRole('textbox', { name: 'Camera name', exact: true }).fill('Loading bay')
    await preview.getByRole('button', { name: 'Save settings', exact: true }).click()
    await expect(preview).toHaveCount(0)
    await expect(section.getByRole('status')).toContainText('Preview settings saved in this demo.')
    const restore = section.getByRole('button', { name: 'Restore modal preview', exact: true })
    await expect(restore).toBeFocused()
    await restore.click()
    await expect(preview.getByRole('textbox', { name: 'Camera name', exact: true })).toHaveValue('Entrance camera')
    await expect(preview.getByRole('textbox', { name: 'Camera name', exact: true })).toBeFocused()
    await preview.getByRole('button', { name: 'Cancel', exact: true }).click()
    await expect(preview).toHaveCount(0)
    await restore.click()
    await preview.getByRole('button', { name: 'Close preview', exact: true }).click()
    await expect(preview).toHaveCount(0)
    await expect(restore).toBeFocused()
  })
}

test('public progress and dismissible messages remain interactive', async ({ page }) => {
  await page.goto('/components')
  const feedback = page.locator('#feedback')
  await feedback.getByRole('button', { name: 'Dismiss message', exact: true }).click()
  await feedback.getByRole('button', { name: 'Restore message', exact: true }).click()
  await expect(feedback.getByRole('button', { name: 'Dismiss message', exact: true })).toBeVisible()
  await page.getByRole('slider', { name: 'Upload progress', exact: true }).fill('100')
  await expect(page.getByRole('progressbar', { name: 'Uploading recording', exact: true }))
    .toHaveAttribute('aria-valuenow', '100')
})
