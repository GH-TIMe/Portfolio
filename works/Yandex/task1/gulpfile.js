// npm install --save-dev gulp gulp-sourcemaps gulp-rename gulp-concat gulp-uglify gulp-less less-plugin-autoprefix gulp-clean-css gulp-babel babel-core babel-preset-env del browser-sync
const { watch, src, dest, series } = require("gulp");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const less = require("gulp-less");
const LessAutoprefix = require("less-plugin-autoprefix");
const autoprefix = new LessAutoprefix({ browsers: ["last 15 versions"] });
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync").create();


exports.default = function() {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    watch(["**/*.less", "!node_modules/**", "!vars.less"], { ignoreInitial: false }, formLesstoCss);
    watch("index.html").on("change", browserSync.reload);
    watch(["**/*.js", "!node_modules/**", "!gulpfile.js", "!app/**"], { ignoreInitial: false }, series(clean, buildJs));
}

function formLesstoCss() {
    return src(["**/*.less", "!node_modules/**", "!vars.less"])
        .pipe(sourcemaps.init())
            .pipe(less({
                plugins: [autoprefix]
            }))
            .pipe(rename({ suffix: ".min" }))
            .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(sourcemaps.write("."))
        .pipe(dest("minify/css"))
        .pipe(browserSync.stream({match: '**/*.css'}));
            
}

function clean() {
    return del(["minify/js/"]);
}

function buildJs() {
    return src(["**/*.js", "!node_modules/**", "!gulpfile.js", "!app/**"])
        .pipe(sourcemaps.init())
            .pipe(concat("script.min.js"))
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(dest("minify/js"));
}