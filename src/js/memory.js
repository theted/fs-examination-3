/**
 * Memory game module
 */
import AppWindow from './appwindow.js'
import AppModal from './app-modal.js'
import cssTemplate from './memory.css.js'
import htmlTemplate from './memory.html.js'

export default class MemoryApp extends AppWindow {
  constructor() {
    super()

    // options
    this.imgPath = '/image/memory/'
    this.defaultTile = this.imgPath + '0.png'
    this.maxTiles = 8
    this.numTiles = this.maxTiles
    this.timeout = 1000

    // elements
    this._contentElem.appendChild(cssTemplate.content.cloneNode(true))
    this._contentElem.appendChild(htmlTemplate.content.cloneNode(true))
    this._tilesElem = this._contentElem.querySelector('.tiles')
    this._scoreElement = this._contentElem.querySelector('#score')
    this._failsElement = this._contentElem.querySelector('#fails')
    this._accurracyElement = this._contentElem.querySelector('#accur')

    // play with the keyboard: Enter or Space turns the focused tile
    this._tilesElem.addEventListener('keydown', (event) => {
      if (
        (event.key === 'Enter' || event.key === ' ') &&
        event.target.matches('img')
      ) {
        event.preventDefault()
        this.clickTile(event.target)
      }
    })

    // the window's own icon starts a new game
    this._iconElem.addEventListener('click', () => this.newGame())

    // setup
    this.setTitle('Memory game')
    this.start()
  }

  /**
   * Start / reset the Game
   */
  start() {
    this.attempts = 0
    this.failedAttempts = 0
    this.remaining = this.numTiles
    this.clickedElements = []
    this.locked = false
    this.createTiles()
    this.updateScore()
  }

  /**
   * Show remaining pairs, failed guesses and accuracy
   */
  updateScore() {
    const matches = this.attempts - this.failedAttempts
    const accuracy = this.attempts
      ? Math.round((matches / this.attempts) * 100)
      : 0

    this._scoreElement.textContent = this.remaining
    this._failsElement.textContent = this.failedAttempts
    this._accurracyElement.textContent = accuracy + ' %'
  }

  /**
   * (re)create tiles
   */
  createTiles() {
    this._tilesElem.innerHTML = '' // reset tiles element
    let tiles = [...Array(this.numTiles).keys()] // create array of n length
    tiles = tiles.concat(tiles) // duplicate array
    tiles = this._shuffle(tiles) // randomize tilesay order
    tiles.forEach((tile) => this._createTile(tile)) // create a tile for each array item
  }

  /**
   * Append a tile to the app window
   * @param {number} Number of tile
   */
  _createTile(number) {
    let tile = document.createElement('img')
    tile.src = this.defaultTile
    tile.setAttribute('image-number', number + 1)
    tile.setAttribute('tabindex', 0)
    tile.addEventListener('click', (event) => this.clickTile(event.target))
    this._tilesElem.appendChild(tile)
  }

  /**
   * Click handler for tiles
   * @param {Tile} Tile element
   */
  clickTile(el) {
    // ignore matched tiles, the tile that is already turned, and clicks
    // while a wrong pair is still showing
    if (this.locked || el.matched || this.clickedElements.includes(el)) {
      return false
    }

    this.clickedElements.push(el)

    el.src = this.imgPath + el.getAttribute('image-number') + '.png'

    if (this.clickedElements.length === 2) {
      ++this.attempts

      if (this.matchTiles(this.clickedElements)) {
        this.sucessfulMatch(this.clickedElements)
      } else {
        this.failureMatch(this.clickedElements)
      }

      this.clickedElements = [] // reset clicked elements
      this.updateScore()
    }
  }

  /**
   * Check if two tiles matchs
   * @param {Tiles[]} Array of tiles
   */
  matchTiles(tiles) {
    let firstNum = tiles[0].getAttribute('image-number')
    let secondNumber = tiles[1].getAttribute('image-number')
    let match = firstNum === secondNumber
    return match
  }

  /**
   * Sucessful match handling
   * @param {Tiles[]} tiles
   */
  sucessfulMatch(tiles) {
    tiles.forEach((tile) => {
      tile.matched = true
      tile.classList.add('success')
      setTimeout(() => {
        this.removeTile(tile)
      }, this.timeout)
    })

    --this.remaining

    if (this.remaining === 0) {
      this.gameCompleted()
    }
  }

  /**
   * Failure match
   * @param {Tiles[]} tiles
   */
  failureMatch(tiles) {
    ++this.failedAttempts

    // show the wrong pair for a moment before turning it back
    this.locked = true
    tiles.forEach((tile) => tile.classList.add('failure'))
    setTimeout(() => {
      tiles.forEach((tile) => this.resetTile(tile))
      this.locked = false
    }, this.timeout)
  }

  /**
   * Remove a tile from the game area
   * @param {Tile} tile
   */
  removeTile(tile) {
    tile.src = '/image/pixel.png'
    tile.setAttribute('tabindex', -1)
  }

  /**
   * Reset a single tile
   * @param {Tile} tile
   */
  resetTile(tile) {
    tile.src = this.defaultTile
    tile.classList.remove('success')
    tile.classList.remove('failure')
  }

  /**
   * Stuff when game is completed
   */
  gameCompleted() {
    let ttl = document.createElement('h1')
    ttl.textContent = 'GAME COMPLETED!'

    let btn = document.createElement('button')
    btn.textContent = 'Restart'
    btn.addEventListener('click', (event) => this.start())

    this._tilesElem.innerHTML = ''
    this._tilesElem.appendChild(ttl)
    this._tilesElem.appendChild(btn)
  }

  /**
   * Randomize order of an array
   * @param {array} array
   */
  _shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  /**
   * Start new game, allowing the user to choose number of tiles
   * through a modal window.
   */
  async newGame() {
    const rounds = await AppModal.prompt({
      content: 'Rounds',
      placeholder: 'rounds',
      value: this.numTiles,
      type: 'number',
      min: 1,
      max: this.maxTiles
    })

    const numTiles = parseInt(rounds, 10)
    if (!(numTiles >= 1)) return // dismissed, or not a number

    this.numTiles = Math.min(numTiles, this.maxTiles)
    this.start()
  }
}

// register element
window.customElements.define('memory-app', MemoryApp)
