'use strict';

var gulp = require('gulp');
var debug = require('gulp-debug');
var atch = require('gulp-watch');
var sass = require('gulp-sass'); //not
var importCss = require('gulp-import-css'); //yes
var autoprefixer = require('gulp-autoprefixer'); //yes
var rigger = require('gulp-rigger');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var imageop = require('gulp-image-optimization');
var concat = require('gulp-concat'); //not
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var compass = require('gulp-compass');
var clean = require('gulp-clean'); //not
var notify = require('gulp-notify'); //yes
var plumber = require('gulp-plumber'); //yes
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify'); //yes
var wiredep = require('gulp-wiredep');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var argv = require('yargs').argv;
var browserSync = require('browser-sync').create();
var del = require('del');
var newer = require('gulp-newer'); //yes
var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
var path = {
    frontend: { //Пути исходников
        html: 'frontend/*.html',
        js: 'frontend/js/main.js',
        styles: 'frontend/styles/main.css',
        img: 'frontend/img/**/*.*',
        fonts: 'frontends/fonts/**/*.*'
    },
    public: { // Готовые файлы
        html: 'public/',
        js: 'public/js/',
        css: 'public/css/',
        img: 'public/img/',
        fonts: 'public/fonts/'
    },
    watch: {
        html: 'frontend/**/*.html',
        js: 'frontend/js/**/*.js',
        styles: 'frontend/styles/**/*.*',
        img: 'frontend/img/**/*.*',
        fonts: 'frontend/fonts/**/*.*'
    }
};


gulp.task('styles', function() {
    return gulp.src(path.frontend.styles, { since: gulp.lastRun('styles') })
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(importCss())
        .pipe(gulpIf(isDevelopment, cleanCSS({ compatibility: 'ie8' })))
        .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
        .pipe(gulp.dest(path.public.css))
        .pipe(browserSync.reload({ stream: true }));
});

//gulp.task('clean', function() {
//   return gulp.src('public', { read: false })
//        .pipe(plugins.if(argv.prod, plugins.clean()));
//});
gulp.task('clean', function() {
    return del('public');
});

gulp.task('images', function() {
    return gulp.src(path.frontend.img, { since: gulp.lastRun('images') })
        .pipe(newer(path.public.img))
        .pipe(gulp.dest(path.public.img));
});
gulp.task('fonts', function() {
    return gulp.src(path.frontend.fonts, { since: gulp.lastRun('fonts') })

    .pipe(gulp.dest(path.public.fonts));
});

gulp.task('html', function() {
    return gulp.src(path.frontend.html, { since: gulp.lastRun('html') })
        .pipe(debug({ title: 'html' }))
        .pipe(gulp.dest(path.public.html));
});



gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'html', 'images', 'fonts')));

gulp.task('watch', function() {
    gulp.watch(path.watch.styles, gulp.series('styles'));
    gulp.watch(path.watch.html, gulp.series('html'));
});



gulp.task('serve', function() {
    browserSync.init({
        server: 'public'
    });

    browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));