import { template } from './helpers.js'

export default template(/* html */ `
  <section class="score-elem">
    <h3>Remaining pairs: <span id="score"></span></h3>
    <h3>Fail guesses: <span id="fails"></span></h3>
    <h3>Accuracy: <span id="accur"></span></h3>
  </section>
  <section class="tiles"></section>
`)
