/**
 * The dock: a link per app, which opens a new window of it, with a dot for
 * apps that have open windows. Also reopens the windows that were open last
 * time.
 */
import dockCss from '../css/components/dock.css?inline'
import './app-icon.js'
import Config from './config.js'
import storage from './storage.js'
import { addTemplate, stylesheet } from './helpers.js'

const sheet = stylesheet(dockCss)

/** Display name of an app, e.g. 'memory' -> 'Memory' */
const appName = (app) => app[0].toUpperCase() + app.slice(1)

export default class AppIcons extends HTMLElement {
  #observer = null

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.adoptedStyleSheets = [sheet]
    const list = this.shadowRoot.appendChild(document.createElement('ul'))
    list.id = 'app-icons'

    // show the about window on the very first start
    if (!storage.get('first-start')) {
      storage.setJSON('about-app', { x: 200, y: 200 })
      storage.set('first-start', true)
    }

    for (const app of Config.availableApps) {
      addTemplate(
        /* html */ `
          <li>
            <a href="#${app}" id="link-${app}">
              <app-icon img="${app}-app"></app-icon>
              <span class="link-name">${appName(app)}</span>
            </a>
          </li>
        `,
        list
      )
      list.querySelector(`#link-${app}`).addEventListener('click', (event) => {
        event.preventDefault()
        this.createApp(app)
      })
    }

    // reopen the windows that were open last time
    for (const app of Config.availableApps) {
      const position = storage.getJSON(`${app}-app`)
      if (position) this.createApp(app, position.x, position.y)
    }

    storage.subscribe(({ key, value }) => {
      if (key === 'settings-autoHide') this.classList.toggle('auto-hide', value)
    })
  }

  connectedCallback() {
    // apply the saved auto-hide setting (not in the constructor: custom
    // elements must not gain attributes there)
    this.classList.toggle(
      'auto-hide',
      storage.get('settings-autoHide') === 'true'
    )

    // keep the open-window dots up to date
    this.#markOpenApps()
    this.#observer ??= new MutationObserver(() => this.#markOpenApps())
    this.#observer.observe(document.body, { childList: true })
  }

  disconnectedCallback() {
    this.#observer?.disconnect()
  }

  /**
   * Open a new window of an app
   * @param {string} app - e.g. 'memory'
   * @param {number} [x] - position; new windows of an app are offset
   * @param {number} [y]
   */
  createApp(app, x, y) {
    const tag = `${app}-app`
    if (x === undefined || y === undefined) [x, y] = this.#nextPosition(tag)

    // position the window before it is connected, so it does not start centered
    const win = document.createElement(tag)
    win.setAttribute('x', x)
    win.setAttribute('y', y)
    document.body.append(win)
  }

  /**
   * Mark the apps that have open windows
   */
  #markOpenApps() {
    for (const app of Config.availableApps) {
      const open = document.getElementsByTagName(`${app}-app`).length
      const link = this.shadowRoot.querySelector(`#link-${app}`)
      link.toggleAttribute('data-open', open > 0)
      link.title = open ? `${appName(app)}: ${open} open` : appName(app)
    }
  }

  /**
   * Starting position for a new window, offset by the number of open windows
   * of the same app
   * @param {string} tag - window element name
   * @returns {number[]} [x, y]
   */
  #nextPosition(tag) {
    const start = 300
    const offset = 50
    const position = start + offset * document.getElementsByTagName(tag).length
    return [position, position]
  }
}

// register element
customElements.define('app-icons', AppIcons)
