import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['dist/'] },
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
  }
]
