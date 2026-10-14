import { test } from '@playwright/test'
import {
  center,
  expect,
  openDesktop,
  savedPosition,
  windowState
} from './helpers.js'

// multi-finger input is emulated through the Chrome DevTools Protocol
test.skip(
  ({ browserName }) => browserName !== 'chromium',
  'needs CDP touch emulation'
)
test.use({ hasTouch: true })

/** Send the full list of active touch points, like a real touch screen */
const touch = (cdp, type, points) =>
  cdp.send('Input.dispatchTouchEvent', {
    type,
    touchPoints: points.map(({ id, x, y }) => ({
      id,
      x,
      y,
      radiusX: 2,
      radiusY: 2,
      force: 1
    }))
  })

// touch pointermove events are dispatched once per frame
const nextFrame = (page) =>
  page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())))

test('two fingers drag two windows at the same time', async ({ page }) => {
  await openDesktop(page, {
    'memory-app': { x: 40, y: 40 },
    'notes-app': { x: 1000, y: 60 },
    'settings-app': { x: 500, y: 650 }
  })
  const cdp = await page.context().newCDPSession(page)
  const memory = page.locator('memory-app')
  const notes = page.locator('notes-app')
  const settings = page.locator('settings-app')
  const [m0, n0, s0] = [
    await windowState(memory),
    await windowState(notes),
    await windowState(settings)
  ]

  const a = { id: 1, ...(await center(memory.locator('.title'))) }
  const b = { id: 2, ...(await center(notes.locator('.title'))) }
  const moveA = { x: 200, y: 250 }
  const moveB = { x: -300, y: 180 }
  const steps = 10

  await touch(cdp, 'touchStart', [a])
  await touch(cdp, 'touchStart', [a, b])
  for (let i = 1; i <= steps; i++) {
    const f = i / steps
    await touch(cdp, 'touchMove', [
      { ...a, x: a.x + moveA.x * f, y: a.y + moveA.y * f },
      { ...b, x: b.x + moveB.x * f, y: b.y + moveB.y * f }
    ])
    if (i === steps / 2) {
      // both windows are halfway along their own paths at the same moment
      await nextFrame(page)
      expect(await windowState(memory)).toMatchObject({
        x: m0.x + moveA.x / 2,
        y: m0.y + moveA.y / 2
      })
      expect(await windowState(notes)).toMatchObject({
        x: n0.x + moveB.x / 2,
        y: n0.y + moveB.y / 2
      })
    }
  }
  await nextFrame(page)
  await touch(cdp, 'touchEnd', [])

  const [m1, n1, s1] = [
    await windowState(memory),
    await windowState(notes),
    await windowState(settings)
  ]
  expect(m1).toMatchObject({ x: m0.x + moveA.x, y: m0.y + moveA.y })
  expect(n1).toMatchObject({ x: n0.x + moveB.x, y: n0.y + moveB.y })
  expect(s1).toMatchObject({ x: s0.x, y: s0.y })

  // both dragged windows are above the untouched one, last touched on top
  expect(m1.z).toBeGreaterThan(s1.z)
  expect(n1.z).toBeGreaterThan(m1.z)

  expect(await savedPosition(page, 'memory-app')).toEqual({ x: m1.x, y: m1.y })
  expect(await savedPosition(page, 'notes-app')).toEqual({ x: n1.x, y: n1.y })
})

test('tapping window content still works', async ({ page }) => {
  await openDesktop(page, { 'memory-app': { x: 40, y: 40 } })
  const tile = page.locator('memory-app .tiles img').first()

  await tile.tap()

  await expect(tile).not.toHaveAttribute('src', /\/0\.png$/)
})
