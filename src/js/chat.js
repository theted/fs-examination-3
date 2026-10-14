/**
 * Chat module. Hidden from the dock while Config.chatHost is null.
 */
import chatCss from '../css/components/chat.css?inline'
import AppWindow from './appwindow.js'
import AppModal from './app-modal.js'
import storage from './storage.js'
import Config from './config.js'
import { addTo, stylesheet, timeStamp } from './helpers.js'
import htmlTemplate from './chat.html.js'

const sheet = stylesheet(chatCss)

export default class ChatApp extends AppWindow {
  #connection = null
  #username = null
  #messages // saved messages: [{ time, user, text }]
  #messagesElem
  #input

  constructor() {
    super()

    this._addStyles(sheet)
    this._contentElem.append(htmlTemplate.content.cloneNode(true))
    this.#messagesElem = this.shadowRoot.querySelector('.chat-messages')
    this.#input = this.shadowRoot.querySelector('textarea')
    this.setTitle('Live chat')

    // show the messages saved from earlier sessions
    this.#messages = storage.getJSON('messages') ?? []
    for (const { text, user, time } of this.#messages) {
      this.#displayMessage(text, user, time)
    }

    this.shadowRoot
      .querySelector('button')
      .addEventListener('click', () => this.sendMessage(this.#input.value))

    // Enter sends, Shift+Enter starts a new line
    this.#input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.sendMessage(this.#input.value)
      }
    })
  }

  connectedCallback() {
    super.connectedCallback()

    if (!this.#connection) {
      this.#requireUsername()
      this.#connect()
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.#connection?.close()
  }

  /**
   * Send a message to the server
   * @param {string} text
   */
  sendMessage(text) {
    if (!text.trim()) return

    this.#connection.send(
      JSON.stringify({
        type: 'message',
        data: text,
        username: this.#username,
        channel: Config.defaultChatChannel,
        key: Config.apiKey
      })
    )
    this.#input.value = ''
  }

  /**
   * Use the saved username, or ask for one
   */
  async #requireUsername() {
    this.#username =
      storage.get('username') ??
      (await AppModal.prompt({
        content: 'Pick a username for the chat',
        placeholder: 'Username',
        action: 'Save'
      }))

    if (this.#username) storage.set('username', this.#username)
  }

  #connect() {
    this.#connection = new WebSocket(Config.chatHost)

    // show chat messages as they arrive (the server also sends heartbeats)
    this.#connection.addEventListener('message', (event) => {
      try {
        const { type, data, username } = JSON.parse(event.data)
        if (type === 'message') this.#addMessage(data, username)
      } catch (error) {
        console.warn('Unreadable chat message', error)
      }
    })

    this.#connection.addEventListener('error', () =>
      this.#displayMessage('Cannot reach the chat server', 'Chat', timeStamp())
    )
  }

  /**
   * Show a message and keep the latest ones for next time
   */
  #addMessage(text, user, time = timeStamp()) {
    this.#displayMessage(text, user, time)

    this.#messages = [...this.#messages, { time, user, text }].slice(
      -Config.maxChatMessages
    )
    storage.setJSON('messages', this.#messages)
  }

  #displayMessage(text, user, time) {
    const message = addTo(this.#messagesElem, 'p', '', 'message')
    addTo(message, 'span', user, 'user')
    // set as text (line breaks kept by CSS), so messages can't inject HTML
    addTo(message, 'span', text, 'text')
    addTo(message, 'span', time, 'time')

    // scroll to the newest message
    this.#messagesElem.scrollTop = this.#messagesElem.scrollHeight
  }
}

// register element
customElements.define('chat-app', ChatApp)
