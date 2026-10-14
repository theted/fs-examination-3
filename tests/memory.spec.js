import { test } from '@playwright/test'
import { expect, openDesktop, trackErrors } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await openDesktop(page, { 'memory-app': { x: 40, y: 40 } })
})

/** Tile indexes grouped by image: [[a, b], [c, d], ...] */
async function pairs(page) {
  const numbers = await page
    .locator('memory-app .tiles img')
    .evaluateAll((tiles) => tiles.map((t) => t.getAttribute('image-number')))
  const byNumber = {}
  numbers.forEach((n, i) => (byNumber[n] ??= []).push(i))
  return Object.values(byNumber)
}

test('starts with 8 face-down pairs', async ({ page }) => {
  const tiles = page.locator('memory-app .tiles img')
  await expect(tiles).toHaveCount(16)
  for (const tile of await tiles.all())
    await expect(tile).toHaveAttribute('src', /\/0\.png$/)
  await expect(page.locator('memory-app #score')).toHaveText('8')
})

test('a matching pair is scored', async ({ page }) => {
  const tiles = page.locator('memory-app .tiles img')
  const [[a, b]] = await pairs(page)

  await tiles.nth(a).click()
  await tiles.nth(b).click()

  await expect(tiles.nth(a)).toHaveClass(/success/)
  await expect(tiles.nth(b)).toHaveClass(/success/)
  await expect(page.locator('memory-app #score')).toHaveText('7')
  await expect(page.locator('memory-app #fails')).toHaveText('0')
})

test('a wrong guess is counted and the tiles flip back', async ({ page }) => {
  const tiles = page.locator('memory-app .tiles img')
  const [[a], [b]] = await pairs(page)

  await tiles.nth(a).click()
  await tiles.nth(b).click()

  await expect(tiles.nth(a)).toHaveClass(/failure/)
  await expect(page.locator('memory-app #fails')).toHaveText('1')
  await expect(tiles.nth(a)).toHaveAttribute('src', /\/0\.png$/)
  await expect(tiles.nth(b)).toHaveAttribute('src', /\/0\.png$/)
})

test('matching every pair completes the game', async ({ page }) => {
  const errors = trackErrors(page)
  const tiles = page.locator('memory-app .tiles img')

  for (const [a, b] of await pairs(page)) {
    await tiles.nth(a).click()
    await tiles.nth(b).click()
  }

  await expect(page.locator('memory-app .tiles h1')).toHaveText(
    'GAME COMPLETED!'
  )
  await page.locator('memory-app .tiles button').click()
  await expect(tiles).toHaveCount(16)
  expect(errors).toEqual([])
})

test('the game can be played with the keyboard', async ({ page }) => {
  const tile = page.locator('memory-app .tiles img').first()

  await tile.press('Enter')

  await expect(tile).not.toHaveAttribute('src', /\/0\.png$/)
})
