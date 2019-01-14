/**
 * Chat module
 * TODO: persist (some!) latest messages in localStorage
 */
import AppWindow from './appwindow.js'
import Storage from './storage.js'
import Config from './config.js'
import * as _ from './helpers.js'
import cssTemplate from './chat.css.js'
import htmlTemplate from './chat.html.js'
const storage = new Storage()

export default class ChatApp extends AppWindow {
  constructor () {
    super()

    // extend content for AppWindow using external template
    this._contentElem.appendChild(htmlTemplate.content.cloneNode(true))
    this._contentElem.appendChild(cssTemplate.content.cloneNode(true))

    // set defaults
    this.setUsername(Config.defaultUsername)

    // setup elems
    this._titleElem = this.shadowRoot.querySelector('.title')
    this._messages = this.shadowRoot.querySelector('.chat-messages')
    this._messageElem = this.shadowRoot.querySelector('textarea')
    this._sendButton = this.shadowRoot.querySelector('button')
    this.setTitle('Live chat')

    // get previous messages from localStorage
    this.messages = storage.get('messages') || []
    if (this.messages.length) this.messages = JSON.parse(this.messages)

    // populate previously existing messages if exists in localStorage
    if (this.messages && this.messages.length) {
      for (let i = 0; i < this.messages.length; ++i) {
        let message = this.messages[i]
        this.displayMessage(message.text, message.user, message.time) // display only; no save since that will caus loop!
      }
    }

    // bind click & enter to submit vents
    this._sendButton.addEventListener('click', () => {
      this.sendMessage(this._messageElem.value, this.username)
    })

    this._messageElem.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.sendMessage(this._messageElem.value, this.username)
      }
    })

    this.setup()
  }

  /**
   * Set an username for the chat
   * @param {String} username
   */
  setUsername (username) {
    this.username = username
    storage.set('username', username) // save in storage
  }

  /**
   * Send a message to the server
   * @param {string} message
   * @param {string} username
   */
  sendMessage (message, username) {
    if (!message.length) return false

    this.connection.send(JSON.stringify({
      type: 'message',
      'data': message,
      'username': username,
      'channel': Config.defaultChatChannel,
      'key': Config.apiKey
    }))

    this._messageElem.value = '' // clear message box after message has been sent
  }

  /**
   * Add a chat message to the chat window
   * @param {string} mMssage
   * @param {string} Usernam
   * @param {string} Timestamp
   */
  displayMessage (message, user, time) {
    let msg = _.addTo(this._messages, 'p', false, 'message')
    let msgUser = _.addTo(msg, 'span', user, 'user')
    let msgMsg = _.addTo(msg, 'span', message, 'text')
    let msgTime = _.addTo(msg, 'span', time, 'time')
    this._messages.scrollTop = this._messages.scrollHeight // scroll to bottom of chat window
    return msg
  }

  /**
   * Add a message to the chat window, also save it
   * @param {string} message
   * @param {string} user
   */
  addMessage (message, user, time) {
    if (!time || typeof time === undefined) { time = _.timeStamp() }
    this.displayMessage(message, user, time)

    // save current list of messages in localStorage
    this.messages.push({
      time: time,
      user: user,
      text: message
    })

    this.saveMessages()
  }

  saveMessages () {
    storage.set('messages', JSON.stringify(this.messages))
  }

  /**
   * Setup the connection to the chat server,
   * as well as bindind of related events
   */
  setup () {
    let _this = this

    this.connection = new WebSocket(Config.chatHost, ['soap', 'xmpp'])

    this.connection.onopen = function () {
      console.log('Connection open!')
    }

    this.connection.onclose = function () {
      console.log('Connection closed')
    }

    /**
     * Display chat messages as they are received from the server
     */
    this.connection.onmessage = function (e) {
      let res = JSON.parse(e.data)
      if (res.type === 'message') { _this.addMessage(res.data, res.username) }
    }

    /**
     * Display connection errors
     */
    this.connection.onerror = function (error) {
      console.log('Error!', error)
    }
  }

  connectedCallback () {
    console.log('Hi fom chat')
  }

  disconnectedCallback () {
    this.connection.close()
    console.log('Bye from chat')
  }
}

// register element
window.customElements.define('chat-app', ChatApp)
