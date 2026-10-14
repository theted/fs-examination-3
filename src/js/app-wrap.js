/**
 * Main app wrapper - global component responsible for application initialization
 * and wrapping of sub-modules.
 */
import './app-icons.js'
import { setBackgroundImage, template } from './helpers.js'
import storage from './storage.js'
import Config from './config.js'

export default class AppWrap extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.append(
      template(/* html */ `<app-icons></app-icons>`).content
    )

    this.init()
  }

  /**
   * Apply the saved theme and background
   */
  init() {
    document.body.className =
      storage.get('setting-theme') || Config.defaults.theme
    setBackgroundImage(
      storage.get('settings-background') || Config.defaults.background,
      document.body
    )
  }
}

// register element
customElements.define('app-wrap', AppWrap)
