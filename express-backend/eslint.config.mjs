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
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "no-unused-vars": "off",
    },
  },
  { 
    languageOptions: { 
      globals: globals.browser 
    } 
  }, // Keep browser globals if needed
  pluginJs.configs.recommended,
];