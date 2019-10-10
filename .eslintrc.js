module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "plugin:vue/essential",
    "airbnb-base",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    parser: "babel-eslint"
  },
  plugins: [
    "vue",
  ],
  rules: {
    "no-console": "off",
    "no-param-reassign": [2, { "props": false }],
    "import/no-unresolved": "off"
  },
};
