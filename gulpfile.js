/* eslint-env node */

const gulp = require("gulp");
const webpack = require("webpack-stream");
const json = require("gulp-json-editor");
const zip = require("gulp-zip");

gulp.task("build-manifest", function() {
  const manifest = require("./package.json");

  return gulp.src("src/manifest.json")
             .pipe(json({
               name: manifest.fullName,
               version: manifest.version,
               description: manifest.description,
             }))
             .pipe(gulp.dest("bin"));
});

gulp.task("build-dist", function() {
  return gulp.src("dist/**")
             .pipe(gulp.dest("bin"));
});

function webpack_js(dir, name) {
  gulp.task(`build-${dir}`, function() {
    return gulp.src(`src/${dir}/${name}`)
               .pipe(webpack({
                 output: {
                   filename: name,
                 },
                 module: {
                   loaders: [
                     { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
                     { test: /\.jsx$/, loader: "babel-loader", exclude: /node_modules/ }
                   ]
                 }
               }))
               .pipe(gulp.dest(`bin/${dir}`));
  });
}

webpack_js("background", "main.js");
webpack_js("panel", "panel.js");
webpack_js("sidebar", "sidebar.js");
webpack_js("lookup", "lookup.js");

gulp.task("build", ["build-manifest", "build-dist", "build-background", "build-panel", "build-sidebar", "build-lookup"]);

gulp.task("package", ["build"], function() {
  const manifest = require("./package.json");

  gulp.src("bin/**/*")
      .pipe(zip(`${manifest.fullName}.xpi`))
      .pipe(gulp.dest("."));
});
