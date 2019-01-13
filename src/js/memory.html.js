const template = document.createElement('template')
template.innerHTML = /* html */ `
  <section class="score-elem">
    <h3>Remaining pairs: <span id="score"></span></h3>
    <h3>Fail guesses: <span id="fails"></span></h3>
    <h3>Accurracy: <span id="accur"></span></h3>
  </section>
  <section class="tiles"></section>
`

export default template
