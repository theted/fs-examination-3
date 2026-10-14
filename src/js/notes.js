/**
 * Notes module
 */
import AppWindow from './appwindow.js'
import Storage from './storage.js'
import htmlTemplate from './notes.html.js'
import cssTemplate from './notes.css.js'
import * as _ from './helpers.js'
const storage = new Storage()

// notes shown before anything has been saved
const defaultNotes = ['Foo', 'Bar', 'Ny notering']

export default class NotesApp extends AppWindow {
  constructor() {
    super()

    this._contentElem.appendChild(cssTemplate.content.cloneNode(true))
    this._contentElem.appendChild(htmlTemplate.content.cloneNode(true))

    this._note = this.shadowRoot.querySelector('textarea[name="note"]')
    this._noteTitle = this.shadowRoot.querySelector('input[name="title"]')
    this._notesList = this.shadowRoot.querySelector('#notes-list')
    this._noteElem = this.shadowRoot.querySelector('#notes-edit')
    this._saveBtn = this.shadowRoot.querySelector('button[name="save"]')
    this._newBtn = this.shadowRoot.querySelector('button[name="new"]')
    this._closeBtn = this.shadowRoot.querySelector('button[name="close"]')

    this._saveBtn.addEventListener('click', () => this.save())
    this._closeBtn.addEventListener('click', () => this.displayNotes())
    this._newBtn.addEventListener('click', () => this.newNote())

    this.displayNotes()
  }

  /**
   * Titles of all saved notes
   * @returns {String[]}
   */
  get notes() {
    return storage.getJSON('notes') || defaultNotes
  }

  set notes(titles) {
    storage.setJSON('notes', titles)
  }

  /**
   * Storage key for a note's content
   * @param {String} title
   */
  noteKey(title) {
    return 'note-' + _.safify(title)
  }

  /**
   * Render the list of notes
   */
  renderList() {
    let list = document.createElement('ul')
    list.classList.add('list')

    this.notes.forEach((title) => {
      let noteElem = document.createElement('li')
      let linkElem = document.createElement('a')

      linkElem.textContent = title
      linkElem.addEventListener('click', () => this.selectNote(title))

      noteElem.appendChild(linkElem)
      list.appendChild(noteElem)
    })

    this._notesList.innerHTML = ''
    this._notesList.appendChild(list)
  }

  /**
   * Open a saved note for editing
   * @param {String} title
   */
  selectNote(title) {
    this.currentNote = title
    this.showNote(title, storage.get(this.noteKey(title)) || '')
    this.setTitle(title)
  }

  /**
   * Show the editor
   * @param {String} title
   * @param {String} content
   */
  showNote(title = '', content = '') {
    this._noteTitle.value = title
    this._note.value = content

    this._notesList.classList.add('hidden')
    this._noteElem.classList.remove('hidden')
    this._newBtn.classList.add('hidden')
    this._saveBtn.classList.remove('hidden')
    this._closeBtn.classList.remove('hidden')
  }

  /**
   * Show the list of notes
   */
  displayNotes() {
    this.currentNote = null
    this.renderList()
    this.setTitle('Notes')

    this._notesList.classList.remove('hidden')
    this._noteElem.classList.add('hidden')
    this._newBtn.classList.remove('hidden')
    this._saveBtn.classList.add('hidden')
    this._closeBtn.classList.add('hidden')
  }

  /**
   * Edit a new, empty note
   */
  newNote() {
    this.currentNote = null
    this.showNote()
    this.setTitle('New note')
    this._noteTitle.focus()
  }

  /**
   * Save the note being edited; a new title adds (or renames) the note
   */
  save() {
    let title = this._noteTitle.value.trim()

    // a note needs a title
    if (!title) {
      this._noteTitle.focus()
      return
    }

    if (title !== this.currentNote) {
      let notes = this.notes.filter((note) => note !== this.currentNote)
      if (this.currentNote) storage.remove(this.noteKey(this.currentNote))
      if (!notes.includes(title)) notes.push(title)
      this.notes = notes
      this.currentNote = title
    }

    storage.set(this.noteKey(title), this._note.value)
    this.setTitle(title)
  }
}

// register element
window.customElements.define('notes-app', NotesApp)
