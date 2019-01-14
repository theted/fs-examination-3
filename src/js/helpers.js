/**
 * Return current timstamp in human-readable format
 */
function timeStamp() {
  let dt = new Date()
  return dt.toLocaleTimeString('sv-SE')
}

/**
 * Add a child element to a existing parent node
 * @param {HTML Element} parent
 * @param {String} type
 * @param {String} text
 * @param {String} className
 */
function addTo(parent, type, text, className) {
  let child = parent.appendChild(document.createElement(type))
  if (text) { child.textContent = text }
  if (className) { child.classList.add(className) }
  return child
}

/**
 * Add HTML to a DOM node
 * @param {String} HTML
 * @param {HTML Element} parent
 */
function addTemplate(html, parent) {
  let template = document.createElement('template')
  template.innerHTML = html
  parent.appendChild(template.content.cloneNode(true))
}

/**
 * Set background image of an element
 * @param {String} img path
 * @param {HTML Element} element
 */
function setBackgroundImage(img, el) {
  el.style.backgroundImage = 'url("' + img + '")'
}

export {
  timeStamp,
  addTo,
  addTemplate,
  setBackgroundImage
}
