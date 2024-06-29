// import globals from "globals";
// import pluginJs from "@eslint/js";
// import tseslint from "typescript-eslint";
// import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

// export default [
//   { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
//   { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
//   { languageOptions: { globals: globals.browser } },
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   pluginReactConfig,
// ];

import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { fixupPluginRules } from "@eslint/compat";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginJs from "@eslint/js";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ...eslintPluginReactConfig,
    settings: {
      version: "detect",
    },
  },
  {
    languageOptions: {
      ...eslintPluginReactConfig.languageOptions,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
  },
  {
    plugins: {
      eslintPluginReact,
      "react-hooks": fixupPluginRules(eslintPluginReactHooks),
      "react-refresh": fixupPluginRules(eslintPluginReactRefresh),
    },
  },
  {
    rules: {
      ...eslintPluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...eslintPluginReactConfig.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
);
