const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>
    :host {
      background: #222;
      position: fixed;
      bottom: 0px;
      left: 0px;
      right: 0px;
    }

    :host ul {
      display: inline;
    }

    :host li {
      float: left;
      list-style: none;
      color: #fff;
      padding: 1.2em;
      border-right: 1px solid #eee;
    }

    :host a {
      color: #fff;
    }
  </style>
`

export default template
