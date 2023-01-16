module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true
  },
  extends: ['standard-with-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    project: [
      "./src/tsconfig.json",
      "./test/tsconfig.json"
    ]
  },
  plugins: ['@typescript-eslint']
}
// rules: {
// semi: "error",
// quotes: ["error", "double"],
// "no-undef": "error"
// }
