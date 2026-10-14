/**
 * Window manager module: the base class of every app window.
 *
 * Subclasses add their content to `this._contentElem`, can listen to the
 * window icon (`this._iconElem`) and set the title with `setTitle()`.
 * Position a window with its `x` and `y` attributes (in px).
 * TODO: add support for resizing windows
 */
import windowCss from '../css/components/window.css?inline'
import htmlTemplate from './appwindow.html.js'
import './app-icon.js'
import storage from './storage.js'
import Config from './config.js'
import { stylesheet } from './helpers.js'
import { controls } from './styles.js'

const windowSheet = stylesheet(windowCss)

// open windows in stacking order, top-most last
const stack = []

export default class AppWindow extends HTMLElement {
  static observedAttributes = ['x', 'y']

  #x = 0
  #y = 0
  #initialized = false
  #drag = null // { pointerId, offsetX, offsetY } while being dragged
  #titleElem
  #dragHandle

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.adoptedStyleSheets = [controls, windowSheet]
    this.shadowRoot.append(htmlTemplate.content.cloneNode(true))

    this._contentElem = this.shadowRoot.querySelector('.content')
    this._iconElem = this.shadowRoot.querySelector('.icon app-icon')
    this._iconElem.setAttribute('img', this.localName)
    this.#titleElem = this.shadowRoot.querySelector('.title h3')
    this.#dragHandle = this.shadowRoot.querySelector('.title')

    this.addEventListener('pointerdown', () => this.#focus())
    this.shadowRoot
      .querySelector('.close')
      .addEventListener('click', () => this.destroy())
    this.#setupDragEvents()
  }

  /**
   * Set the title of the window
   * @param {string} title
   */
  setTitle(title) {
    this.#titleElem.textContent = title
  }

  /**
   * Add styles for a subclass's content
   * @param {CSSStyleSheet} sheet
   */
  _addStyles(sheet) {
    this.shadowRoot.adoptedStyleSheets = [
      ...this.shadowRoot.adoptedStyleSheets,
      sheet
    ]
  }

  /**
   * Move the window
   * @param {number} x - px from the left of the page
   * @param {number} y - px from the top of the page
   */
  moveTo(x, y) {
    this.#x = x
    this.#y = y
    this.style.left = `${x}px`
    this.style.top = `${y}px`
  }

  /**
   * Remove the window, with an animation
   */
  destroy() {
    this.classList.add('zoomOut')
    setTimeout(() => this.remove(), Config.animationDuration)
  }

  /**
   * Set up the window when it is added to the page.
   * Custom elements (v1) must not gain attributes in their constructor, so
   * everything touching the host's style, class or attributes happens here.
   */
  connectedCallback() {
    // only set up once, even if the element is moved around in the DOM
    if (this.#initialized) return
    this.#initialized = true

    // windows opened without a position start centered
    if (!this.style.left || !this.style.top) this.#center()
    // pull restored windows back on screen if needed
    this.moveTo(...this.#keepInView(this.offsetLeft, this.offsetTop))

    this.classList.add('zoomIn')
    this.#focus()
    this.#savePosition()
  }

  disconnectedCallback() {
    const index = stack.indexOf(this)
    if (index !== -1) stack.splice(index, 1)

    storage.remove(this.localName)
  }

  attributeChangedCallback(name, oldValue, value) {
    if (name === 'x') this.moveTo(Number(value), this.#y)
    if (name === 'y') this.moveTo(this.#x, Number(value))
  }

  #center() {
    this.moveTo(
      Math.round((window.innerWidth - this.offsetWidth) / 2),
      Math.round((window.innerHeight - this.offsetHeight) / 2)
    )
  }

  #savePosition() {
    storage.setJSON(this.localName, { x: this.#x, y: this.#y })
  }

  /**
   * Raise the window to the top, keeping the order of the others, so windows
   * dragged at the same time all stay above the rest
   */
  #focus() {
    const index = stack.indexOf(this)
    if (index !== -1) stack.splice(index, 1)
    stack.push(this)

    stack.forEach((win, i) => {
      win.style.zIndex = 2 + i
      win.classList.toggle('focused', win === this)
    })
  }

  /**
   * Drag the window by its title bar. Pointer events give the mouse and
   * every finger their own pointerId, so several windows can be dragged at
   * the same time.
   */
  #setupDragEvents() {
    const handle = this.#dragHandle

    handle.addEventListener('pointerdown', (event) => {
      // one pointer per window: ignore extra fingers and non-primary buttons
      if (this.#drag || event.button !== 0) return

      this.#drag = {
        pointerId: event.pointerId,
        offsetX: event.clientX - this.offsetLeft,
        offsetY: event.clientY - this.offsetTop
      }
      // keep receiving this pointer's events even when it leaves the window
      handle.setPointerCapture(event.pointerId)
      this.classList.add('held')
      this.#grip(event)
    })

    handle.addEventListener('pointermove', (event) => {
      if (event.pointerId !== this.#drag?.pointerId) return

      const { offsetX, offsetY } = this.#drag
      this.moveTo(
        ...this.#keepInView(
          Math.round(event.clientX - offsetX),
          Math.round(event.clientY - offsetY)
        )
      )
      this.#grip(event)
    })

    const dragEnd = (event) => {
      if (event.pointerId !== this.#drag?.pointerId) return

      this.#drag = null
      this.classList.remove('held')
      this.#savePosition()
    }
    handle.addEventListener('pointerup', dragEnd)
    handle.addEventListener('pointercancel', dragEnd)
  }

  /**
   * Where the window is held, for the grip light (see window.css)
   * @param {PointerEvent} event
   */
  #grip(event) {
    this.style.setProperty('--grip-x', `${event.clientX - this.offsetLeft}px`)
    this.style.setProperty('--grip-y', `${event.clientY - this.offsetTop}px`)
  }

  /**
   * Limit a window position so part of the title bar stays on screen and the
   * window can always be grabbed again (e.g. a position saved on a bigger screen)
   * @param {number} x
   * @param {number} y
   * @returns {number[]} [x, y]
   */
  #keepInView(x, y) {
    const visible = 140 // px of the window kept on screen horizontally
    const minX = visible - this.offsetWidth
    const maxX = window.innerWidth - visible
    const maxY = window.innerHeight - 120 // keep the title bar above the dock

    return [Math.max(minX, Math.min(x, maxX)), Math.max(0, Math.min(y, maxY))]
  }
}

// register element
customElements.define('app-window', AppWindow)
