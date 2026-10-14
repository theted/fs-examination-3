/**
 * Modal prompt
 *
 *   const username = await AppModal.prompt({
 *     content: 'Pick a username for the chat',
 *     placeholder: 'username',
 *     action: 'Save'
 *   })
 *   // -> the entered text, or null if the modal was dismissed
 *   //    (Cancel, Escape, or a click outside the dialog)
 *
 * Options: title, content, action (the button label), and the input's
 * placeholder, value, type, min and max
 */
import modalCss from '../css/components/modal.css?inline'
import htmlTemplate from './app-modal.html.js'
import { stylesheet } from './helpers.js'
import { controls } from './styles.js'

const sheet = stylesheet(modalCss)

export default class AppModal extends HTMLElement {
  static observedAttributes = [
    'title',
    'content',
    'action',
    'placeholder',
    'value',
    'type',
    'min',
    'max'
  ]

  #resolve
  #dialog
  #titleElem
  #contentElem
  #input
  #submitButton

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.adoptedStyleSheets = [controls, sheet]
    this.shadowRoot.append(htmlTemplate.content.cloneNode(true))

    this.#dialog = this.shadowRoot.querySelector('dialog')
    this.#titleElem = this.shadowRoot.querySelector('h2')
    this.#contentElem = this.shadowRoot.querySelector('p')
    this.#input = this.shadowRoot.querySelector('input')
    this.#submitButton = this.shadowRoot.querySelector('[type="submit"]')

    // Enter in the input submits the form
    this.shadowRoot
      .querySelector('form')
      .addEventListener('submit', (event) => {
        event.preventDefault()
        this.submit()
      })
    this.shadowRoot
      .querySelector('.cancel')
      .addEventListener('click', () => this.dismiss())

    // Escape
    this.#dialog.addEventListener('cancel', (event) => {
      event.preventDefault()
      this.dismiss()
    })

    // a click on the backdrop, outside the dialog
    this.#dialog.addEventListener('click', (event) => {
      if (event.target === this.#dialog) this.dismiss()
    })
  }

  /**
   * Show a modal and wait for the user's answer
   * @param {Object} options - attributes to set, e.g. { content, placeholder }
   * @returns {Promise<string|null>} the entered text, or null if dismissed
   */
  static prompt(options = {}) {
    const modal = document.createElement('app-modal')
    for (const [name, value] of Object.entries(options)) {
      modal.setAttribute(name, value)
    }

    return new Promise((resolve) => {
      modal.#resolve = resolve
      document.body.append(modal)
    })
  }

  connectedCallback() {
    this.#dialog.showModal()
    this.#input.focus()
  }

  /**
   * Close the modal with the entered text (empty answers are not accepted)
   */
  submit() {
    const value = this.#input.value.trim()
    if (value) this.#close(value)
    else this.#input.focus()
  }

  /**
   * Close the modal without an answer
   */
  dismiss() {
    this.#close(null)
  }

  #close(value) {
    this.#dialog.close()
    this.remove()
    this.#resolve?.(value)
  }

  attributeChangedCallback(name, oldValue, value) {
    if (name === 'title') this.#titleElem.textContent = value
    else if (name === 'content') this.#contentElem.textContent = value
    else if (name === 'action') this.#submitButton.textContent = value
    // the rest are properties of the input: placeholder, value, type, min, max
    else this.#input[name] = value
  }
}

// register element
customElements.define('app-modal', AppModal)
