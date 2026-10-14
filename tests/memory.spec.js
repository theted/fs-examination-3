import { test } from '@playwright/test'
import { expect, openDesktop, trackErrors } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await openDesktop(page, { 'memory-app': { x: 40, y: 40 } })
})

/** Tile indexes grouped by image: [[a, b], [c, d], ...] */
async function pairs(page) {
  const numbers = await page
    .locator('memory-app .tiles img')
    .evaluateAll((tiles) => tiles.map((t) => t.dataset.image))
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
    'All pairs found'
  )
  await expect(page.locator('memory-app .tiles p')).toHaveText(
    '8 pairs in 8 guesses'
  )
  await page
    .locator('memory-app .tiles button', { hasText: 'Play again' })
    .click()
  await expect(tiles).toHaveCount(16)
  expect(errors).toEqual([])
})

test('the game can be played with the keyboard', async ({ page }) => {
  const tile = page.locator('memory-app .tiles img').first()

  await tile.press('Enter')

  await expect(tile).not.toHaveAttribute('src', /\/0\.png$/)
})

test('the turned tile and matched tiles ignore clicks', async ({ page }) => {
  const tiles = page.locator('memory-app .tiles img')
  const [[a, b], [c]] = await pairs(page)

  await tiles.nth(a).click()
  await tiles.nth(a).click() // same tile again: not a guess
  await tiles.nth(b).click()
  await expect(page.locator('memory-app #score')).toHaveText('7')

  await tiles.nth(a).click() // matched tile: ignored
  await tiles.nth(c).click()
  await expect(tiles.nth(c)).not.toHaveAttribute('src', /\/0\.png$/)
  await expect(page.locator('memory-app #fails')).toHaveText('0')
})

test('tiles are locked while a wrong pair is showing', async ({ page }) => {
  const tiles = page.locator('memory-app .tiles img')
  const [[a], [b], [c]] = await pairs(page)

  await tiles.nth(a).click()
  await tiles.nth(b).click()
  await tiles.nth(c).click() // too early

  await expect(tiles.nth(c)).toHaveAttribute('src', /\/0\.png$/)
  await expect(tiles.nth(a)).toHaveAttribute('src', /\/0\.png$/) // flipped back
  await tiles.nth(c).click()
  await expect(tiles.nth(c)).not.toHaveAttribute('src', /\/0\.png$/)
})

test('accuracy is updated', async ({ page }) => {
  const tiles = page.locator('memory-app .tiles img')
  const [[a, b], [c], [d]] = await pairs(page)

  await tiles.nth(a).click()
  await tiles.nth(b).click()
  await expect(page.locator('memory-app #accur')).toHaveText('100 %')

  await tiles.nth(c).click()
  await tiles.nth(d).click()
  await expect(page.locator('memory-app #accur')).toHaveText('50 %')
})

test('the window icon starts a new game with the chosen number of pairs', async ({
  page
}) => {
  await page.locator('memory-app .icon app-icon').click()

  const input = page.locator('app-modal input')
  await expect(input).toBeFocused()
  await input.fill('4')
  await input.press('Enter')

  await expect(page.locator('app-modal')).toHaveCount(0)
  await expect(page.locator('memory-app .tiles img')).toHaveCount(8)
  await expect(page.locator('memory-app #score')).toHaveText('4')
})

test('the new-game dialog can be dismissed', async ({ page }) => {
  await page.locator('memory-app .icon app-icon').click()
  await page.locator('app-modal input').press('Escape')

  await expect(page.locator('app-modal')).toHaveCount(0)
  await expect(page.locator('memory-app .tiles img')).toHaveCount(16)
})

test('other windows do not trigger the memory game', async ({ page }) => {
  const errors = trackErrors(page)
  await openDesktop(page, {
    'memory-app': { x: 40, y: 40 },
    'notes-app': { x: 700, y: 40 }
  })

  // Enter in another window used to throw in every memory game
  await page.locator('notes-app button[name="new"]').click()
  await page.locator('notes-app input[name="title"]').press('Enter')

  // closing another window used to open the new-game dialog
  await page.locator('notes-app .close app-icon').click()
  await expect(page.locator('notes-app')).toHaveCount(0)
  await expect(page.locator('app-modal')).toHaveCount(0)
  expect(errors).toEqual([])
})
