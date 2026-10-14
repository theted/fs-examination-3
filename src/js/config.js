/**
 * Configuration including very secret API keys, obiously not for production! ;)
 */
const configs = {
  // The course's chat server (ws://vhost3.lnu.se:20080/socket/) is gone, so the
  // chat app is hidden. Point this at a WebSocket server to bring it back.
  chatHost: null,
  apiKey: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd',
  defaultChatChannel: 'my, not so secret, channel',
  defaultUsername: 'Dude ⚡',
  maxChatMessages: 100,
  numBackgroundImages: 12,
  animationDuration: 500,
  availableApps: ['memory', 'chat', 'notes', 'settings', 'about'],
  availableThemes: ['light', 'dark', 'minimal', 'weird'],
  availableOptions: {
    autoHide: 'Auto-hide navigation'
  },
  defaults: {
    theme: 'light',
    background: '/image/backgrounds/0.jpg'
  }
}

// only offer the chat when there is a server to talk to
configs.availableApps = configs.availableApps.filter(
  (app) => app !== 'chat' || configs.chatHost
)

export default configs
