/**
 * An icon: <app-icon img="close"> shows /image/icons/close.svg; an img
 * starting with "/" is used as the image URL as-is. The image is used as a
 * mask, so the icon takes the current text color.
 */
import iconCss from '../css/components/icon.css?inline'
import { stylesheet, template } from './helpers.js'

const sheet = stylesheet(iconCss)

export default class AppIcon extends HTMLElement {
  static observedAttributes = ['img']

  #glyph

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.adoptedStyleSheets = [sheet]
    this.shadowRoot.append(
      template(/* html */ `<span class="glyph"></span>`).content
    )
    this.#glyph = this.shadowRoot.querySelector('.glyph')
  }

  attributeChangedCallback(name, oldValue, img) {
    const url = img.startsWith('/') ? img : `/image/icons/${img}.svg`
    this.#glyph.style.setProperty('--icon', `url("${url}")`)
  }
}

// register element
customElements.define('app-icon', AppIcon)
