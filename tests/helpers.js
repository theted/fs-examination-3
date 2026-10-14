import { expect } from '@playwright/test'

/**
 * Load the desktop with a known localStorage state.
 * By default: no first-start about window, no open windows.
 * @param {import('@playwright/test').Page} page
 * @param {Record<string, unknown>} storage - values that aren't strings are stored as JSON
 */
export async function openDesktop(page, storage = {}) {
  await page.goto('/')
  await page.evaluate((entries) => {
    localStorage.clear()
    localStorage.setItem('first-start', 'true')
    for (const [key, value] of Object.entries(entries)) {
      localStorage.setItem(
        key,
        typeof value === 'string' ? value : JSON.stringify(value)
      )
    }
  }, storage)
  await page.reload()
}

/**
 * Collect uncaught page errors; assert on them at the end of a test.
 * @param {import('@playwright/test').Page} page
 */
export function trackErrors(page) {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

/** Click an app in the dock */
export async function openApp(page, app) {
  await page.locator(`app-icons #link-${app}`).click()
}

/** Wait until an element and its shadow-host ancestors stop animating */
async function settled(locator) {
  await locator.evaluate(async (el) => {
    const animated = []
    for (let node = el; node; node = node.parentNode || node.host) {
      if (node.getAnimations) animated.push(...node.getAnimations())
    }
    await Promise.all(animated.map((a) => a.finished.catch(() => {})))
  })
}

/**
 * Position, size and stacking order of a window. Uses the layout box, so a
 * held window's slight lift (scale) doesn't count as moving it.
 */
export async function windowState(locator) {
  await settled(locator)
  return locator.evaluate((el) => ({
    x: el.offsetLeft,
    y: el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight,
    z: Number(getComputedStyle(el).zIndex) || 0
  }))
}

/** Center of an element, for mouse/touch input */
export async function center(locator) {
  await settled(locator)
  const box = await locator.boundingBox()
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

/** Saved window position from localStorage */
export async function savedPosition(page, key) {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k)), key)
}

/** Drag with the mouse from one point to another in a few steps */
export async function mouseDrag(page, from, to, steps = 5) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps })
  await page.mouse.up()
}

export { expect }
