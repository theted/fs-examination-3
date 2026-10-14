/**
 * Small DOM and string helpers
 */

/**
 * Current time in human-readable format, e.g. 14:05:09
 * @returns {string}
 */
export const timeStamp = () => new Date().toLocaleTimeString('sv-SE')

/**
 * Create a <template> element from an HTML string
 * @param {string} html
 * @returns {HTMLTemplateElement}
 */
export const template = (html) =>
  Object.assign(document.createElement('template'), { innerHTML: html })

/**
 * Append a new child element
 * @param {HTMLElement} parent
 * @param {string} type - tag name
 * @param {string} [text]
 * @param {string} [className]
 * @returns {HTMLElement} the new element
 */
export const addTo = (parent, type, text, className) => {
  const child = parent.appendChild(document.createElement(type))
  if (text) child.textContent = text
  if (className) child.classList.add(className)
  return child
}

/**
 * Append HTML to an element
 * @param {string} html
 * @param {HTMLElement} parent
 */
export const addTemplate = (html, parent) =>
  parent.append(template(html).content)

/**
 * Use an image as an element's background
 * @param {string} img - image URL
 * @param {HTMLElement} el
 */
export const setBackgroundImage = (img, el) => {
  el.style.backgroundImage = `url("${img}")`
}

/**
 * A key that is safe to use, e.g. in storage: lower case, spaces replaced
 * with underscores, other non-word characters removed
 * @param {string} str
 * @returns {string}
 */
export const safify = (str) =>
  str.toLowerCase().replaceAll(' ', '_').replace(/\W/g, '')
