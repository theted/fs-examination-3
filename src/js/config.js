/**
 * Configuration
 */

// The course's chat server (ws://vhost3.lnu.se:20080/socket/) is gone, so the
// chat app is hidden. Point this at a WebSocket server to bring it back.
const chatHost = null

export default {
  chatHost,
  // API key and channel for the course's chat server, obviously not secret ;)
  apiKey: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd',
  defaultChatChannel: 'my, not so secret, channel',
  maxChatMessages: 100,
  numBackgroundImages: 12,
  animationDuration: 180,
  // only offer the chat when there is a server to talk to
  availableApps: [
    'memory',
    chatHost && 'chat',
    'notes',
    'settings',
    'about'
  ].filter(Boolean),
  availableThemes: ['light', 'dark', 'minimal', 'weird'],
  availableOptions: {
    autoHide: 'Hide the dock until you point at it'
  },
  defaults: {
    theme: 'light',
    background: '/image/backgrounds/0.jpg'
  }
}
