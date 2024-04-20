const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>
    :host {
      z-index: 1000;
      position: absolute;
      top: 0px;
      left: 0px;
      bottom: 0px;
      right: 0px;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host .modal-content {
      background: white;
      padding: 2em;
      border-radius: 12px;
      color: #555;
    }

  </style>
`

export default template
