/**
 * Memory game module
 */
import memoryCss from '../css/components/memory.css?inline'
import AppWindow from './appwindow.js'
import AppModal from './app-modal.js'
import htmlTemplate from './memory.html.js'
import { stylesheet, template } from './helpers.js'

const sheet = stylesheet(memoryCss)

const imgPath = '/image/memory/'
const hiddenTile = `${imgPath}0.png`
const maxPairs = 8
const revealTime = 1000 // ms a turned pair stays visible

/** e.g. plural(1, 'pair') -> '1 pair', plural(3, 'guess', 'guesses') -> '3 guesses' */
const plural = (count, one, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`

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
  #game = 0 // increases with every new game, so old timers can tell
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

    this._addStyles(sheet)
    this._contentElem.append(htmlTemplate.content.cloneNode(true))
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

    // the New game button, or the window's own icon, starts a new game
    this._contentElem
      .querySelector('.new-game')
      .addEventListener('click', () => this.newGame())
    this._iconElem.addEventListener('click', () => this.newGame())

    this.setTitle('Memory game')
    this.start()
  }

  /**
   * Start (or restart) the game
   */
  start() {
    this.#game++
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
      title: 'New game',
      content: `How many pairs? (1–${maxPairs})`,
      action: 'Start',
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
    tile.classList.add('face-up')
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
      tile.tabIndex = -1
    }

    this.#remaining--
    this.#later(() => {
      for (const tile of pair) {
        tile.classList.replace('success', 'cleared')
      }
      if (this.#remaining === 0) this.#gameCompleted()
    })
  }

  #miss(pair) {
    this.#fails++

    // show the wrong pair for a moment before turning it back
    this.#locked = true
    pair.forEach((tile) => tile.classList.add('failure'))
    this.#later(() => {
      for (const tile of pair) {
        tile.src = hiddenTile
        tile.classList.remove('failure', 'face-up')
      }
      this.#locked = false
    })
  }

  /**
   * Run after the reveal time, unless a new game has started by then
   * @param {Function} callback
   */
  #later(callback) {
    const game = this.#game
    setTimeout(() => {
      if (game === this.#game) callback()
    }, revealTime)
  }

  #updateScore() {
    const matches = this.#attempts - this.#fails
    this.#scoreElem.textContent = this.#remaining
    this.#failsElem.textContent = this.#fails
    this.#accuracyElem.textContent = this.#attempts
      ? `${Math.round((matches / this.#attempts) * 100)} %`
      : '–'
  }

  #gameCompleted() {
    this.#tilesElem.replaceChildren(
      template(/* html */ `
        <div class="done">
          <h1>All pairs found</h1>
          <p>${plural(this.#pairs, 'pair')} in ${plural(this.#attempts, 'guess', 'guesses')}</p>
          <button class="button primary" type="button">Play again</button>
        </div>
      `).content
    )
    this.#tilesElem
      .querySelector('button')
      .addEventListener('click', () => this.start())
  }
}

// register element
customElements.define('memory-app', MemoryApp)
