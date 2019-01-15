const template = document.createElement('template')
template.innerHTML = /* html */`

  <header id="tabs">
    <a href="#global">Global</a>
    <a href="#themes">Themes</a>
    <a href="#backgrounds">Backgrounds</a>
    <a href="#options">Options</a>
  </header>

  <section id="global">
    <h3>Global options</h3>
    <input name="username" value="username">
  </section>

  <section id="themes" class="theme">
    <h3>Theme</h3>
  </section>

  <section id="backgrounds" class="images">
    <h3>Background image</h3>
  </section>

  <section id="options">
    <h3>Options</h3>
  </section>

`

export default template
