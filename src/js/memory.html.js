const template = document.createElement('template')
template.innerHTML = /* html */ `
  <div class="score-elem">
    <h3>Remaining pairs: <span id="score"></span></h3>
    <h3>Fail guesses: <span id="fails"></span></h3>
    <h3>Accurracy: <span id="accur"></span></h3>
  </div>
  <div class="tiles"></div>
`

export default template
