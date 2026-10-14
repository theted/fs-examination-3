import { template } from './helpers.js'

export default template(/* html */ `
  <section class="chat-messages list"></section>
  <section class="chat-controls alt">
    <textarea type="text" name="message" id="message"></textarea>
    <button class="submit">Send</button>
  </section>
`)
