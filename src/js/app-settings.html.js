const template = document.createElement('template')
template.innerHTML = /* html */`
  <section id="global-options">
    <h3>Global options</h3>
    <input name="username" value="username">
  </section>

  <section id="themes" class="theme">
    <h3>Theme</h3>
  </section>

  <section class="images">
    <h3>Background image</h3>
  </section>

`

export default template
