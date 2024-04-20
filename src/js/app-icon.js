import cssTemplate from './app-icon.css.js'

export default class AppIcon extends window.HTMLElement {
  constructor() {
    super()
    let imgUrl = this.hasAttribute('img') ? this.getAttribute('img') : 'close'
    this.image = '/image/icons/' + imgUrl + '.png'
    this.state = false

    const template = document.createElement('template')
    template.innerHTML = /* html */ `<img class="app-icon" src="${this.image}">`

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._imgElem = this.shadowRoot.querySelector('img')
    this._imgElem.addEventListener('click', (event) => this.click(event))
  }

  setImage(img) {
    if (img[0] !== '/') img = '/image/icons/' + img + '.png'

    this.image = img
    this._imgElem.src = this.image
  }

  click() {
    this.state = !this.state
    console.log('Clicked icon!', this.state)

    // dispatch event that we can listen to
    document.body.dispatchEvent(
      new CustomEvent('click-icon', {
        bubbles: true,
        detail: {
          text: 'Hello'
        }
      })
    )
  }

  static get observedAttributes() {
    return ['img']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'img':
        this.setImage(newValue)
        break
    }
  }
}

// register element
window.customElements.define('app-icon', AppIcon)
