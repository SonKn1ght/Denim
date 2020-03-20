'use strict';

var gulp = require('gulp'),
    gp   = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create(),
    include = require("posthtml-include");


gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    browserSync.watch('build',browserSync.reload)
});

gulp.task('sass', function () {
  return gulp.src('src/sass/style.scss')
    // .pipe(gp.plumber())
    .pipe(gp.sourcemaps.init())
    .pipe(gp.sass({}))
    .pipe(gp.autoprefixer(
      ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
      {cascade: true
    }))
    .on("error", gp.notify.onError({
      title: "stile"
    }))

    .pipe(gp.sourcemaps.write())
    .pipe(gulp.dest('build/css/'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gp.csso())
    .pipe(gp.rename("style.min.css"))
    .pipe(gulp.dest("build/css/"));
});



gulp.task("html", function () {
 return gulp.src("src/*.html")
 .pipe(gp.posthtml([
 include()
 ]))
 .pipe(gulp.dest("build"));
});

// .on('end',browserSync.reload); вешать на процессы pu что бы избежать многократной перезагрузки браузера
// .pipe(browserSync.reload({stream:true})); вешать на процесс sass

gulp.task('watch',function () {
  gulp.watch('src/sass/**/*.scss',gulp.series('sass'));
  gulp.watch('src/*.html',gulp.series('html'));
});

gulp.task('default',gulp.series(
  gulp.parallel('sass'),
  gulp.parallel('watch','serve')
));

gulp.task("imagesMin", function () {
   return gulp.src("src/img/**/*.{png,jpg,svg}")
   .pipe(gp.imagemin([
    gp.imagemin.optipng({optimizationLevel: 3}),
    gp.imagemin.jpegtran({progressive: true}),
    gp.imagemin.svgo({
        plugins: [
            {removeViewBox: false},
            {removeUselessStrokeAndFill: false}
        ]
    })
    ]))
   .pipe(gulp.dest("build/img"));
  });


gulp.task("webp", function () {
 return gulp.src("build/img/**/*.{png,jpg}")
 .pipe(gp.webp({quality: 90}))
 .pipe(gulp.dest("build/img/WebP"));
});

gulp.task("sprite", function () {
   return gulp.src("build/img/SVG-*.svg")
   .pipe(gp.svgstore({
      inlineSvg: true
    }))
   .pipe(gp.rename("sprite.svg"))
   .pipe(gulp.dest("build/img"));
});

gulp.task('img',gulp.series(
  gulp.parallel('imagesMin'),
  gulp.parallel('webp','sprite')
));
