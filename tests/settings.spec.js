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

test('picking a theme restyles the windows and is remembered', async ({
  page
}) => {
  const settings = page.locator('settings-app')
  const content = settings.locator('.content')
  await expect(content).toHaveCSS('background-color', 'rgb(249, 249, 249)')

  await settings.locator('#tabs a', { hasText: 'Themes' }).click()
  await settings.locator('#themes p', { hasText: 'dark' }).click()
  await expect(content).toHaveCSS('background-color', 'rgb(35, 35, 35)')

  await page.reload()
  await expect(page.locator('settings-app .content')).toHaveCSS(
    'background-color',
    'rgb(35, 35, 35)'
  )
})

test('auto-hide is remembered and the dock shows on hover', async ({
  page
}) => {
  const settings = page.locator('settings-app')
  const dock = page.locator('app-icons')
  await settings.locator('#tabs a', { hasText: 'Options' }).click()
  await settings.locator('input[name="autoHide"]').check()
  await expect(dock).toHaveCSS('opacity', '0')

  await page.reload()
  await expect(dock).toHaveCSS('opacity', '0')
  await page.locator('settings-app #tabs a', { hasText: 'Options' }).click()
  await expect(
    page.locator('settings-app input[name="autoHide"]')
  ).toBeChecked()

  await dock.hover()
  await expect(dock).toHaveCSS('opacity', '1')
})
