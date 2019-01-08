/**
 * Chat module
 * TODO: persist (some!) latest messages in localStorage
 */
import AppWindow from './appwindow.js'
import Storage from './storage.js'
import Config from './config.js'
import * as _ from './helpers.js'
const storage = new Storage()

export default class ChatApp extends AppWindow {
  constructor () {
    super()

    // add additional content
    const template = document.createElement('template')
    template.innerHTML = /* html */ `
      <style>
        :host .message {
          background: #eee;
          border-bottom: #d0d0d0;
          padding: 3px;
        }
        :host .message .user {
          font-weight: bold;
        }
        :host .message .time {
          font-weight: 300;
        }
      </style>

      <div class="chat-messages"></div>
      <input type="text" name="message" id="message" placeholder="Message">
      <button class="submit">Send</button>
    `

    this._contentElem.appendChild(template.content.cloneNode(true))

    // set defaults
    this.username = 'Dude'
    storage.remove('messages')
    this.messages = storage.get('messages') || []
    if (this.messages.length) this.messages = JSON.parse(this.messages)

    // setup elems
    this._titleElem = this.shadowRoot.querySelector('.title')
    this._messages = this.shadowRoot.querySelector('.chat-messages')
    this._messageElem = this.shadowRoot.querySelector('input')
    this._sendButton = this.shadowRoot.querySelector('button')
    this.setTitle('Live chat')

    // populate messages if existing
    if (this.messages && this.messages.length) {
      console.log('messages ->')
      console.log((this.messages))

      for (let i = 0; i < this.messages.length; ++i) {
        let message = this.messages[i]
        console.log(message)
        this.addMessage(message.text, message.user, message.time)
      }
    } else {
      console.log('No previous messages...')
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

    this.addMessage('Heeey', 'testUser') // test UI
  }

  /**
   * Send a message to the server
   * @param {string} message
   * @param {string} username
   */
  sendMessage (message, username) {
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
   * Add a message to the chat window
   * @param {string} message
   * @param {string} user
   */
  addMessage (message, user, time) {
    if (!time || typeof time === undefined) { time = _.timeStamp() }

    // crate html elements for the message
    let msg = _.addTo(this._messages, 'p', false, 'message')
    let msgUser = _.addTo(msg, 'span', user, 'user')
    let msgMsg = _.addTo(msg, 'span', message, 'text')
    let msgTime = _.addTo(msg, 'span', time, 'time')

    // save current list of messages in localStorage
    this.messages.push({
      time: time,
      user: user,
      text: message
    })
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
      // sendMessage('Hello, World!!') // spam the server with a "Hello, World!" message on each sucessful cunnection... ;)
    }

    /**
     * Display chat messages as they are received from the server
     */
    this.connection.onmessage = function (e) {
      let res = JSON.parse(e.data)
      console.log('Msg: ', res)
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
    console.log('Bye from chat')
  }
}

// register element
window.customElements.define('chat-app', ChatApp)
