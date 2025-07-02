export default [
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module"
    },
    env: {
      node: true,
      es2021: true
    },
    rules: {
      "no-unused-vars": ["warn"],
      "no-console": "off"
    }
  }
];
