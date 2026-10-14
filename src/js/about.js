/**
 * About module
 */
import aboutCss from '../css/components/about.css?inline'
import AppWindow from './appwindow.js'
import htmlTemplate from './about.html.js'
import { stylesheet } from './helpers.js'

const sheet = stylesheet(aboutCss)

export default class AboutApp extends AppWindow {
  constructor() {
    super()

    this._addStyles(sheet)
    this._contentElem.append(htmlTemplate.content.cloneNode(true))
    this.setTitle('Personal web desktop!')
  }
}

// register element
customElements.define('about-app', AboutApp)
