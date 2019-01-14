const template = document.createElement('template')
template.innerHTML = /* html */ `

  <style>
    :host textarea {
      width: calc(100% - 2em - 2px);
      min-height: 140px;
      padding: 1em;
      border: 1px solid #d0d0d0;
    }

    :host button {
      margin: 1em;
      float: right;
    }

    :host span.state {
      margin: 1em;
      float: left
    }
  </style>

`

export default template
