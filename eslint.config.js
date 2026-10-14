import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['dist/', 'test-results/', 'playwright-report/'] },
  js.configs.recommended,
  {
    // modern JavaScript
    rules: {
      eqeqeq: 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error'
    }
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      // no leftover debug logging
      'no-console': ['error', { allow: ['warn', 'error'] }]
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
