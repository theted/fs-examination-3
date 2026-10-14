/**
 * Memory game module
 */
import AppWindow from './appwindow.js'
import AppModal from './app-modal.js'
import cssTemplate from './memory.css.js'
import htmlTemplate from './memory.html.js'

const imgPath = '/image/memory/'
const hiddenTile = `${imgPath}0.png`
const maxPairs = 8
const revealTime = 1000 // ms a turned pair stays visible

/**
 * Randomize the order of an array, in place (Fisher-Yates)
 * @param {Array} array
 * @returns {Array} the same array
 */
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default class MemoryApp extends AppWindow {
  #pairs = maxPairs // pairs in a game
  #remaining = 0 // pairs left to find
  #attempts = 0
  #fails = 0
  #turned = [] // tiles turned in the current guess
  #locked = false // while a wrong pair is showing
  #tilesElem
  #scoreElem
  #failsElem
  #accuracyElem

  constructor() {
    super()

    this._contentElem.append(
      cssTemplate.content.cloneNode(true),
      htmlTemplate.content.cloneNode(true)
    )
    this.#tilesElem = this._contentElem.querySelector('.tiles')
    this.#scoreElem = this._contentElem.querySelector('#score')
    this.#failsElem = this._contentElem.querySelector('#fails')
    this.#accuracyElem = this._contentElem.querySelector('#accur')

    this.#tilesElem.addEventListener('click', (event) => {
      if (event.target.matches('img')) this.#turn(event.target)
    })

    // play with the keyboard: Enter or Space turns the focused tile
    this.#tilesElem.addEventListener('keydown', (event) => {
      if (
        (event.key === 'Enter' || event.key === ' ') &&
        event.target.matches('img')
      ) {
        event.preventDefault()
        this.#turn(event.target)
      }
    })

    // the window's own icon starts a new game
    this._iconElem.addEventListener('click', () => this.newGame())

    this.setTitle('Memory game')
    this.start()
  }

  /**
   * Start (or restart) the game
   */
  start() {
    this.#remaining = this.#pairs
    this.#attempts = 0
    this.#fails = 0
    this.#turned = []
    this.#locked = false
    this.#createTiles()
    this.#updateScore()
  }

  /**
   * Ask for the number of pairs and start a new game
   */
  async newGame() {
    const answer = await AppModal.prompt({
      content: 'Rounds',
      placeholder: 'rounds',
      value: this.#pairs,
      type: 'number',
      min: 1,
      max: maxPairs
    })

    const pairs = parseInt(answer, 10)
    if (!(pairs >= 1)) return // dismissed, or not a number

    this.#pairs = Math.min(pairs, maxPairs)
    this.start()
  }

  #createTiles() {
    const images = Array.from({ length: this.#pairs }, (_, i) => i + 1)
    const tiles = shuffle([...images, ...images]).map((image) => {
      const tile = document.createElement('img')
      tile.src = hiddenTile
      tile.alt = 'Memory tile'
      tile.dataset.image = image
      tile.tabIndex = 0
      return tile
    })
    this.#tilesElem.replaceChildren(...tiles)
  }

  /**
   * Turn a tile face up; every second tile completes a guess
   * @param {HTMLImageElement} tile
   */
  #turn(tile) {
    // ignore matched tiles, the tile that is already turned, and turns while
    // a wrong pair is still showing
    if (
      this.#locked ||
      tile.classList.contains('matched') ||
      this.#turned.includes(tile)
    ) {
      return
    }

    tile.src = `${imgPath}${tile.dataset.image}.png`
    this.#turned.push(tile)
    if (this.#turned.length < 2) return

    const pair = this.#turned
    this.#turned = []
    this.#attempts++

    if (pair[0].dataset.image === pair[1].dataset.image) this.#match(pair)
    else this.#miss(pair)
    this.#updateScore()
  }

  #match(pair) {
    for (const tile of pair) {
      tile.classList.add('matched', 'success')
      setTimeout(() => {
        tile.src = '/image/pixel.png'
        tile.tabIndex = -1
      }, revealTime)
    }

    if (--this.#remaining === 0) this.#gameCompleted()
  }

  #miss(pair) {
    this.#fails++

    // show the wrong pair for a moment before turning it back
    this.#locked = true
    pair.forEach((tile) => tile.classList.add('failure'))
    setTimeout(() => {
      for (const tile of pair) {
        tile.src = hiddenTile
        tile.classList.remove('failure')
      }
      this.#locked = false
    }, revealTime)
  }

  #updateScore() {
    const matches = this.#attempts - this.#fails
    const accuracy = this.#attempts
      ? Math.round((matches / this.#attempts) * 100)
      : 0

    this.#scoreElem.textContent = this.#remaining
    this.#failsElem.textContent = this.#fails
    this.#accuracyElem.textContent = `${accuracy} %`
  }

  #gameCompleted() {
    const title = document.createElement('h1')
    title.textContent = 'GAME COMPLETED!'

    const restart = document.createElement('button')
    restart.textContent = 'Restart'
    restart.addEventListener('click', () => this.start())

    this.#tilesElem.replaceChildren(title, restart)
  }
}

// register element
customElements.define('memory-app', MemoryApp)
