const template = document.createElement('template')
template.innerHTML = /* html */ `

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
      <span class="state"></span>
    </section>
  </div>
`

export default template
