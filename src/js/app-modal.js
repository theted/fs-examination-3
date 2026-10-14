/**
 * Modal prompt
 *
 *   const username = await AppModal.prompt({
 *     content: 'Please provide an username',
 *     placeholder: 'username'
 *   })
 *   // -> the entered text, or null if the modal was dismissed
 *   //    (Escape, or a click outside the dialog)
 *
 * Options: title, content, and the input's placeholder, value, type, min, max
 */
import htmlTemplate from './app-modal.html.js'
import cssTemplate from './app-modal.css.js'

export default class AppModal extends HTMLElement {
  static observedAttributes = [
    'title',
    'content',
    'placeholder',
    'value',
    'type',
    'min',
    'max'
  ]

  #resolve
  #titleElem
  #contentElem
  #input

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.append(
      htmlTemplate.content.cloneNode(true),
      cssTemplate.content.cloneNode(true)
    )

    this.#titleElem = this.shadowRoot.querySelector('h2')
    this.#contentElem = this.shadowRoot.querySelector('p')
    this.#input = this.shadowRoot.querySelector('input')

    this.shadowRoot
      .querySelector('button')
      .addEventListener('click', () => this.submit())

    this.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') this.submit()
      if (event.key === 'Escape') this.dismiss()
    })

    // a click on the backdrop, outside the dialog, dismisses the modal
    this.addEventListener('click', (event) => {
      if (event.target === this) this.dismiss()
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
    // focus the input once the modal is in the document
    this.#input.focus()
  }

  /**
   * Close the modal with the entered text (empty answers are not accepted)
   */
  submit() {
    const value = this.#input.value.trim()
    if (value) this.#close(value)
  }

  /**
   * Close the modal without an answer
   */
  dismiss() {
    this.#close(null)
  }

  #close(value) {
    this.remove()
    this.#resolve?.(value)
  }

  attributeChangedCallback(name, oldValue, value) {
    if (name === 'title') this.#titleElem.textContent = value
    else if (name === 'content') this.#contentElem.textContent = value
    // the rest are properties of the input: placeholder, value, type, min, max
    else this.#input[name] = value
  }
}

// register element
customElements.define('app-modal', AppModal)
