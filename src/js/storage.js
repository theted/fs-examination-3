/**
 * localStorage access, plus a tiny publish/subscribe for setting changes
 */
const storage = {
  /**
   * @param {string} key
   * @returns {string|null}
   */
  get: (key) => localStorage.getItem(key),

  /**
   * @param {string} key
   * @returns {*} the parsed value, or null if missing or not valid JSON
   */
  getJSON(key) {
    try {
      return JSON.parse(this.get(key))
    } catch {
      return null
    }
  },

  /**
   * @param {string} key
   * @param {string} value
   */
  set: (key, value) => localStorage.setItem(key, value),

  /**
   * @param {string} key
   * @param {*} value - saved as JSON
   */
  setJSON(key, value) {
    this.set(key, JSON.stringify(value))
  },

  /**
   * @param {string} key
   */
  remove: (key) => localStorage.removeItem(key),

  /**
   * Save a value and announce the change with a `storage-update` event
   * @param {string} key
   * @param {*} value
   */
  publish(key, value) {
    this.set(key, value)
    document.body.dispatchEvent(
      new CustomEvent('storage-update', { detail: { key, value } })
    )
  },

  /**
   * Run a callback for every published change
   * @param {(change: { key: string, value: * }) => void} callback
   */
  subscribe(callback) {
    document.body.addEventListener('storage-update', (event) =>
      callback(event.detail)
    )
  }
}

export default storage
