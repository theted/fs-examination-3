import { template } from './helpers.js'

export default template(/* html */ `
  <div class="header">
    <div class="icon">
      <app-icon></app-icon>
    </div>
    <div class="title">
      <h3></h3>
    </div>
    <div class="close">
      <app-icon img="close" close="destroy"></app-icon>
    </div>
  </div>
  <div class="content"></div>
`)
