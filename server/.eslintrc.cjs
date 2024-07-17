module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['tests/**'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {},
};
