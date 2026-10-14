/**
 * Settings module: background, theme and options
 */
import settingsCss from '../css/components/settings.css?inline'
import AppWindow from './appwindow.js'
import storage from './storage.js'
import htmlTemplate from './app-settings.html.js'
import Config from './config.js'
import { addTemplate, setBackgroundImage, stylesheet } from './helpers.js'

const sheet = stylesheet(settingsCss)
const imgPath = '/image/backgrounds/'

/** e.g. 'dark' -> 'Dark' */
const label = (name) => name[0].toUpperCase() + name.slice(1)

export default class SettingsApp extends AppWindow {
  constructor() {
    super()

    this._addStyles(sheet)
    this._contentElem.append(htmlTemplate.content.cloneNode(true))

    this.setTitle('Settings')
    this.#setupBackgrounds()
    this.#setupThemes()
    this.#setupOptions()
    this.#setupTabs()
  }

  connectedCallback() {
    super.connectedCallback()
    this.#showSelected()
  }

  /**
   * Set and save the desktop background
   * @param {string} img - image path
   */
  setBackgroundImage(img) {
    setBackgroundImage(img, document.body)
    storage.set('settings-background', img)
    this.#showSelected()
  }

  /**
   * Set and save the theme
   * @param {string} theme
   */
  setTheme(theme) {
    document.documentElement.dataset.theme = theme
    storage.set('setting-theme', theme)
    this.#showSelected()
  }

  /**
   * Mark the current background and theme, and preview the themes on the
   * current background
   */
  #showSelected() {
    const background =
      storage.get('settings-background') || Config.defaults.background
    const theme = document.documentElement.dataset.theme

    // older versions saved the full URL
    const path = new URL(background, location.href).pathname
    for (const button of this.shadowRoot.querySelectorAll('.background')) {
      button.setAttribute('aria-pressed', button.dataset.src === path)
    }
    for (const button of this.shadowRoot.querySelectorAll('.theme')) {
      button.setAttribute('aria-pressed', button.dataset.theme === theme)
    }
    this.style.setProperty('--wallpaper', `url("${background}")`)
  }

  #setupTabs() {
    const tabs = this.shadowRoot.querySelectorAll('[role="tab"]')
    const show = (id) => {
      for (const tab of tabs) {
        tab.setAttribute('aria-selected', tab.dataset.tab === id)
      }
      for (const section of this.shadowRoot.querySelectorAll('section')) {
        section.classList.toggle('hidden', section.id !== id)
      }
    }

    for (const tab of tabs) {
      tab.addEventListener('click', () => show(tab.dataset.tab))
    }

    show('backgrounds')
  }

  #setupBackgrounds() {
    const images = this.shadowRoot.querySelector('#backgrounds')
    for (let i = 0; i < Config.numBackgroundImages; i++) {
      // store the path, not the absolute URL, so it survives a new host
      const src = `${imgPath}${i}.jpg`
      addTemplate(
        /* html */ `
          <button class="background" type="button" data-src="${src}">
            <img src="${src}" alt="Background ${i + 1}" loading="lazy">
          </button>
        `,
        images
      )
      images.lastElementChild.addEventListener('click', () =>
        this.setBackgroundImage(src)
      )
    }
  }

  #setupThemes() {
    const themes = this.shadowRoot.querySelector('#themes')
    for (const theme of Config.availableThemes) {
      addTemplate(
        /* html */ `
          <button class="theme" type="button" data-theme="${theme}">
            <span class="swatch"></span>
            ${label(theme)}
          </button>
        `,
        themes
      )
      themes.lastElementChild.addEventListener('click', () =>
        this.setTheme(theme)
      )
    }
  }

  #setupOptions() {
    const options = this.shadowRoot.querySelector('#options')
    for (const [option, text] of Object.entries(Config.availableOptions)) {
      const checked = storage.get(`settings-${option}`) === 'true'
      addTemplate(
        /* html */ `
          <label class="option">
            <input type="checkbox" role="switch" name="${option}" ${checked ? 'checked' : ''}>
            ${text}
          </label>
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
