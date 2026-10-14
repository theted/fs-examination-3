import { template } from './helpers.js'

export default template(/* html */ `

  <div class="notes-content">
    <section id="notes-list"></section>
    <section id="notes-edit">
      <input name="title" placeholder="Title">
      <textarea name="note" placeholder="Content"></textarea>
    </section>
    <section id="notes-controls" class="alt">
      <button name="save">Save</button>
      <button name="new">New</button>
      <button name="close">Close</button>
    </section>
  </div>
`)
