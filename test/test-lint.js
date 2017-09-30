import path from "path";
import lint from "mocha-eslint";

lint(path.dirname(__dirname));
