import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node, // Add Node.js globals
      },
    },
  },
  { languageOptions: { globals: globals.browser } }, // Keep browser globals if needed
  pluginJs.configs.recommended,
];