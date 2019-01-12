/**
 * main app wrapper
 * TODO: read and set configs on initialization
 * TODO: remember open windows & positions
 */
import './app-icons.js'
import * as _ from './helpers.js'
import Storage from './storage.js'
const storage = new Storage()

export default class AppWrap extends window.HTMLElement {
  constructor () {
    super()
    const template = document.createElement('template')
    template.innerHTML = /* html */ `
      <app-icons></app-icons>
    `

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.background = storage.get('settings-background')
    if (this.background) { _.setBackgroundImage(this.background, document.body) }
  }
}

// register element
window.customElements.define('app-wrap', AppWrap)
