const template = document.createElement('template')
template.innerHTML = /* html */ `
  <section class="chat-messages"></section>
  <div class="chat-controls">
    <input type="text" name="message" id="message" placeholder="Message">
    <button class="submit">Send</button>
  </div>
`

export default template
