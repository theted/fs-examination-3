/**
 * Notes module
 */
import AppWindow from './appwindow.js'
import Storage from './storage.js'
import htmlTemplate from './notes.html.js'
import cssTemplate from './notes.css.js'
const storage = new Storage()

export default class NotesApp extends AppWindow {
  constructor () {
    super()

    this._contentElem.appendChild(cssTemplate.content.cloneNode(true))
    this._contentElem.appendChild(htmlTemplate.content.cloneNode(true))
    this._note = this.shadowRoot.querySelector('textarea[name="note"]')
    this._saveBtn = this.shadowRoot.querySelector('button[name="save"]')
    this._stateElem = this.shadowRoot.querySelector('span.state')
    this._saveBtn.addEventListener('click', () => this._update())

    // set window title & get current not from storage
    this.setTitle('Notes')
    this._note.value = storage.get('note') || 'Add some notes here ... '
  }

  /**
   * Save note to storage on upt
   */
  _update () {
    storage.set('note', this._note.value)
  }
}

// register element
window.customElements.define('notes-app', NotesApp)
