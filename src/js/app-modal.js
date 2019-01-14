import htmlTemplate from './app-modal.html.js'
import cssTemplate from './app-modal.css.js'

/**
 * Modal module
 */
export default class AppMoadal extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(htmlTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))

    this._titleElem = this.shadowRoot.querySelector('h2')
    this._contentElem = this.shadowRoot.querySelector('p')
    this._inputElem = this.shadowRoot.querySelector('input')
    this._buttonElem = this.shadowRoot.querySelector('button')

    this._buttonElem.addEventListener('click', (event) => this.submit(), false)

    this._inputElem.addEventListener('keyup', event => {
      if (event.key === 'Enter') { this.submit() }
    })
  }

  /**
   * Handling of modal form submittion, including dispatching of `modal-update` event
   */
  submit () {
    let val = this._inputElem.value.trim()

    // prevent submission of empty values
    if (val.length < 1) return false

    // dispatch an `modal-update event which other modules may listen to
    document.body.dispatchEvent(new CustomEvent('modal-update', {
      bubbles: true,
      detail: {
        text: val
      }
    }))

    // remove the element
    this.remove()
  }

  /**
   * Set title of modal window
   * @param {String} title
   */
  setTitle (title) {
    this._titleElem.textContent = title
  }

  /**
   * Set content of modal window
   * @param {String} content
   */
  setContent (content) {
    this._contentElem.textContent = content
  }

  /**
   * Set placeholder of modal window
   * @param {String} placeholder
   */
  setPlaceholder (placeholder) {
    this._inputElem.placeholder = placeholder
  }

  static get observedAttributes () {
    return ['title', 'content', 'placeholder']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    switch (name) {
      case 'title': this.setTitle(newValue); break
      case 'content': this.setContent(newValue); break
      case 'placeholder': this.setPlaceholder(newValue); break
    }
  }
}

// register element
window.customElements.define('app-modal', AppMoadal)
