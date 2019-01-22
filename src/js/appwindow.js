/**
 * Window manager module
 * TODO: add support for resizing windows
 */
import cssTemplate from './appwindow.css.js'
import htmlTemplate from './appwindow.html.js'
import './app-icon.js'
import Storage from './storage.js'
const storage = new Storage()

export default class AppWindow extends window.HTMLElement {
  constructor () {
    super()

    // setup default properties
    this.x = parseInt(this.style.top)
    this.y = parseInt(this.style.left)
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
    this._iconElem = this.shadowRoot.querySelector('app-icon')
    this._iconElem.setAttribute('img', '/image/icons/' + this.tagName.toLowerCase() + '.png')
    this._appIcon = this.shadowRoot.querySelector('app-icon')

    // set initial window dimensions
    this.style.minWidth = this.width + 'px'
    this.style.minHeight = this.height + 'px'

    // set initial position
    if (!this.style.top || !this.style.left) this.setStartPosition()

    // add start animation
    this.classList.add('zoomIn')

    // bind event listeners
    this.addEventListener('mousedown', this._focus)
    this.addEventListener('blur', this._blur)

    this._closeElem.addEventListener('click', () => this.destroy())

    this._setupDragEvents()
    this._focus() // set initial focus
    this.savePosition() // save initial position
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

  /**
   * Setup drag events
   */
  _setupDragEvents () {
    this.offsetX = parseInt(this.style.left)
    this.offsetY = parseInt(this.style.top)
    this.addEventListener('mousedown', this._dragStart, false)
    this.addEventListener('touchstart', this._dragStart, false)
  }

  /**
   * Setup event listeners on drag start
   * @param {Mouse Event} Mouse event
   */
  _dragStart (e) {
    this.dragItem = this
    this._contentElem.classList.add('dragging')
    let [x, y] = this.getPosition(e)
    this.initialX = x - parseInt(this.x) + this.offsetX
    this.initialY = y - parseInt(this.y) + this.offsetY
    this.addEventListener('mouseup', this._dragEnd, false)
    this.addEventListener('mousemove', this._dragUpdate, false)
    this.addEventListener('touchend', this._dragEnd, false)
    this.addEventListener('touchmove', this._dragUpdate, false)
  }

  /**
   * Handle drag event update
   * @param {Mouse Event} Mouse event
   */
  _dragUpdate (e) {
    e.preventDefault()
    let [x, y] = this.getPosition(e)
    this.x = parseInt(x - this.initialX + this.offsetX)
    this.y = parseInt(y - this.initialY + this.offsetY)
    this.placeElem(this.x, this.y, this.dragItem)
  }

  /**
   * Stop drag event
   * @param {Mouse Event} Mouse event
   */
  _dragEnd (e) {
    this.offsetX = this.x
    this.offsetY = this.y
    this.removeEventListener('mousemove', this._dragUpdate, false)
    this.removeEventListener('touchmove', this._dragUpdate, false)
    this._contentElem.classList.remove('dragging')
    this.savePosition()
  }

  /**
   * Get position - support for both mouse & touch events
   * @param {Mouse Event} Mouse event
   */
  getPosition (e) {
    return (e.type === 'touchstart' || e.type === 'touchmove')
      ? [e.touches[0].clientX, e.touches[0].clientY]
      : [e.clientX, e.clientY]
  }

  /**
   * Save position of element
   */
  savePosition () {
    storage.setJSON(this.tagName.toLowerCase(), {
      x: this.x,
      y: this.y
    })
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

  /**
   * Animate element destruction
   */
  destroy () {
    this.classList.add('zoomOut')
    setTimeout(() => { this.remove() }, 500)
  }

  /**
   * Focus element
   */
  _focus () {
    console.log('Focus window', this.tagName)

    // loop through all other elements to remove focused class... - not the most pretty way!
    let allElems = document.body.children
    for (let elem of allElems) {
      if (elem._contentElem) {
        if (elem.tagName == this.tagName) {
          elem.classList.add('focused')

          if (elem === this.activeElement) {
            console.log('SEEMS ACTIVE!')
          }
        } else {
          elem.classList.remove('focused')
        }
      }
    }
  }

  /**
   * Remove focus from element
   */
  _blur () {
    console.log('Blur window', this.tagName)
    this.classList.remove('focused')
    this.classList.add('blurred')
  }

  /**
   * Actions performed when element is created
   */
  connectedCallback () {
    console.log('Creating new window')
    this.addEventListener('mousedown', (e) => console.log(' -> mousedown'))
    this.addEventListener('mouseup', (e) => console.log(' -> mouseup'))
    this.addEventListener('click', (e) => console.log(' -> click'))
    this.addEventListener('focusin', (e) => console.log(' -> focusin'))
    this.addEventListener('focus', (e) => console.log(' -> focus'))
    this.addEventListener('blur', (e) => console.log(' -> blur'))
    this.addEventListener('focusout', (e) => console.log(' -> focusout'))
    this.addEventListener('blur', (e) => console.log(' -> blur'))
  }

  /**
   * Actions performed when element is removed
   */
  disconnectedCallback () {
    storage.remove(this.tagName.toLowerCase())
    console.log('Destroying window')
  }

  /**
   * Set observed attributes
   * @readonly
   * @static
   * @memberof AppWindow
   */
  static get observedAttributes () {
    return ['title', 'content', 'x', 'y', 'width', 'height']
  }

  /**
   * Handle attribute change
   * @param {String} name
   * @param {String} oldValue
   * @param {String} newValue
   * @memberof AppWindow
   */
  attributeChangedCallback (name, oldValue, newValue) {
    console.log(`Change "${name}" from "${oldValue}" to "${newValue}"`)

    if (this[name] !== newValue) {
      this[name] = newValue
    }

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
