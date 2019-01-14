const template = document.createElement('template')
template.innerHTML = /* html */ `

  <div class="notes-content">
    <section id="notes-list"></section>
    <section id="noted-controls">
      <button name="new">New</button>
      <span class="state"></span>
    </section>
    <section id="notes-edit">
      <textarea name="note"></textarea>
      <button name="save">Save</button>
    </section>
  </div>
`

export default template
