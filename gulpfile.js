const gulp = require("gulp");
const webpack = require("webpack-stream");
const json = require("gulp-json-editor");

gulp.task("build-manifest", function() {
  const package = require("./package.json");

  return gulp.src("src/manifest.json")
             .pipe(json({
               name: package.name,
               version: package.version,
               description: package.description,
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
