const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
  :host {
      display: flex;
      flex-direction: column;
      position: absolute;
      margin: 0;
      padding: 0;
      /*box-shadow: 3px 8px 76px 29px rgba( 20, 20, 20, 0.45 );*/
      filter: drop-shadow(2px 5px 20px rgba(0,0,0,0.5));
      animation-duration: 300ms;
      animation-fill-mode: both;
    }

    :host h3 {
      padding: 0;
      margin: 0;
    }

    :host .content {
      background: #f9f9f9;
      flex: 1;
      transition: opacity 150ms;
    }

    :host .alt {
      background: #202020 !important;
      color: #f9f9f9;
      /* display: block !important; */
    }

    :host .header {
      display: flex;
      align-items: stretch;
      background: #212121;
      background: linear-gradient(#333, #101010);
      border-bottom: 1px solid #d3d3d3;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    :host .title {
      flex: 1;
      color: #eee;
      padding: 1em;
      border-left: 1px solid rgba(130, 130, 130, 0.12);
      border-right: 1px solid rgba(130, 130, 130, 0.12);
    }

    :host .title :hover {
      cursor: move;
    }

    :host .icon, :host .close {
      color: white;
      padding: 1em 1.5em;
      transition: background 300ms;
    }

    :host .icon img, :host .close img {
      filter: invert(100%);
      transition: filter 800ms;
      max-width: 18px;
      height: auto;
    }

    :host .close {
      z-index: 999;
    }

    :host .close:hover {
      background: #333;
      cursor: pointer;
    }

    :host .close:hover img {
      filter: invert(0%);
    }

    :host .dragging {
      opacity: 0.8;
    }

    /**
     * light thme
     */
    :host-context(.light) .header {
      background: #f3f3f3;
    }

    :host-context(.light) .header h3 {
      color: #444;
    }

    :host-context(.light) .header img {
      filter: invert(10%);
    }

    :host-context(.light) section {
      padding: 1.2em;
      background: linear-gradient(#f6f6f6, #e9e9e9);
      border-bottom: 1px solid #e0e0e0
    }

    /**
     * Dark theme
     */

    :host-context(.dark) .content {
      background: #232323;
      color: #eee;
    }


    /**
     * Minimal theme
     */
    :host-context(.minimal) .header {
      background: transparent;
      padding-left: 0;
      padding-right: 0;
    }

    :host-context(.minimal) .icon, :host-context(.minimal) .close {
      padding: 0;
    }

    :host-context(.minimal) .title {
      border: none;
    }

    :host-context(.minimal) .header h3 {
      display: none;
    }

    /**
     * Weird theme
     */
    :host-context(.weird) .content {
      background: purple;
      color: white;
    }

  </style>
`

export default template
