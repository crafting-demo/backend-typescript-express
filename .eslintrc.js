module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:import/recommended",
    "airbnb-base",
    "airbnb-typescript",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "@typescript-eslint/no-use-before-define": "off",
    "import/prefer-default-export": "off",
    "react/jsx-filename-extension": "off",
    "import/no-unresolved": "error",
    "no-await-in-loop": "off",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};
