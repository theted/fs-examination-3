import AppWindow from './appwindow.js'
import Storage from './storage.js'
import htmlTemplate from './app-settings.html.js'
import cssTemplate from './app-settings.css.js'
import Config from './config.js'
import * as _ from './helpers.js'
const storage = new Storage()

export default class SettingsApp extends AppWindow {
  constructor() {
    super()
    const _this = this

    this.imgPath = '/image/backgrounds/'

    this._contentElem.appendChild(cssTemplate.content.cloneNode(true))
    this._contentElem.appendChild(htmlTemplate.content.cloneNode(true))

    this._sections = this.shadowRoot.querySelectorAll('section')
    this._tabsLinks = this.shadowRoot.querySelectorAll('#tabs a')
    this._imagesElem = this.shadowRoot.querySelector('.images')
    this._themesList = this.shadowRoot.querySelector('#themes')
    this._optionsElem = this.shadowRoot.querySelector('#options')

    this.setTitle('Settings')
    this.setupBackgrounds()
    this.setupThemes()
    this.setupTabs()
    this.setupOptions()
  }

  /**
   * Setup tabs & click events
   * TODO: maybe move to parent AppWindow module?
   */
  setupTabs() {
    this._tabsLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault()
        let nAme = event.target.textContent.toLowerCase()
        this._sections.forEach((section) => {
          section.classList.add('hidden')

          if (section.id == nAme) {
            section.classList.remove('hidden')
          }
        })
      })
    })

    // initially hide all tabs
    this._sections.forEach((section) => {
      section.classList.add('hidden')
    })

    // start at backgrounds tabs
    this._tabsLinks[2].click()
  }

  /**
   * Create theme buttons & setup click events
   */
  setupThemes() {
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

  /**
   * Create background image elements and setup click events
   */
  setupBackgrounds() {
    // create image elements
    let htmlTemp = ''

    for (let i = 0; i < Config.numBackgroundImages; ++i) {
      htmlTemp += '<img src="' + this.imgPath + i + '.jpg' + '">'
    }

    _.addTemplate(htmlTemp, this._imagesElem)

    // setup click events for each imag
    let elements = this._contentElem.getElementsByTagName('img')
    for (let i = 0, len = elements.length; i < len; i++) {
      elements[i].addEventListener('click', (event) => {
        this.setBackgroundImage(event.target.src, document.body)
      })
    }
  }

  /**
   * Setup options
   */
  setupOptions() {
    for (let option in Config.availableOptions) {
      // TODO: use template?
      // TODO: set initial checked state based on existing config

      let templateHtml = /* html */ `
        <input type="checkbox" name="${option}">
        <label for="${option}">${Config.availableOptions[option]}</label>
        <br>
      `

      _.addTemplate(templateHtml, this._optionsElem)

      let optionElem = this._optionsElem.querySelector(
        'input[name="' + option + '"]'
      )

      // save & publish value when input is clicked
      optionElem.addEventListener('click', (event) => {
        storage.publish('settings-' + option, event.target.checked)
      })
    }
  }

  /**
   * Set background image
   * @param {String} img URL
   * @memberof SettingsApp
   */
  setBackgroundImage(img) {
    _.setBackgroundImage(img, document.body)
    storage.set('settings-background', img)
  }

  /**
   * Set application theme
   * @param {String} theme
   * @memberof SettingsApp
   */
  setTheme(theme) {
    document.body.className = theme
    storage.set('setting-theme', theme)
  }
}

window.customElements.define('settings-app', SettingsApp)
