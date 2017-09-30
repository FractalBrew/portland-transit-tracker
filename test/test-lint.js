const path = require("path");
const lint = require("mocha-eslint");

lint(path.dirname(__dirname));
