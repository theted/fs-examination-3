import cssTemplate from './app-icon.css.js'

export default class AppIcon extends window.HTMLElement {
  constructor () {
    super()
    let imgUrl = (this.hasAttribute('img')) ? this.getAttribute('img') : 'close'
    this.image = '/image/icons/' + imgUrl + '.png'

    const template = document.createElement('template')
    template.innerHTML = /* html */ `<img class="app-icon" src="${this.image}">`

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._imgElem = this.shadowRoot.querySelector('img')
  }

  setImage (img) {
    if (img[0] !== '/') img = '/image/icons/' + img + '.png'

    this.image = img
    this._imgElem.src = this.image
  }

  static get observedAttributes () {
    return ['img']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    switch (name) {
      case 'img': this.setImage(newValue); break
    }
  }
}

// register element
window.customElements.define('app-icon', AppIcon)
