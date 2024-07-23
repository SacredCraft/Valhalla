/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@sacred-craft/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "turbo/no-undeclared-env-vars": [
      "error",
      {
        allowList: ["NODE_ENV"],
      },
    ],
  },
  ignorePatterns: ["postcss.config.mjs"],
};
