var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var run = require("run-sequence");


gulp.task("style", function() {
    gulp.src("source/sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest("source/css"))
        .pipe(server.stream());
});


gulp.task("serve", function() {
    server.init({
        server: "source/",
        index: "photo.html",
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
    gulp.watch("source/*.html", ["html"])
        .on("change", server.reload);
});


gulp.task("html", function() {
    return gulp.src("source/*.html")
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest("source"));
});


gulp.task("sprite", function() {
    return gulp.src("source/img/svg/icon-*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("source/img/svg"));
});


gulp.task("build", function(done){
    run("style", "sprite", "html", done);
});
