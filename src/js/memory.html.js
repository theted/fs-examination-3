import { template } from './helpers.js'

export default template(/* html */ `
  <section class="score-elem">
    <p class="stat">
      <span class="label">Pairs left</span>
      <span class="value" id="score"></span>
    </p>
    <p class="stat">
      <span class="label">Misses</span>
      <span class="value" id="fails"></span>
    </p>
    <p class="stat">
      <span class="label">Accuracy</span>
      <span class="value" id="accur"></span>
    </p>
    <button class="button new-game" type="button">New game</button>
  </section>
  <section class="tiles" aria-label="Tiles"></section>
`)
