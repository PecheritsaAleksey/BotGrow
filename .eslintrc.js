module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    'import/order': ['warn', { 'newlines-between': 'always' }],
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
};
