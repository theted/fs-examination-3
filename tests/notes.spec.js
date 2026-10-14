import { test } from '@playwright/test'
import { expect, openDesktop } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await openDesktop(page, { 'notes-app': { x: 40, y: 40 } })
})

test('lists notes and opens one for editing', async ({ page }) => {
  const notes = page.locator('notes-app')
  await expect(notes.locator('#notes-list button')).toHaveText([
    'Foo',
    'Bar',
    'Ny notering'
  ])

  await notes.locator('#notes-list button', { hasText: 'Foo' }).click()

  await expect(notes.locator('#notes-edit')).toBeVisible()
  await expect(notes.locator('input[name="title"]')).toHaveValue('Foo')
  await expect(notes.locator('.title h3')).toHaveText('Foo')
})

test('a saved note keeps its content', async ({ page }) => {
  const notes = page.locator('notes-app')
  await notes.locator('#notes-list button', { hasText: 'Bar' }).click()
  await notes.locator('textarea[name="note"]').fill('Remember the milk')
  await notes.locator('button[name="save"]').click()
  await notes.locator('button[name="close"]').click()

  await expect(notes.locator('#notes-list')).toBeVisible()
  await notes.locator('#notes-list button', { hasText: 'Bar' }).click()
  await expect(notes.locator('textarea[name="note"]')).toHaveValue(
    'Remember the milk'
  )
})

test('a new note is added to the list and kept after a reload', async ({
  page
}) => {
  const notes = page.locator('notes-app')
  await notes.locator('button[name="new"]').click()
  await notes.locator('input[name="title"]').fill('Shopping')
  await notes.locator('textarea[name="note"]').fill('Eggs')
  await notes.locator('button[name="save"]').click()
  await expect(notes.locator('.title h3')).toHaveText('Shopping')

  await page.reload()
  await expect(notes.locator('#notes-list button')).toHaveText([
    'Foo',
    'Bar',
    'Ny notering',
    'Shopping'
  ])
  await notes.locator('#notes-list button', { hasText: 'Shopping' }).click()
  await expect(notes.locator('textarea[name="note"]')).toHaveValue('Eggs')
})

test('changing the title renames the note', async ({ page }) => {
  const notes = page.locator('notes-app')
  await notes.locator('#notes-list button', { hasText: 'Foo' }).click()
  await notes.locator('input[name="title"]').fill('Ideas')
  await notes.locator('button[name="save"]').click()
  await notes.locator('button[name="close"]').click()

  await expect(notes.locator('#notes-list button')).toHaveText([
    'Bar',
    'Ny notering',
    'Ideas'
  ])
})

test('a note needs a title', async ({ page }) => {
  const notes = page.locator('notes-app')
  await notes.locator('button[name="new"]').click()
  await notes.locator('textarea[name="note"]').fill('No title')
  await notes.locator('button[name="save"]').click()
  await notes.locator('button[name="close"]').click()

  await expect(notes.locator('#notes-list button')).toHaveCount(3)
})
