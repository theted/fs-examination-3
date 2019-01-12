const template = document.createElement('template')
template.innerHTML = /* html */`
  <style>
    :host .images {
      display: flex;
      flex-wrap: wrap;
    }

    :host .images img {
      flex-basis: 20%;
      height: auto;
      max-height: 160px;
      flex-grow: 1;
    }
  </style>

  <h2>Settings</h2>

  <div>
    <input name="username" value="username">
  </div>

  <div class="theme">
    <h4>Theme</h4>
    <p><span>dark</span> <span>light</span></p>
  </div>

  <div class="images"></div>

`

export default template
