const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>

    :host {
      max-width: 520px;
    }

    :host header {
      display: flex;
      justify-content: space-around;
      background: linear-gradient(#e9e9e9, #fafafa);
      border-bottom: 1px solid rgba(222, 222, 222, 0.3);
    }

    :host header a {
      padding: 1em;
      color: #333;
      text-decoration: none;
      border-right: 1px solid rgba(222, 222, 222, 0.2);
    }

    :host section#backgrounds {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 1em;
    }

    :host .images img {
      width: 100%;
      object-fit: cover;
      height: max-content;
      max-height: 120px;
    }

    :host .images h3 {
      grid-column: 1 / -1;
    }

    :host section#themes {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
    }

    :host #themes h3 {
      grid-column: 1 / -1;
    }

    :host .hidden {
      display: none !important;
    }

  </style>
`

export default template
