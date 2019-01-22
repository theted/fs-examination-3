import AppWindow from './appwindow.js'
import htmlTemplate from './about.html.js'
import cssTemplate from './about.css.js'

/**
 * About
 * @export
 * @class AboutApp
 * @extends {window.HTMLElement}
 */
export default class AboutApp extends AppWindow {
  constructor() {
    super()
    this._contentElem.appendChild(cssTemplate.content.cloneNode(true))
    this._contentElem.appendChild(htmlTemplate.content.cloneNode(true))
    this.setTitle('Personal web desktop!')
  }
}

// register element
window.customElements.define('about-app', AboutApp)
