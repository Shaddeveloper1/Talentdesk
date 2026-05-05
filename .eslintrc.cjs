'use strict';

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    // ── Frontend (React + browser) ──────────────────────────────────────────
    {
      files: ['frontend/**/*.{js,jsx}'],
      env: { browser: true, es2021: true },
      extends: ['airbnb'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      settings: {
        react: { version: 'detect' },
        'import/resolver': {
          node: { extensions: ['.js', '.jsx'] },
        },
      },
      rules: {
        // ESM imports in this project deliberately omit file extensions
        'import/extensions': 'off',
        // React 17+ automatic JSX transform does not require React in scope
        'react/react-in-jsx-scope': 'off',
        // linebreak-style conflicts on Windows checkouts; the repo uses LF via .gitattributes
        'linebreak-style': 'off',
        // AirBnb v19 sets assert:'both' but htmlFor alone is valid HTML association
        'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
      },
    },

    // ── Backend (Node / ESM) ────────────────────────────────────────────────
    {
      files: ['backend/**/*.js'],
      env: { node: true, es2021: true },
      extends: ['airbnb-base'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      rules: {
        'import/extensions': 'off',
        // __filename / __dirname are emulated via fileURLToPath in ESM
        'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
        'linebreak-style': 'off',
      },
    },

    // ── Build / config files (not frontend src, not backend src) ───────────
    {
      files: ['frontend/vite.config.js', 'backend/vitest.config.js'],
      env: { node: true, es2021: true },
      extends: ['airbnb-base'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      rules: {
        'import/extensions': 'off',
        // vitest/config uses package exports that the Node resolver does not resolve
        'import/no-unresolved': ['error', { ignore: ['^vitest'] }],
        // vite / vitest are devDependencies; this is expected in config files
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'linebreak-style': 'off',
      },
    },

    // ── Test files (vitest) ─────────────────────────────────────────────────
    // eslint-plugin-vitest v0.5 only supports flat config (ESLint 9+) and
    // cannot be used here. All vitest globals are explicitly imported in each
    // test file so no extra environment config is needed.
    {
      files: ['**/*.test.{js,jsx}', '**/test-setup.js'],
      env: { node: true },
      rules: {
        // Test setup and test files import devDependencies by design
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'linebreak-style': 'off',
      },
    },
  ],
};
