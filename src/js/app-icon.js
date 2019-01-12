export default class AppIcon extends window.HTMLElement {
  constructor () {
    super()
    let imgUrl = (this.hasAttribute('img')) ? this.getAttribute('img') : 'close'
    this.image = '/image/icons/' + imgUrl + '.png'

    const template = document.createElement('template')
    const style = document.createElement('style')

    template.innerHTML = /* html */ `<img class="app-icon" src="${this.image}">`
    style.textContent = /* css */ `:host img { max-width: 18px; width: auto; height: auto; }`

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(style)
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

// register element
window.customElements.define('app-icon', AppIcon)
