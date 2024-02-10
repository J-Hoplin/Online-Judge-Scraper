module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  env: {
    node: true,
  },
  rules: {
    'no-constant-condition': 'off',
  },
};
