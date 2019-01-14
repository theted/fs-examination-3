const template = document.createElement('template')
template.innerHTML = /* html */ `
  <section class="chat-messages"></section>
  <section class="chat-controls alt">
    <textarea type="text" name="message" id="message"></textarea>
    <button class="submit">Send</button>
  </section>
`

export default template
