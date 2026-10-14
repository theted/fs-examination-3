import { template } from './helpers.js'

export default template(/* html */ `
  <dialog>
    <form method="dialog">
      <h2></h2>
      <p></p>
      <input>
      <div class="actions">
        <button class="button cancel" type="button">Cancel</button>
        <button class="button primary" type="submit">OK</button>
      </div>
    </form>
  </dialog>
`)
