const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>

    :host, :host * {
      margin: 0;
      padding: 0;
    }

    :host {
      max-width: 460px;
    }

    :host .content {
      display: flex;
      flex-direction: column;
      background:purple;
    }

    :host .chat-messages {
      flex-grow: 1;
      max-height: 350px;
      overflow-y: scroll;
      padding: 0 !important;
    }

    :host .message {
      border-bottom: 1px solid rgba(200, 200, 200, 0.2);
      padding: .4em;
      display: flex;
      flex-wrap: wrap;
      word-break: break-word;
    }

    :host .message:nth-child(even) {
      background: rgba(0,0,0,0.05);
    }

    :host .message .user {
      font-weight: bold;
      order: 1;
      flex: 1;
    }

    :host .message .time {
      font-weight: 300;
      order: 2;
      text-align: right;
    }

    :host .message .text {
      color: #888;
      order: 3;
      flex-basis: 100%;
    }

    :host .chat-controls {
      border-top: 1px solid #d0d0d0;
      padding: .2em;
      display: flex;
    }

    :host .chat-controls textarea {
      width: auto;
      flex: 1;
      padding: .4em;
      font-family: Helvetica, arial, sans-serif;
    }

    :host button {
      padding: .4em .6em;
    }

  </style>
`

export default template
