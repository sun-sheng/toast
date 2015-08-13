var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var compass = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');

gulp.task('concat-js', function ()
{
    return gulp.src([
        'src/module-start.js',
        'src/toast-utils.js',
        'src/toast-dom.js',
        'src/toast-main.js',
        'src/module-end.js'
    ]).pipe(
        concat('toast.js')
    ).pipe(
        gulp.dest('dist/')
    )
});

gulp.task('uglify', ['concat-js'], function ()
{
    return gulp.src(
        'dist/toast.js'
    ).pipe(
        uglify()
    ).pipe(
        rename('toast.min.js')
    ).pipe(
        gulp.dest('dist/')
    );
});

gulp.task('compass', function ()
{
    return gulp.src(
        './src/toast.scss'
    ).pipe(
        compass({
            project: path.join(__dirname),
            css: 'dist',
            sass: 'src'
        })
    );
});

gulp.task('minify-css', ['compass'], function ()
{
    return gulp.src(
        './dist/toast.css'
    ).pipe(
        minifyCSS()
    ).pipe(
        rename('toast.min.css')
    ).pipe(
        gulp.dest('dist/')
    );
});


gulp.task('watch', function ()
{
    gulp.watch(['./src/*.js'], ['uglify']);
    gulp.watch('./src/toast.scss', ['minify-css']);
});

gulp.task('dev', ['uglify', 'minify-css'], function ()
{
    gulp.start('watch');
});

gulp.task('dist', ['uglify', 'minify-css']);
