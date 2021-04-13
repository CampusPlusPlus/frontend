module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jasmine: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.lib.json',
    sourceType: 'module',
  },
  ignorePatterns: ['**/*.css.ts'],
  plugins: ['@typescript-eslint', 'jasmine'],
  rules: {
    'accessor-pairs': 'error',
    curly: 'error',
    eqeqeq: 'error',
    'no-var': 'error',
    'template-curly-spacing': ['error', 'always'],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    'key-spacing': ['error', { afterColon: false }],
  },
};
