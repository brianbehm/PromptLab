// ESLint 9+ Flat Config

/** @type {import("eslint").Linter.FlatConfig} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module"
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      // Add your custom rules here
    },
    plugins: {
      // Add plugins here if needed
    },
    settings: {},
  },
  {
    ignores: ["node_modules/**"]
  }
];
