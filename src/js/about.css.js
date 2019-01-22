const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>

    :host, :host * {
      margin: 0;
      padding: 0;
    }

    :host {
      max-width: 400px;
    }

    :host p {
      margin: 1em 0;
    }

    :host a {
      text-decoration: none;
      color: #333;
      font-weight: bold;
    }

  </style>
`

export default template
