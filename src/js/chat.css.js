const template = document.createElement('template')
template.innerHTML = /* html */ `
<style>
  :host, :host * {
    margin: 0; padding: 0;
  }
  :host .message {
    background: #eee;
    border-bottom: #d0d0d0;
    padding: 3px;
  }
  :host .message .user {
    font-weight: bold;
  }
  :host .message .time {
    font-weight: 300;
  }
  :host .message .text {
    color: red;
  }
</style>
`

export default template
