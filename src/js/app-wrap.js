/**
 * main app wrapper
 * TODO: read and set configs on initialization
 * TODO: remember open windows & positions
 */
import './app-icons.js'

export default class AppWrap extends window.HTMLElement {
  constructor () {
    super()
    const template = document.createElement('template')
    template.innerHTML = /* html */ `
      <h1 id="logo">Personal desktop</h1>
      <app-icons></app-icons>
    `
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

// register element
window.customElements.define('app-wrap', AppWrap)
