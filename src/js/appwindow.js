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
import './app-icon.js'

export default class AppWindow extends window.HTMLElement {
  constructor () {
    super()

    // setup default properties
    this.x = this.style.top
    this.y = this.style.left
    this.focus = false

    // set windows dimensions
    this.width = 400
    this.height = 160 // TODO: auto-calc height

    // attatch shadow DOM & append template
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(htmlTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))

    // setup sub-elements
    this._contentElem = this.shadowRoot.querySelector('.content')
    this._titleElem = this.shadowRoot.querySelector('.title h3')
    this._closeElem = this.shadowRoot.querySelector('.close')
    this._moveElem = this.shadowRoot.querySelector('.move')
    this._iconElem = this.shadowRoot.querySelector('.icon img')
    this._iconElem.src = '/image/icons/' + this.tagName.toLowerCase() + '.png'
    this._appIcon = this.shadowRoot.querySelector('app-icon')

    // set initial window dimensions
    this.style.minWidth = this.width + 'px'
    this.style.minHeight = this.height + 'px'

    // set initial position
    if (!this.style.top) this.setStartPosition()

    // add start animation
    this.classList.add('zoomIn')

    // bind event listeners
    this.addEventListener('click', this._focus)
    this.addEventListener('focusout', this._blur)
    this._closeElem.addEventListener('click', () => this.destroy())
    this._setupDragEvents()
  }

  /**
   * Update position of element
   * @param {Element} el (this)
   * @param {number} x
   * @param {number} y
   */
  setElementPosition (el, x, y) {
    el.style.top = x + 'px'
    el.style.left = y + 'px'
    // el.x = x
    // el.y = y
    el.setAttribute('x', x)
    el.setAttribute('y', y)
  }

  /**
   * Set start position
   */
  setStartPosition () {
    this.centerElem()
  }

  /**
   * Place window at center of screen
   */
  centerElem () {
    this.x = (window.innerWidth / 2) - (this.width / 2)
    this.y = (window.innerHeight / 2) - (this.height / 2)
    this.setElementPosition(this, this.x, this.y)
  }

  /**
   * Set height of element
   * @param {number} Height - in px
   */
  setHeight (height) {
    this.style.height = height + 'px'
  }

  _setupDragEvents () {
    this.offsetX = parseInt(this.style.left)
    this.offsetY = parseInt(this.style.top)
    this.addEventListener('mousedown', this._dragStart, false)
  }

  /**
   * Setup event listeners on drag start
   */
  _dragStart (e) {
    this.dragItem = this
    this.initialX = e.clientX - parseInt(this.x) + this.offsetX
    this.initialY = e.clientY - parseInt(this.y) + this.offsetY
    this.addEventListener('mouseup', this._dragEnd, false)
    this.addEventListener('mousemove', this._dragUpdate, false)
  }

  /**
   * Handle drag event update
   */
  _dragUpdate (e) {
    e.preventDefault()
    this._contentElem.classList.add('dragging')
    this.x = e.clientX - this.initialX + this.offsetX
    this.y = e.clientY - this.initialY + this.offsetY
    this.placeElem(this.x, this.y, this.dragItem)
  }

  /**
   * Stop drag event
   */
  _dragEnd (e) {
    this.offsetX = this.x
    this.offsetY = this.y
    this.removeEventListener('mousemove', this._dragUpdate, false)
    this._contentElem.classList.remove('dragging')
  }

  /**
   * Absolutely position an element
   * @param {number} X coordinates in pixels
   * @param {number} Y coordinates in pixels
   * @param {HTMLElement} HTML Element
   */
  placeElem (x, y, el) {
    el.style.left = x + 'px'
    el.style.top = y + 'px'
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
   * @param {String} HTML content
   */
  setContent (content) {
    this._contentElem.innerHTML = content
  }

  destroy () {
    console.log('Will remove...')
    this.classList.add('zoomOut')
    setTimeout(() => { this.remove() }, 500)
  }

  _focus () {
    console.log('Focus window')
    this.style.zIndex = 2
  }

  _blur () {
    console.log('Blur window')
    this.style.zIndex = 1
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
      case 'x': console.log('moveX'); this.style.left = newValue + 'px'; break
      case 'y': console.log('moveY'); this.style.top = newValue + 'px'; break
      case 'width': this.style.width = newValue + 'px'; break
      case 'height': this.style.height = newValue + 'px'; break
    }
  }
}

// register element
window.customElements.define('app-window', AppWindow)
