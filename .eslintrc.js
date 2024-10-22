module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'no-empty-function': 'off',
    'implicit-arrow-linebreak': 'off',
    camelcase: 'off',
    'import/extensions': 'off',
    'max-classes-per-file': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-return-assign': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-sequences': 'off',
    'no-return-await': 'off',
    'no-continue': 'off',
    'no-prototype-builtins': 'off',
    'no-async-promise-executor': 'off',
    'import/no-mutable-exports': 'off',
    'lines-between-class-members': 'off',
    'consistent-return': 'off',
    'no-unused-vars': 'off',
  },
};
