/**
 * Notes module
 */
import notesCss from '../css/components/notes.css?inline'
import AppWindow from './appwindow.js'
import storage from './storage.js'
import htmlTemplate from './notes.html.js'
import { addTo, safify, stylesheet } from './helpers.js'

const sheet = stylesheet(notesCss)

// notes shown before anything has been saved
const defaultNotes = ['Foo', 'Bar', 'Ny notering']

/** @returns {string[]} titles of all saved notes */
const loadNotes = () => storage.getJSON('notes') ?? defaultNotes

/** @param {string[]} titles */
const saveNotes = (titles) => storage.setJSON('notes', titles)

/** Storage key for a note's content */
const noteKey = (title) => `note-${safify(title)}`

export default class NotesApp extends AppWindow {
  #currentNote = null // title of the note being edited, null for a new note
  #list
  #editor
  #titleInput
  #contentInput
  #saveButton
  #newButton
  #closeButton
  #status

  constructor() {
    super()

    this._addStyles(sheet)
    this._contentElem.append(htmlTemplate.content.cloneNode(true))

    this.#list = this.shadowRoot.querySelector('#notes-list')
    this.#editor = this.shadowRoot.querySelector('#notes-edit')
    this.#titleInput = this.shadowRoot.querySelector('input[name="title"]')
    this.#contentInput = this.shadowRoot.querySelector('textarea[name="note"]')
    this.#saveButton = this.shadowRoot.querySelector('button[name="save"]')
    this.#newButton = this.shadowRoot.querySelector('button[name="new"]')
    this.#closeButton = this.shadowRoot.querySelector('button[name="close"]')
    this.#status = this.shadowRoot.querySelector('.status')

    this.#saveButton.addEventListener('click', () => this.save())
    this.#closeButton.addEventListener('click', () => this.showList())
    this.#newButton.addEventListener('click', () => this.newNote())

    // any edit makes "Saved" out of date
    this.#editor.addEventListener('input', () => this.#setStatus(''))

    this.showList()
  }

  /**
   * Show the list of notes
   */
  showList() {
    this.#currentNote = null
    this.setTitle('Notes')

    const list = document.createElement('ul')
    list.classList.add('list')
    for (const title of loadNotes()) {
      const note = addTo(addTo(list, 'li'), 'button', title, 'note')
      note.type = 'button'
      note.addEventListener('click', () => this.openNote(title))
    }
    this.#list.replaceChildren(list)

    this.#showEditor(false)
  }

  /**
   * Open a saved note for editing
   * @param {string} title
   */
  openNote(title) {
    this.#currentNote = title
    this.#titleInput.value = title
    this.#contentInput.value = storage.get(noteKey(title)) ?? ''
    this.setTitle(title)
    this.#showEditor(true)
  }

  /**
   * Edit a new, empty note
   */
  newNote() {
    this.#currentNote = null
    this.#titleInput.value = ''
    this.#contentInput.value = ''
    this.setTitle('New note')
    this.#showEditor(true)
    this.#titleInput.focus()
  }

  /**
   * Save the note being edited; a new title adds (or renames) the note
   */
  save() {
    const title = this.#titleInput.value.trim()

    // a note needs a title
    if (!title) {
      this.#titleInput.focus()
      return
    }

    if (title !== this.#currentNote) {
      const notes = loadNotes().filter((note) => note !== this.#currentNote)
      if (this.#currentNote) storage.remove(noteKey(this.#currentNote))
      if (!notes.includes(title)) notes.push(title)
      saveNotes(notes)
      this.#currentNote = title
    }

    storage.set(noteKey(title), this.#contentInput.value)
    this.setTitle(title)
    this.#setStatus('Saved')
  }

  #setStatus(text) {
    this.#status.textContent = text
  }

  /**
   * Switch between the editor and the list
   * @param {boolean} editing
   */
  #showEditor(editing) {
    this.#setStatus('')
    this.#list.classList.toggle('hidden', editing)
    this.#editor.classList.toggle('hidden', !editing)
    this.#newButton.classList.toggle('hidden', editing)
    this.#saveButton.classList.toggle('hidden', !editing)
    this.#closeButton.classList.toggle('hidden', !editing)
  }
}

// register element
customElements.define('notes-app', NotesApp)
