import { test } from '@playwright/test'
import { expect, openDesktop, trackErrors } from './helpers.js'

// The chat is hidden while there is no chat server, but its code is kept.
// These tests open it directly, talking to a fake WebSocket that echoes
// every message back, like the course server did.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.WebSocket = class extends EventTarget {
      send(payload) {
        const { data, username } = JSON.parse(payload)
        const echo = JSON.stringify({ type: 'message', data, username })
        setTimeout(() =>
          this.dispatchEvent(new MessageEvent('message', { data: echo }))
        )
      }

      close() {}
    }
  })
  await openDesktop(page)
})

const openChat = (page) =>
  page.evaluate(() => {
    const chat = document.createElement('chat-app')
    chat.setAttribute('x', 40)
    chat.setAttribute('y', 40)
    document.body.append(chat)
  })

test('asks for a username, then sends and shows messages', async ({ page }) => {
  const errors = trackErrors(page)
  await openChat(page)

  await page.locator('app-modal input').fill('tester')
  await page.locator('app-modal input').press('Enter')

  const input = page.locator('chat-app textarea')
  await input.fill('Hello <b>world</b>')
  await input.press('Shift+Enter')
  await input.pressSequentially('second line')
  await input.press('Enter')

  const message = page.locator('chat-app .message').last()
  await expect(message.locator('.user')).toHaveText('tester')
  // shown as text: no HTML injection
  await expect(message.locator('.text')).toHaveText(
    'Hello <b>world</b>\nsecond line'
  )
  await expect(message.locator('.text b')).toHaveCount(0)
  await expect(input).toHaveValue('')
  expect(errors).toEqual([])
})

test('remembers the username and the latest messages', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('username', 'tester'))
  await openChat(page)
  await page.locator('chat-app textarea').fill('Saved for later')
  await page.locator('chat-app textarea').press('Enter')
  await expect(page.locator('chat-app .message .text')).toHaveText([
    'Saved for later'
  ])

  await page.reload()
  await openChat(page)

  await expect(page.locator('app-modal')).toHaveCount(0)
  await expect(page.locator('chat-app .message .text')).toHaveText([
    'Saved for later'
  ])
})
