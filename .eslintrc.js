module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "webextensions": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parserOptions": {
    "ecmaVersion": 8,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "indent": ["error", 2, {
      "SwitchCase": 1,
      "MemberExpression": "off",
    }],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "no-console": ["error", { allow: ["warn", "error"] }],

    "react/prop-types": "off"
  }
};