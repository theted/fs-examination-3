const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>

    :host {
      max-width: 520px;
    }

    :host .images {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: .5em;
    }

    :host .images img {
      width: 100%;
      object-fit: contain;
    }

    :host .images h3 {
      grid-column: 1 / -1;
    }

    :host #themes {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
    }

    :host #themes h3 {
      grid-column: 1 / -1;
    }

  </style>
`

export default template
