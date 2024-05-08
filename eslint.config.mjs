import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import EslintPluginImport from "eslint-plugin-import";
// import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

/** @type {import('eslint').Linter.Config} */
export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    plugins: { import: EslintPluginImport },
    rules: {
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
  // pluginReactConfig,
];
