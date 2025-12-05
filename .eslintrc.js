module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'no-debugger': 'off',
  },
  globals: {
    // Burada eklemek istediğiniz global değişkenler olabilir (örneğin: window, document gibi tarayıcı ortamı değişkenleri)
  },
};