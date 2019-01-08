const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>
    :host, :host * {
      margin: 0;
      padding: 0;
    }

    :host .content {
      display: flex;
      flex-direction: column;
      background:purple;
    }

    :host .chat-messages {
      flex-grow: 1;
      max-height: 600px;
      overflow-y: scroll;
    }

    :host .message {
      background: #eee;
      border-bottom: 1px solid #e0e0e0;
      padding: 3px;
      display: flex;
      flex-wrap: wrap;
      word-break: break-all;
    }

    :host .message:nth-child(even) {
      background: #f4f4f4;
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
      color: red;
      order: 3;
      flex-basis: 100%;
    }

    :host .chat-controls {
      border-top: 1px solid #d0d0d0;
      padding: .2em;
      display: flex;
    }

    :host .chat-controls input {
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
