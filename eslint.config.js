import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['dist/', 'test-results/', 'playwright-report/'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      // unused event/callback parameters are fine in DOM handlers
      'no-unused-vars': ['error', { args: 'none' }]
    }
  },
  {
    // tests run in Node, with callbacks evaluated in the browser
    files: ['tests/**/*.js', '*.config.js'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser }
    }
  }
]
