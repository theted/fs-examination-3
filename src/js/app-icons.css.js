const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>
    :host {
      background: #222;
      position: fixed;
      bottom: 0px;
      left: 0px;
      right: 0px;
    }

    :host ul {
      display: inline;
    }

    :host li {
      float: left;
      list-style: none;
      color: #fff;
      border-right: 1px solid #eee;
    }

    :host a {
      padding: 1.2em;
      color: #fff;
      text-decoration: none;
      display: flex;
      border-right: 1px solid rgba(200, 200, 200, 0.4);
      transition: background 400ms, color 400ms
    }

    :host a span {
      display: flex;
      align-items: center;
      padding: .4em;
    }

    :host img {
      filter: invert(100%);
      padding-right: .4em
    }

    /**
     * Light theme
     */

    :host-context(.light) {
      background: #eee;
    }

    :host-context(.light) a {
      color: #444;
    }

    :host-context(.light) a:hover {
      color: #666;
      background: #fff;
    }

    :host-context(.light) img {
      filter: invert(10%);
    }

    /**
     * Minimal theme
     */

    :host-context(.minimal) span {
      display: none;
    }

</style>
`

export default template
