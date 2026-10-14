import htmlTemplate from './app-modal.html.js'
import cssTemplate from './app-modal.css.js'

/**
 * Modal prompt
 *
 *   // USAGE:
 *   /////////////////////////////////////////////////////////////////////////
 *
 *   const username = await AppModal.prompt({
 *     content: 'Please provide an username',
 *     placeholder: 'username'
 *   })
 *   // -> the entered text, or null if the modal was dismissed
 *   //    (Escape, or a click outside the dialog)
 *
 *   Supported options: title, content, placeholder, value, type, min, max
 */
export default class AppModal extends window.HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(htmlTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))

    this._titleElem = this.shadowRoot.querySelector('h2')
    this._contentElem = this.shadowRoot.querySelector('p')
    this._inputElem = this.shadowRoot.querySelector('input')
    this._buttonElem = this.shadowRoot.querySelector('button')

    this._buttonElem.addEventListener('click', () => this.submit())

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
   * @returns {Promise<String|null>} the entered text, or null if dismissed
   */
  static prompt(options = {}) {
    const modal = document.createElement('app-modal')
    for (const [name, value] of Object.entries(options)) {
      modal.setAttribute(name, value)
    }

    return new Promise((resolve) => {
      modal._resolve = resolve
      document.body.appendChild(modal)
    })
  }

  connectedCallback() {
    // focus the input once the modal is in the document
    this._inputElem.focus()
  }

  /**
   * Close the modal with the entered value (empty values are not accepted)
   */
  submit() {
    let val = this._inputElem.value.trim()

    // prevent submission of empty values
    if (val.length < 1) return false

    this._close(val)
  }

  /**
   * Close the modal without a value
   */
  dismiss() {
    this._close(null)
  }

  _close(value) {
    this.remove()
    this._resolve?.(value)
  }

  /**
   * Set title of modal window
   * @param {String} title
   */
  setTitle(title) {
    this._titleElem.textContent = title
  }

  /**
   * Set content of modal window
   * @param {String} content
   */
  setContent(content) {
    this._contentElem.textContent = content
  }

  /**
   * Set placeholder of modal window
   * @param {String} placeholder
   */
  setPlaceholder(placeholder) {
    this._inputElem.placeholder = placeholder
  }

  /**
   * Set placeholder of modal window
   * @param {String} placeholder
   */
  setValue(value) {
    this._inputElem.value = value
  }

  /**
   * Set placeholder of modal window
   * @param {String} placeholder
   */
  setType(type) {
    this._inputElem.type = type
  }

  /**
   * Set placeholder of modal window
   * @param {String} placeholder
   */
  setMax(max) {
    this._inputElem.max = max
  }

  /**
   * Set minimum value of the input
   * @param {String} min
   */
  setMin(min) {
    this._inputElem.min = min
  }

  static get observedAttributes() {
    return ['title', 'content', 'placeholder', 'value', 'type', 'min', 'max']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'title':
        this.setTitle(newValue)
        break
      case 'content':
        this.setContent(newValue)
        break
      case 'placeholder':
        this.setPlaceholder(newValue)
        break
      case 'value':
        this.setValue(newValue)
        break
      case 'type':
        this.setType(newValue)
        break
      case 'min':
        this.setMin(newValue)
        break
      case 'max':
        this.setMax(newValue)
        break
    }
  }
}

// register element
window.customElements.define('app-modal', AppModal)
