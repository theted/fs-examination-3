import { template } from './helpers.js'

export default template(/* html */ `
  <section class="chat-messages" aria-live="polite"></section>
  <section class="chat-controls">
    <textarea name="message" placeholder="Write a message" aria-label="Message" rows="1"></textarea>
    <button class="button primary" type="button">Send</button>
  </section>
`)
