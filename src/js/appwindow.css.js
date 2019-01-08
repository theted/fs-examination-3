const template = document.createElement('template')
template.innerHTML = /* html */`
  <style>
    :host {
      display: flex; /* block; */
      flex-direction: column;
      position: absolute;
      margin: 0;
      padding: 0;
      border: 1px solid #d3d3d3;
      box-shadow: 0px 0px 25px rgba( 20, 20, 20, 0.15 );
    }

    :host&:hover {
      background: lime;
    }

    :host&:hover content {
      background: lime;
    }

    :host .title {
      background: #212121;
      border-bottom: 1px solid #d3d3d3;
      color: #eee;
      padding: .6em;
    }

    :host .close {
      position: absolute;
      right: 0px;
      top: 0px;
      color: white;
      padding: 9px 14px;
      background: #333;
    }

    :host .content {
      background: #f9f9f9;
      flex: 1;
    }
  </style>
`

export default template
