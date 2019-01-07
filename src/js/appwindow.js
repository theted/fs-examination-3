/**
 * Window manager module
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
          margin: 0;
          padding: 0;
          width: auto;
          min-width: 200px;
          max-width: 600px;
          max-width: 25%;
          height: auto;
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

    // attatch shadow DOM & append template
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    // setup sub-elements
    this._titleElem = this.shadowRoot.querySelector('.title')
    this._contentElem = this.shadowRoot.querySelector('.content')

    // set initial text content for elements
    this._titleElem.textContent = 'Title goes here'
    this._contentElem.textContent = 'Content goes here'
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
