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
