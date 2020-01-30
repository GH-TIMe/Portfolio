let gulp = require("gulp");
let rename = require("gulp-rename");
let less = require("gulp-less");
let cleanCSS = require("gulp-clean-css");
let LessAutoprefix = require('less-plugin-autoprefix');
let autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
let sourcemaps = require("gulp-sourcemaps");

function lessComp(done) {
    gulp.src("LESS/style.less")
    .pipe( less({
        plugins: [autoprefix]
    }) )
        .on("error", console.log.bind(console))
    .pipe( rename( {suffix: ".comp"} ) )
    .pipe( gulp.dest("CSS/") );
    done();
}

function minifyCss(done) {
    gulp.src("CSS/**/*.comp.css")
    .pipe( sourcemaps.init() )
    .pipe( cleanCSS({compatibility: 'ie8'}) )
    .pipe( rename( {suffix: ".min"} ))
    .pipe( sourcemaps.write("./") )
    .pipe( gulp.dest("CSS/") );
    done();
}

function watchLess() {
    gulp.watch("LESS/style.less", lessComp);
    gulp.watch("CSS/**/*.comp.css", minifyCss);
}

gulp.task("default", watchLess);