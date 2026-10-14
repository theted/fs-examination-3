import { test } from '@playwright/test'
import {
  expect,
  openDesktop,
  openApp,
  trackErrors,
  windowState
} from './helpers.js'

test('first start opens the about window', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/')

  const about = page.locator('about-app')
  await expect(about).toHaveCount(1)
  await expect(about.locator('.title h3')).toHaveText('Personal web desktop!')
  expect(await windowState(about)).toMatchObject({ x: 200, y: 200 })
  expect(errors).toEqual([])
})

const apps = [
  ['memory', 'Memory game'],
  ['notes', 'Notes'],
  ['settings', 'Settings'],
  ['about', 'Personal web desktop!']
]

for (const [app, title] of apps) {
  test(`dock opens the ${app} app`, async ({ page }) => {
    const errors = trackErrors(page)
    await openDesktop(page)
    await openApp(page, app)

    const win = page.locator(`${app}-app`)
    await expect(win).toHaveCount(1)
    await expect(win.locator('.title h3')).toHaveText(title)
    const state = await windowState(win)
    expect(state).toMatchObject({ x: 300, y: 300 })
    expect(state.width).toBeGreaterThan(0)
    expect(errors).toEqual([])
  })
}

test('a second window of the same app opens offset', async ({ page }) => {
  await openDesktop(page)
  await openApp(page, 'notes')
  await openApp(page, 'notes')

  const windows = page.locator('notes-app')
  await expect(windows).toHaveCount(2)
  expect(await windowState(windows.nth(1))).toMatchObject({ x: 350, y: 350 })
})

test('open windows are restored after a reload', async ({ page }) => {
  await openDesktop(page, {
    'memory-app': { x: 40, y: 60 },
    'notes-app': { x: 700, y: 80 }
  })

  expect(await windowState(page.locator('memory-app'))).toMatchObject({
    x: 40,
    y: 60
  })
  expect(await windowState(page.locator('notes-app'))).toMatchObject({
    x: 700,
    y: 80
  })
})

test('a closed window stays closed after a reload', async ({ page }) => {
  await openDesktop(page, { 'notes-app': { x: 100, y: 100 } })

  await page.locator('notes-app .close app-icon').click()
  await expect(page.locator('notes-app')).toHaveCount(0)

  await page.reload()
  await expect(page.locator('notes-app')).toHaveCount(0)
})

test('chat is hidden while there is no chat server', async ({ page }) => {
  // a chat window left open from before must not come back either
  await openDesktop(page, { 'chat-app': { x: 100, y: 100 } })

  await expect(page.locator('app-icons #link-memory')).toBeVisible()
  await expect(page.locator('app-icons #link-chat')).toHaveCount(0)
  await expect(page.locator('chat-app')).toHaveCount(0)
})
