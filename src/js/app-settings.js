import AppWindow from './appwindow.js'
import Storage from './storage.js'
import htmlTemplate from './app-settings.html.js'
import Config from './config.js'
import * as _ from './helpers.js'
const storage = new Storage()

export default class SettingsApp extends AppWindow {
  constructor () {
    super()
    const _this = this

    this._contentElem.appendChild(htmlTemplate.content.cloneNode(true))
    this._imagesElem = this.shadowRoot.querySelector('.images')
    this.setTitle('Settings')
    this.imgList = Config.backgroundImages

    // setup images
    let htmlTemp = ''
    for (let img of this.imgList) { htmlTemp += '<img src="' + img + '" width="50">' }
    _.addTemplate(htmlTemp, this._imagesElem)

    // setup click events for each imag
    var elements = this._contentElem.getElementsByTagName('img')
    for (var i = 0, len = elements.length; i < len; i++) {
      elements[i].onclick = function () {
        _this.setBackgroundImage(this.src, document.body)
      }
    }
  }

  // TODO: remove duplication
  setBackgroundImage (img) {
    _.setBackgroundImage(img, document.body)
    storage.set('settings-background', img)
  }
}

window.customElements.define('settings-app', SettingsApp)
