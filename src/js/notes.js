/**
 * Notes module
 */
import AppWindow from './appwindow.js'
import Storage from './storage.js'
import htmlTemplate from './notes.html.js'
import cssTemplate from './notes.css.js'
import * as _ from './helpers.js'
const storage = new Storage()

export default class NotesApp extends AppWindow {
  constructor () {
    super()

    this.notes = ['Foo', 'Bar', 'Ny notering']

    this._contentElem.appendChild(cssTemplate.content.cloneNode(true))
    this._contentElem.appendChild(htmlTemplate.content.cloneNode(true))

    this._note = this.shadowRoot.querySelector('textarea[name="note"]')
    this._notesList = this.shadowRoot.querySelector('#notes-list')
    this._noteElem = this.shadowRoot.querySelector('#notes-edit')
    this._saveBtn = this.shadowRoot.querySelector('button[name="save"]')
    this._stateElem = this.shadowRoot.querySelector('span.state')
    this._saveBtn.addEventListener('click', () => this._update())

    // set window title & get current not from storage
    this.setTitle('Notes')
    this._note.value = storage.get('note') || 'Add some notes here ... '

    // initially hide notes-edit window
    this._noteElem.classList.add('hidden')

    // setup prev notes list
    this.setupNotes()
  }

  setupNotes () {
    let notnotes = document.createElement('ul')

    this.notes.forEach(note => {
      let noteElem = document.createElement('li')
      let linkElem = document.createElement('a')

      linkElem.textContent = note
      linkElem.addEventListener('click', event => {
        this.selectNote(event.target.textContent)
      })

      noteElem.appendChild(linkElem)
      notnotes.appendChild(noteElem)
    })

    this._notesList.innerHTML = ''
    this._notesList.appendChild(notnotes)
  }

  selectNote (note) {
    // get data
    let noteData = storage.get(_.safify(note))

    // set data ....

    this.setTitle(note)

    this._notesList.classList.add('hidden')
    this._noteElem.classList.remove('hidden')
    console.log('View note ->', note, _.safify(note), noteData)
  }

  displayNotes () {
    this._notesList.classList.remove('hidden')
    this._noteElem.classList.add('hidden')
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
