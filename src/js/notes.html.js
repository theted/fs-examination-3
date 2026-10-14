import { template } from './helpers.js'

export default template(/* html */ `
  <div class="notes-content">
    <section id="notes-list"></section>
    <section id="notes-edit">
      <input name="title" placeholder="Title" aria-label="Title">
      <textarea name="note" placeholder="Write something" aria-label="Note"></textarea>
    </section>
    <section id="notes-controls">
      <span class="status" role="status"></span>
      <button class="button" name="close" type="button">All notes</button>
      <button class="button primary" name="save" type="button">Save</button>
      <button class="button primary" name="new" type="button">New note</button>
    </section>
  </div>
`)
