/**
 * Configuration including very secret API keys, obiously not for production! ;)
 */
const configs = {
  chatHost: 'ws://vhost3.lnu.se:20080/socket/',
  apiKey: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd',
  defaultChatChannel: 'my, not so secret, channel',
  defaultUsername: 'Dude ⚡',
  maxChatMessages: 100,
  numBackgroundImages: 12,
  animationDuration: 500,
  availableApps: ['memory', 'chat', 'notes', 'settings', 'about'],
  availableThemes: ['light', 'dark', 'minimal', 'weird'],
  availableOptions: {
    autoHide: 'Auto-hide navigation',
    spec: 'Test'
  },
  defaults: {
    theme: 'light',
    background: '/image/backgrounds/0.jpg'
  }
}

export default configs
