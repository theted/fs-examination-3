import { template } from './helpers.js'

export default template(/* html */ `
  <header class="header">
    <div class="icon">
      <app-icon></app-icon>
    </div>
    <div class="title">
      <h3></h3>
    </div>
    <button class="close" type="button" aria-label="Close window">
      <app-icon img="close"></app-icon>
    </button>
  </header>
  <div class="content"></div>
`)
