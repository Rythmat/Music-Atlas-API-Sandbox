module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:sonarjs/recommended',
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/no-named-as-default-member': 'off',
    'sonarjs/no-duplicate-string': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'import/no-default-export': 'error',
    'import/no-duplicates': 'off',
    'import/no-named-as-default': 'off',
    'import/no-deprecated': 'off',
    'no-duplicate-imports': 'error',
    'no-console': [
      'error',
      { allow: ['info', 'warn', 'error', 'group', 'groupEnd'] },
    ],
    'sonarjs/cognitive-complexity': ['error', 16],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: true,
    },
  },
  overrides: [
    {
      files: ['.eslintrc.js'],
      env: { node: true },
    },
    {
      files: ['./src/schemas/generated/index.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'import/order': 'off',
      },
    },
    {
      files: ['./test/**/*.e2e-spec.ts'],
      rules: {
        'sonarjs/no-duplicate-string': 'off',
      },
    },
    {
      files: ['next.config.ts', 'vitest.config.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};
