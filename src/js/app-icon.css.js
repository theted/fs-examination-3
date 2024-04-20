const template = document.createElement('template')
template.innerHTML = /* html */ `

  <style>

    :host img {
      max-width: 18px;
      width: auto;
      height: auto;
    }

    /**
      * Minimal theme
      */

    :host-context(.minimal) img {
      filter: invert(100%);
    }

  </style>

`

export default template
