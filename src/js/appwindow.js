/**
 * Window manager module
 *
 * TODO: handle initial values for title & content
 * TODO: add support for any type of main content
 * TODO: add support for resizing windows
 * TODO: place new windows at center of screen
 * TODO: add support for moving windows
 * TODO: add support for focus / handle z-index as correctly
 * TODO: add support for closing windows
 */
export default class AppWindow extends window.HTMLElement {
  constructor () {
    super()

    // define element template
    // TODO: split to external HTML / CSS files
    const template = document.createElement('template')
    template.innerHTML = /* html */`
      <style>
        :host {
          display: block;
          position: absolute;
          margin: 0;
          padding: 0;
          border: 1px solid #d3d3d3;
          box-shadow: 0px 0px 25px rgba( 20, 20, 20, 0.15 );
        }

        :host .title {
          background: #212121;
          border-bottom: 1px solid #d3d3d3;
          color: #eee;
          padding: .6em;
        }

        :host .content {
          background: #f9f9f9;
          padding: 1.2em;
        }
      </style>

      <div class="title"></div>
      <div class="content"></div>
    `

    // setup default properties
    this.x = 0
    this.y = 0
    this.focus = false

    // set windows dimensions
    this.width = 300
    this.height = 160 // TODO: auto-calc height

    // attatch shadow DOM & append template
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    // setup sub-elements
    this._titleElem = this.shadowRoot.querySelector('.title')
    this._contentElem = this.shadowRoot.querySelector('.content')

    // set initial text content for elements
    this._titleElem.textContent = 'Title goes here'
    this._contentElem.textContent = 'Content goes here'

    // set initial window dimensions
    this.style.width = this.width + 'px'
    this.style.height = this.height + 'px'

    // place window at center of screen
    this.x = (window.innerWidth / 2) - (this.width / 2)
    this.y = (window.innerHeight / 2) - (this.height / 2)
    this.style.left = this.x + 'px'
    this.style.top = this.y + 'px'
  }

  connectedCallback () {
    console.log('Creating new window')
  }

  disconnectedCallback () {
    console.log('Destroying window')
  }
}

// register element
window.customElements.define('app-window', AppWindow)
