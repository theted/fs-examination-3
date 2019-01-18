/**
 * Memory game module
 * TODO: support touch events
 */
import AppWindow from './appwindow.js'
import cssTemplate from './memory.css.js'
import htmlTemplate from './memory.html.js'

export default class MemoryApp extends AppWindow {
  constructor () {
    super()

    // options
    this.imgPath = '/image/memory/'
    this.defaultTile = this.imgPath + '0.png'
    this.numTiles = 8
    this.timeout = 1000

    // elements
    this._contentElem.appendChild(cssTemplate.content.cloneNode(true))
    this._contentElem.appendChild(htmlTemplate.content.cloneNode(true))
    this._tilesElem = this._contentElem.querySelector('.tiles')
    this._scoreElement = this._contentElem.querySelector('#score')
    this._failsElement = this._contentElem.querySelector('#fails')
    this._accurracyElement = this._contentElem.querySelector('#accur')

    // setup
    this.setTitle('Memory game')
    this.start()
  }

  /**
   * Start / reset the Game
   */
  start () {
    this.clicks = 0
    this.failedAttempts = 0
    this.remaining = this.numTiles
    this.clickedElements = []
    this.createTiles()
    this._failsElement.textContent = 0
    this._scoreElement.textContent = this.numTiles
    this._accurracyElement.textContent = '0 %'

    document.body.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        this.clickTile(this.shadowRoot.activeElement)
      }
    })
  }

  /**
   * (re)create tiles
   */
  createTiles () {
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
  _createTile (number) {
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
  clickTile (el) {
    // prevent same elemnt from being clicked twice
    // TODO: fix double-click issue!
    if (this.clicks === 1 && this.clickedElements[0] === el) return false

    this.clickedElements.push(el)

    el.src = this.imgPath + el.getAttribute('image-number') + '.png'

    if (this.clicks % 2) {
      if (this.matchTiles(this.clickedElements)) {
        this.sucessfulMatch(this.clickedElements)
      } else {
        this.failureMatch(this.clickedElements)
      }

      this.clickedElements = [] // reset clicked elements
    }

    ++this.clicks
  }

  /**
   * Check if two tiles matchs
   * @param {Tiles[]} Array of tiles
   */
  matchTiles (tiles) {
    let firstNum = tiles[0].getAttribute('image-number')
    let secondNumber = tiles[1].getAttribute('image-number')
    let match = (firstNum === secondNumber)
    return match
  }

  /**
   * Sucessful match handling
   * @param {Tiles[]} tiles
   */
  sucessfulMatch (tiles) {
    tiles.forEach((tile) => {
      tile.classList.add('success')
      setTimeout(() => { this.removeTile(tile) }, this.timeout)
    })

    --this.remaining
    this._scoreElement.textContent = this.remaining

    if (this.remaining === 0) {
      this.gameCompleted()
    }
  }

  /**
   * Failure match
   * @param {Tiles[]} tiles
   */
  failureMatch (tiles) {
    tiles.forEach((tile) => { this._setClassAndReset(tile, 'failure') })
    ++this.failedAttempts
    this._failsElement.textContent = this.failedAttempts
  }

  /**
   * Set tile class name & reset tile after timeout
   * @param {Tile} tile
   * @param {string} className
   */
  _setClassAndReset (tile, className) {
    tile.classList.add(className)
    setTimeout(() => { this.resetTile(tile) }, this.timeout)
  }

  /**
   * Remove a tile from the game area
   * @param {Tile} tile
   */
  removeTile (tile) {
    tile.src = '/image/pixel.png'
    tile.removeEventListener('click', this.clickTile, false)
    tile.setAttribute('tabindex', -1)
  }

  /**
   * Reset a single tile
   * @param {Tile} tile
   */
  resetTile (tile) {
    tile.src = this.defaultTile
    tile.classList.remove('success')
    tile.classList.remove('failure')
  }

  /**
   * Stuff when game is completed
   */
  gameCompleted () {
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
  _shuffle (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
}

// register element
window.customElements.define('memory-app', MemoryApp)
