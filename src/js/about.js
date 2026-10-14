/**
 * About module
 */
import AppWindow from './appwindow.js'
import htmlTemplate from './about.html.js'
import cssTemplate from './about.css.js'

export default class AboutApp extends AppWindow {
  constructor() {
    super()

    this._contentElem.append(
      cssTemplate.content.cloneNode(true),
      htmlTemplate.content.cloneNode(true)
    )
    this.setTitle('Personal web desktop!')
  }
}

// register element
customElements.define('about-app', AboutApp)
