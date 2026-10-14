/**
 * Settings module: background, theme and options
 */
import AppWindow from './appwindow.js'
import storage from './storage.js'
import htmlTemplate from './app-settings.html.js'
import cssTemplate from './app-settings.css.js'
import Config from './config.js'
import { addTemplate, addTo, setBackgroundImage } from './helpers.js'

const imgPath = '/image/backgrounds/'

export default class SettingsApp extends AppWindow {
  constructor() {
    super()

    this._contentElem.append(
      cssTemplate.content.cloneNode(true),
      htmlTemplate.content.cloneNode(true)
    )

    this.setTitle('Settings')
    this.#setupBackgrounds()
    this.#setupThemes()
    this.#setupOptions()
    this.#setupTabs()
  }

  /**
   * Set and save the desktop background
   * @param {string} img - image path
   */
  setBackgroundImage(img) {
    setBackgroundImage(img, document.body)
    storage.set('settings-background', img)
  }

  /**
   * Set and save the theme
   * @param {string} theme
   */
  setTheme(theme) {
    document.body.className = theme
    storage.set('setting-theme', theme)
  }

  #setupTabs() {
    const sections = this.shadowRoot.querySelectorAll('section')
    const show = (id) =>
      sections.forEach((section) =>
        section.classList.toggle('hidden', section.id !== id)
      )

    for (const link of this.shadowRoot.querySelectorAll('#tabs a')) {
      link.addEventListener('click', (event) => {
        event.preventDefault()
        show(link.hash.slice(1))
      })
    }

    show('backgrounds')
  }

  #setupThemes() {
    const list = this.shadowRoot.querySelector('#themes')
    for (const theme of Config.availableThemes) {
      addTo(list, 'p', theme).addEventListener('click', () =>
        this.setTheme(theme)
      )
    }
  }

  #setupBackgrounds() {
    const images = this.shadowRoot.querySelector('.images')
    for (let i = 0; i < Config.numBackgroundImages; i++) {
      // store the path, not the absolute URL, so it survives a new host
      const src = `${imgPath}${i}.jpg`
      const img = addTo(images, 'img')
      img.src = src
      img.alt = `Background ${i + 1}`
      img.addEventListener('click', () => this.setBackgroundImage(src))
    }
  }

  #setupOptions() {
    const options = this.shadowRoot.querySelector('#options')
    for (const [option, label] of Object.entries(Config.availableOptions)) {
      const checked = storage.get(`settings-${option}`) === 'true'
      addTemplate(
        /* html */ `
          <label>
            <input type="checkbox" name="${option}" ${checked ? 'checked' : ''}>
            ${label}
          </label>
          <br>
        `,
        options
      )

      // save & publish the value when it changes
      options
        .querySelector(`input[name="${option}"]`)
        .addEventListener('change', (event) =>
          storage.publish(`settings-${option}`, event.target.checked)
        )
    }
  }
}

// register element
customElements.define('settings-app', SettingsApp)
