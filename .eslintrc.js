module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "react/react-in-jsx-scope": "off",
  },
  globals: {
    React: "writable",
  },
};
