import { template } from './helpers.js'

export default template(/* html */ `
  <nav id="tabs" role="tablist">
    <button type="button" role="tab" data-tab="backgrounds">Background</button>
    <button type="button" role="tab" data-tab="themes">Theme</button>
    <button type="button" role="tab" data-tab="options">Options</button>
  </nav>

  <section id="backgrounds" role="tabpanel" aria-label="Background"></section>
  <section id="themes" role="tabpanel" aria-label="Theme"></section>
  <section id="options" role="tabpanel" aria-label="Options"></section>
`)
