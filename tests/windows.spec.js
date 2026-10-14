import { test } from '@playwright/test'
import {
  center,
  expect,
  mouseDrag,
  openDesktop,
  savedPosition,
  windowState
} from './helpers.js'

test.beforeEach(async ({ page }) => {
  await openDesktop(page, {
    'memory-app': { x: 40, y: 40 },
    'notes-app': { x: 800, y: 60 }
  })
})

test('dragging the title bar moves the window and saves its position', async ({
  page
}) => {
  const notes = page.locator('notes-app')
  const before = await windowState(notes)
  const from = await center(notes.locator('.title'))

  await mouseDrag(page, from, { x: from.x - 300, y: from.y + 200 })

  expect(await windowState(notes)).toMatchObject({
    x: before.x - 300,
    y: before.y + 200
  })
  expect(await savedPosition(page, 'notes-app')).toEqual({
    x: before.x - 300,
    y: before.y + 200
  })
})

test('a fast drag keeps hold of the window', async ({ page }) => {
  const notes = page.locator('notes-app')
  const before = await windowState(notes)
  const from = await center(notes.locator('.title'))

  // two big jumps: the pointer is off the window between events
  await mouseDrag(page, from, { x: from.x - 500, y: from.y + 400 }, 2)

  expect(await windowState(notes)).toMatchObject({
    x: before.x - 500,
    y: before.y + 400
  })
})

test('dragging window content does not move the window', async ({ page }) => {
  const memory = page.locator('memory-app')
  const before = await windowState(memory)
  const from = await center(memory.locator('.score-elem'))

  await mouseDrag(page, from, { x: from.x + 200, y: from.y + 100 })

  expect(await windowState(memory)).toMatchObject({ x: before.x, y: before.y })
})

test('clicking a window raises it above the others', async ({ page }) => {
  const memory = page.locator('memory-app')
  const notes = page.locator('notes-app')
  // notes was opened last, so it starts on top
  expect((await windowState(notes)).z).toBeGreaterThan(
    (await windowState(memory)).z
  )

  await memory.locator('.title').click()

  expect((await windowState(memory)).z).toBeGreaterThan(
    (await windowState(notes)).z
  )
  await expect(memory).toHaveClass(/focused/)
  await expect(notes).not.toHaveClass(/focused/)
})
