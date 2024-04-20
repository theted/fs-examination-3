/**
 * Main app wrapper - global component responsible for application initialization
 * and wrapping of sub-modules.
 */
import './app-icons.js'
import * as _ from './helpers.js'
import Storage from './storage.js'
import Config from './config.js'
const storage = new Storage()

export default class AppWrap extends window.HTMLElement {
  constructor() {
    super()
    const template = document.createElement('template')
    template.innerHTML = /* html */ `
      <app-icons></app-icons>
    `

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.init()
  }

  /**
   * Actions to perform when application starts
   */
  init() {
    // set theme
    let theme = storage.get('setting-theme') || Config.defaults.theme
    document.body.className = theme

    // set background image
    this.background =
      storage.get('settings-background') || Config.defaults.background
    _.setBackgroundImage(this.background, document.body)
  }
}

// register element
window.customElements.define('app-wrap', AppWrap)
