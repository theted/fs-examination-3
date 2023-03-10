const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>
    :host {
      max-width: 440px !important;
      width: auto;
    }

    :host .tiles {
      padding: 10px;
      display: grid;
      grid-gap: 10px;
      grid-template-columns: repeat(4, 1fr);
    }

    :host .tiles img {
      width: auto;
      height: auto;
      max-width: 100%;
      transition: box-shadow 500ms;
    }

    :host .success {
      box-shadow: 0px 0px 20px green;
    }

    :host .failure {
      box-shadow: 0px 0px 20px red;
    }

  </style>
`

export default template
