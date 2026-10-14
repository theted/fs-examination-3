/**
 * Window manager module
 * TODO: add support for resizing windows
 */
import cssTemplate from './appwindow.css.js'
import htmlTemplate from './appwindow.html.js'
import './app-icon.js'
import Storage from './storage.js'
const storage = new Storage()

// open windows in stacking order, top-most last
const stack = []

export default class AppWindow extends window.HTMLElement {
  constructor() {
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
    this._dragHandle = this.shadowRoot.querySelector('.title')
    this._iconElem = this.shadowRoot.querySelector('app-icon')
    this._iconElem.setAttribute(
      'img',
      '/image/icons/' + this.tagName.toLowerCase() + '.png'
    )
    this._appIcon = this.shadowRoot.querySelector('app-icon')

    // bind event listeners
    this.addEventListener('pointerdown', this._focus)
    this.addEventListener('blur', this._blur)

    this._closeElem.addEventListener('click', () => this.destroy())
  }

  /**
   * Update position of element
   * @param {Element} el (this)
   * @param {number} x
   * @param {number} y
   */
  setElementPosition(el, x, y) {
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
  setStartPosition() {
    this.centerElem()
  }

  /**
   * Place window at center of screen
   */
  centerElem() {
    this.x = window.innerWidth / 2 - this.width / 2
    this.y = window.innerHeight / 2 - this.height / 2
    this.setElementPosition(this, this.x, this.y)
  }

  /**
   * Set height of element
   * @param {number} Height - in px
   */
  setHeight(height) {
    this.style.height = height + 'px'
  }

  /**
   * Setup drag events. Pointer events give the mouse and every finger their
   * own pointerId, so several windows can be dragged at the same time.
   */
  _setupDragEvents() {
    this._dragHandle.addEventListener('pointerdown', (e) => this._dragStart(e))
    this._dragHandle.addEventListener('pointermove', (e) => this._dragUpdate(e))
    this._dragHandle.addEventListener('pointerup', (e) => this._dragEnd(e))
    this._dragHandle.addEventListener('pointercancel', (e) => this._dragEnd(e))
  }

  /**
   * Start dragging the window with the pointer that went down on it
   * @param {PointerEvent} Pointer event
   */
  _dragStart(e) {
    // one pointer per window: ignore extra fingers and non-primary buttons
    if (this._dragPointer !== undefined || e.button !== 0) return

    this._dragPointer = e.pointerId
    // keep receiving this pointer's events even when it leaves the window
    this._dragHandle.setPointerCapture(e.pointerId)
    this._dragOffsetX = e.clientX - this.offsetLeft
    this._dragOffsetY = e.clientY - this.offsetTop
    this._contentElem.classList.add('dragging')
  }

  /**
   * Move the window along with its drag pointer
   * @param {PointerEvent} Pointer event
   */
  _dragUpdate(e) {
    if (e.pointerId !== this._dragPointer) return

    ;[this.x, this.y] = this._keepInView(
      Math.round(e.clientX - this._dragOffsetX),
      Math.round(e.clientY - this._dragOffsetY)
    )
    this.placeElem(this.x, this.y, this)
  }

  /**
   * Limit a window position so part of the title bar stays on screen and the
   * window can always be grabbed again (e.g. a position saved on a bigger screen)
   * @param {number} x
   * @param {number} y
   * @returns {number[]} [x, y]
   */
  _keepInView(x, y) {
    const visible = 140 // px of the window kept on screen horizontally
    const minX = visible - this.offsetWidth
    const maxX = window.innerWidth - visible
    const maxY = window.innerHeight - 40

    return [Math.max(minX, Math.min(x, maxX)), Math.max(0, Math.min(y, maxY))]
  }

  /**
   * Stop dragging when the drag pointer is released (or cancelled)
   * @param {PointerEvent} Pointer event
   */
  _dragEnd(e) {
    if (e.pointerId !== this._dragPointer) return

    this._dragPointer = undefined
    this._contentElem.classList.remove('dragging')
    this.savePosition()
  }

  /**
   * Save position of element
   */
  savePosition() {
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
  placeElem(x, y, el) {
    el.style.left = x + 'px'
    el.style.top = y + 'px'
  }

  /**
   * Set the title of the window
   * @param {string} Window title
   */
  setTitle(title) {
    this._titleElem.textContent = title
  }

  /**
   * Set (HTML) content
   * @param {String} HTML content
   */
  setContent(content) {
    this._contentElem.innerHTML = content
  }

  /**
   * Animate element destruction
   */
  destroy() {
    this.classList.add('zoomOut')
    setTimeout(() => {
      this.remove()
    }, 500)
  }

  /**
   * Focus element: raise it to the top, keeping the order of the others, so
   * windows dragged at the same time all stay above the rest
   */
  _focus() {
    console.log('Focus window', this.tagName)

    const index = stack.indexOf(this)
    if (index !== -1) stack.splice(index, 1)
    stack.push(this)

    stack.forEach((win, i) => {
      win.style.zIndex = 2 + i
      win.classList.toggle('focused', win === this)
    })
  }

  /**
   * Remove focus from element
   */
  _blur() {
    console.log('Blur window', this.tagName)
    this.classList.remove('focused')
    this.classList.add('blurred')
  }

  /**
   * Actions performed when element is added to the DOM.
   * Custom elements (v1) must not gain attributes in their constructor, so
   * everything touching the host's style, class or attributes happens here.
   */
  connectedCallback() {
    // only set up once, even if the element is moved around in the DOM
    if (this._initialized) return
    this._initialized = true

    // set initial window dimensions
    this.style.minWidth = this.width + 'px'
    this.style.minHeight = this.height + 'px'

    // set initial position
    if (!this.style.top || !this.style.left) this.setStartPosition()

    // pull restored windows back on screen if needed
    const [x, y] = this._keepInView(this.offsetLeft, this.offsetTop)
    if (x !== this.offsetLeft || y !== this.offsetTop) {
      this.x = x
      this.y = y
      this.placeElem(x, y, this)
    }

    // add start animation
    this.classList.add('zoomIn')

    this._setupDragEvents()
    this._focus() // set initial focus
    this.savePosition() // save initial position

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
  disconnectedCallback() {
    const index = stack.indexOf(this)
    if (index !== -1) stack.splice(index, 1)

    storage.remove(this.tagName.toLowerCase())
    console.log('Destroying window')
  }

  /**
   * Set observed attributes
   * @readonly
   * @static
   * @memberof AppWindow
   */
  static get observedAttributes() {
    return ['title', 'content', 'x', 'y', 'width', 'height']
  }

  /**
   * Handle attribute change
   * @param {String} name
   * @param {String} oldValue
   * @param {String} newValue
   * @memberof AppWindow
   */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Change "${name}" from "${oldValue}" to "${newValue}"`)

    if (this[name] !== newValue) {
      this[name] = newValue
    }

    switch (name) {
      case 'title':
        this.setTitle(newValue)
        break
      case 'content':
        this._contentElem.textContent = newValue
        break
      case 'x':
        this.style.left = newValue + 'px'
        break
      case 'y':
        this.style.top = newValue + 'px'
        break
      case 'width':
        this.style.width = newValue + 'px'
        break
      case 'height':
        this.style.height = newValue + 'px'
        break
    }
  }
}

// register element
window.customElements.define('app-window', AppWindow)
