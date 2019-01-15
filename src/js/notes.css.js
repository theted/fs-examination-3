const template = document.createElement('template')
template.innerHTML = /* html */ `

  <style>

    /**
     * Hard reset mostly for dem pesky lists
     */
    :host * {
      padding: 0;
      margin: 0;
    }


    /**
     * Note edit
     */

    :host textarea {
      width: calc(100% - 2em - 2px);
      min-height: 140px;
      padding: 1em;
      border: 1px solid #d0d0d0;
    }

    :host span.state {
      margin: 1em;
      float: left
    }


    /**
     * Notes list
     */

    :host #notes-list {
      padding: 0;
    }

    :host #notes-list li {
      list-style: none;
    }

    :host #notes-list a {
      padding: 1em;
      display: block;
      border-bottom: 1px solid rgba(0,0,0,0.15);
    }


    /**
     * Helper classes
     */

    :host .hidden {
      display: none;
    }

  </style>

`

export default template
