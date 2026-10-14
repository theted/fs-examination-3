import { test } from '@playwright/test'
import { expect, openDesktop } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await openDesktop(page, { 'settings-app': { x: 40, y: 40 } })
})

test('picking a background changes the desktop and is remembered', async ({
  page
}) => {
  const settings = page.locator('settings-app')
  await expect(settings.locator('#backgrounds')).toBeVisible()

  await settings.locator('#backgrounds img').nth(3).click()
  await expect(page.locator('body')).toHaveCSS(
    'background-image',
    /\/image\/backgrounds\/3\.jpg/
  )

  await page.reload()
  await expect(page.locator('body')).toHaveCSS(
    'background-image',
    /\/image\/backgrounds\/3\.jpg/
  )
})

// themes are custom properties inherited into each window's shadow DOM, so
// they work in every browser (they used :host-context(), Chromium only)
test('picking a theme restyles the windows and is remembered', async ({
  page
}) => {
  const settings = page.locator('settings-app')
  const title = settings.locator('.title h3')
  await expect(title).toHaveCSS('color', 'rgb(21, 26, 36)')

  await settings.locator('#tabs [role="tab"]', { hasText: 'Theme' }).click()
  const dark = settings.locator('#themes button', { hasText: 'Dark' })
  await dark.click()
  await expect(title).toHaveCSS('color', 'rgb(238, 241, 247)')
  await expect(dark).toHaveAttribute('aria-pressed', 'true')

  await page.reload()
  await expect(page.locator('settings-app .title h3')).toHaveCSS(
    'color',
    'rgb(238, 241, 247)'
  )
})

test('auto-hide is remembered and the dock shows on hover', async ({
  page
}) => {
  const settings = page.locator('settings-app')
  const dock = page.locator('app-icons')
  await settings.locator('#tabs [role="tab"]', { hasText: 'Options' }).click()
  await settings.locator('input[name="autoHide"]').check()
  await expect(dock).toHaveCSS('opacity', '0')

  await page.reload()
  await expect(dock).toHaveCSS('opacity', '0')
  await page
    .locator('settings-app #tabs [role="tab"]', { hasText: 'Options' })
    .click()
  await expect(
    page.locator('settings-app input[name="autoHide"]')
  ).toBeChecked()

  // point at the bottom edge of the screen, where the dock is hiding
  const { width, height } = page.viewportSize()
  await page.mouse.move(width / 2, height - 4)
  await expect(dock).toHaveCSS('opacity', '1')
})
