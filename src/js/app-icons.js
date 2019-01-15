/**
 * App icons / menu
 */
import cssTemplate from './app-icons.css.js'
import Config from './config.js'
import Storage from './storage.js'

const storage = new Storage()

export default class AppIcons extends window.HTMLElement {
  constructor () {
    super()
    const template = document.createElement('template')
    template.innerHTML = /* html */ `<ul id="app-icons"></ul>`
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._ul = this.shadowRoot.querySelector('ul')

    for (let link of Config.availableApps) {
      let child = this._ul.appendChild(document.createElement('li'))
      let linkElem = child.appendChild(document.createElement('a'))
      linkElem.innerHTML = '<img src="/image/icons/' + link + '-app.png"><span class="link-name">' + link + '</span>'
      linkElem.href = '#' + link
      linkElem.id = 'link-' + link

      linkElem.addEventListener('click', (event) => {
        event.preventDefault()
        let [x, y] = this.getNextPosition(link + '-app')
        this.createApp(link, x, y)
      })
    }

    // reopen previous open apps
    for (let app of Config.availableApps) {
      let prevPosition = storage.getJSON(app + '-app')
      if (prevPosition) { this.createApp(app, prevPosition.x, prevPosition.y) }
    }

    // listen and change on storage events ....
    storage.subscribe((data) => {
      if (data.key === 'settings-autoHide') {
        this.style.opacity = (data.value) ? 0 : 1
      }

      if (data.key === 'settings-spec' && data.value) {
        console.log('Test active!')
      }
    })
  }

  /**
   * Show/hide an app depending on if it previously exists or not
   * @param {string} App name
   * @param {HTMLElement[]} Previously existing app element(s)
   */
  toggle (link, prevElems) {
    if (!prevElems) prevElems = document.getElementsByTagName(link + '-app')

    if (prevElems.length) {
      prevElems[0].destroy()
    } else {
      this.createApp(link + '-app', x, y)
    }
  }

  /**
   * Create new app
   * @param {string} App name
   * @param {number} x
   * @param {number} y
   */
  createApp (app, x, y) {
    if (!x || !y) { [x, y] = this.getNextPosition(app + '-app') }
    let el = document.body.appendChild(document.createElement(app + '-app', false))
    this.setEl(el, x, y)
  }

  /**
   * Get starting position for `app`, taking into consideration number
   * of existing instances of element, adding offset as needed.
   * TODO: support for "bounce" if height exceeds window height
   * @param {string} App name
   */
  getNextPosition (app) {
    let offset = 50
    let start = 300
    let nums = document.getElementsByTagName(app).length
    let x = (offset * nums) + start
    return [x, x]
  }

  /**
   * Set element position
   * (required since this module does not extend AppWindow)
   */
  setEl (el, x, y) {
    el.style.top = x + 'px'
    el.style.left = y + 'px'
    el.setAttribute('x', x)
    el.setAttribute('y', y)
  }
}

// register element
window.customElements.define('app-icons', AppIcons)
