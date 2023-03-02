module.exports = {
  root: true,

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],

  plugins: ['@typescript-eslint', 'import'],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.base.json', './packages/*/tsconfig.json'],
  },

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {},
    },
  },

  ignorePatterns: ['**/*.js'],

  rules: {
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',

    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      },
    ],
  },
};
