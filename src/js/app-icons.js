/**
 * App icons / menu
 */
import cssTemplate from './app-icons.css.js'

// build list of links
let links = [
  'memory',
  'chat',
  'notes',
  'settings'
]

let openApps = [
  'chat'
]

export default class AppIcons extends window.HTMLElement {
  constructor () {
    super()
    const template = document.createElement('template')
    template.innerHTML = /* html */ `<ul id="app-icons"></ul>`
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._ul = this.shadowRoot.querySelector('ul')

    for (let link of links) {
      let child = this._ul.appendChild(document.createElement('li'))
      let linkElem = child.appendChild(document.createElement('a'))
      linkElem.textContent = link
      linkElem.href = '#' + link
      linkElem.id = 'link-' + link

      linkElem.addEventListener('click', (event) => {
        event.preventDefault()
        this.toggle(link)
      })
    }

    // reopen previous open apps
    for (let app of openApps) {
      this.toggle(app)
    }
  }

  toggle (link) {
    let prevElems = document.getElementsByTagName(link + '-app')

    if (prevElems.length) {
      prevElems[0].remove()
    } else {
      document.body.appendChild(document.createElement(link + '-app', false))
    }
  }
}

// register element
window.customElements.define('app-icons', AppIcons)
