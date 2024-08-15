/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@sacred-craft/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  ignorePatterns: ["postcss.config.mjs"],
};
