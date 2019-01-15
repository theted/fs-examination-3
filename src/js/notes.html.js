const template = document.createElement('template')
template.innerHTML = /* html */ `

  <div class="notes-content">
    <section id="notes-list"></section>
    <section id="notes-edit">
      <textarea name="note"></textarea>
      <button name="save">Save</button>
    </section>
    <section id="notes-controls" class="alt">
      <button name="new">New</button>
      <span class="state"></span>
    </section>
  </div>
`

export default template
