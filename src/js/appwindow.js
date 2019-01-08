/**
 * Window manager module
 *
 * TODO: add support for any type of main content
 * TODO: add support for resizing windows
 * TODO: add support for moving windows
 * TODO: add support for focus / handle z-index as correctly
 * TODO: add support for closing windows
 */
import cssTemplate from './appwindow.css.js'
import htmlTemplate from './appwindow.html.js'

export default class AppWindow extends window.HTMLElement {
  constructor () {
    super()

    // setup default properties
    this.x = 0
    this.y = 0
    this.focus = false

    // set windows dimensions
    this.width = 300
    this.height = 160 // TODO: auto-calc height

    // attatch shadow DOM & append template
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(htmlTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))

    // setup sub-elements
    this._contentElem = this.shadowRoot.querySelector('.content')
    this._titleElem = this.shadowRoot.querySelector('.title')
    this._closeElem = this.shadowRoot.querySelector('.close')
    this._moveElem = this.shadowRoot.querySelector('.move')

    // set initial window dimensions
    this.style.width = this.width + 'px'
    this.style.height = this.height + 'px'

    // place window at center of screen
    this.x = (window.innerWidth / 2) - (this.width / 2)
    this.y = (window.innerHeight / 2) - (this.height / 2)
    this.style.left = this.x + 'px'
    this.style.top = this.y + 'px'

    // bind event listeners
    this.addEventListener('click', this._focus)
    this._closeElem.addEventListener('click', () => this.destroy())
    // this.onmousedown = this.dragStart // setup initial mousedown event
  }

  /**
   * Set the title of the window
   * @param {string} Window title
   */
  setTitle (title) {
    this._titleElem.textContent = title
  }

  /**
   * Set (HTML) content
   * @param {strinf} HTML content
   */
  setContent (content) {
    this._contentElem.innerHTML = content
  }

  destroy () {
    this.remove()
  }

  _focus () {
    console.log('Should focus window!', this)
  }

  connectedCallback () {
    console.log('Creating new window')
  }

  disconnectedCallback () {
    console.log('Destroying window')
  }

  static get observedAttributes () {
    return ['title', 'content', 'x', 'y', 'width', 'height']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    console.log(`Change "${name}" from "${oldValue}" to "${newValue}"`)

    switch (name) {
      case 'title': this.setTitle(newValue); break
      case 'content': this._contentElem.textContent = newValue; break
      case 'x': this.style.left = newValue + 'px'; break
      case 'y': this.style.top = newValue + 'px'; break
      case 'width': this.style.width = newValue + 'px'; break
      case 'height': this.style.height = newValue + 'px'; break
    }
  }
}

// register element
window.customElements.define('app-window', AppWindow)
