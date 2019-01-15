export default class Storage {
  /**
   * Get value from localStorage
   * @param {string} key
   * @returns {string} value
   */
  get (key) {
    return localStorage.getItem(key)
  }

  /**
   * Get
   * @param {string} key
   * @returns {JSON} data
   */
  getJSON (key) {
    return JSON.parse(this.get(key))
  }

  /**
   * Set/update localStorage value
   * @param {string} key
   * @param {string} val
   */
  set (key, val) {
    localStorage.setItem(key, val)
  }

  /**
   * Save object as JSON
   * @param {String} key
   * @param {Object} data
   */
  setJSON (key, val) {
    return this.set(key, JSON.stringify(val))
  }

  /**
   * Remove key from localStorage
   * @param {string} key
   */
  remove (key) {
    localStorage.removeItem(key)
  }

  /**
   * List all keys
   * @returns {string[]} List of keys
   */
  keys () {
    var keys = []
    for (var i = 0, len = localStorage.length; i < len; ++i) {
      keys.push(localStorage.key(i))
    }
    return keys
  }

  debug () {
    var storageKeys = this.keys()
    for (var i = 0, len = storageKeys.length; i < len; i++) {
      console.log(storageKeys[i], '->', this.get(storageKeys[i]))
    }
  }

  /**
  * Dispatch an update event
  * @param {String} key
  * @param {*} value
  * @param {String} event name (default: `storage-update`)
  * @param {HTML Element} Target (default: document.body)
  */
  publish (key, value, eventName = 'storage-update', target = document.body) {
    target.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      detail: {
        key: key,
        value: value
      }
    }))
  }
}
