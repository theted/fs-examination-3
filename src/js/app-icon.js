/**
 * An icon: <app-icon img="close"> shows /image/icons/close.png; an img
 * starting with "/" is used as the image URL as-is
 */
import cssTemplate from './app-icon.css.js'
import { template } from './helpers.js'

export default class AppIcon extends HTMLElement {
  static observedAttributes = ['img']

  #img

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.append(
      cssTemplate.content.cloneNode(true),
      template(/* html */ `<img class="app-icon" alt="">`).content
    )
    this.#img = this.shadowRoot.querySelector('img')
  }

  attributeChangedCallback(name, oldValue, img) {
    this.#img.src = img.startsWith('/') ? img : `/image/icons/${img}.png`
  }
}

// register element
customElements.define('app-icon', AppIcon)
