import AppWindow from './appwindow.js'
import Storage from './storage.js'
import htmlTemplate from './app-settings.html.js'
import cssTemplate from './app-settings.css.js'
import Config from './config.js'
import * as _ from './helpers.js'
const storage = new Storage()

export default class SettingsApp extends AppWindow {
  constructor () {
    super()
    const _this = this

    this.imgPath = '/image/backgrounds/'

    this._contentElem.appendChild(cssTemplate.content.cloneNode(true))
    this._contentElem.appendChild(htmlTemplate.content.cloneNode(true))

    this._imagesElem = this.shadowRoot.querySelector('.images')
    this._themesList = this.shadowRoot.querySelector('#themes')

    this.setTitle('Settings')

    // setup images
    let htmlTemp = ''

    for (let i = 0; i < Config.numBackgroundImages; ++i) {
      htmlTemp += '<img src="' + this.imgPath + i + '.jpg' + '">'
    }

    _.addTemplate(htmlTemp, this._imagesElem)

    // setup click events for each imag
    let elements = this._contentElem.getElementsByTagName('img')
    for (let i = 0, len = elements.length; i < len; i++) {
      elements[i].onclick = function () {
        _this.setBackgroundImage(this.src, document.body)
      }
    }

    // setup themes
    Config.availableThemes.forEach((theme) => {
      let themeElem = document.createElement('p')
      themeElem.textContent = theme
      themeElem.addEventListener('click', (event) => {
        this.setTheme(event.target.textContent)
      })
      this._themesList.appendChild(themeElem)
    })
  }

  // TODO: remove duplication
  setBackgroundImage (img) {
    _.setBackgroundImage(img, document.body)
    storage.set('settings-background', img)
  }

  setTheme (theme) {
    document.body.className = theme
  }
}

window.customElements.define('settings-app', SettingsApp)
