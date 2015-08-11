var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var compass = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');

gulp.task('uglify', function ()
{
    return gulp.src(
        'src/toast.js'
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
            css: 'src',
            sass: 'src'
        })
    );
});

gulp.task('minify-css', ['compass'], function ()
{
    return gulp.src(
        './src/toast.css'
    ).pipe(
        minifyCSS()
    ).pipe(
        rename('toast.min.css')
    ).pipe(
        gulp.dest('dist/')
    );
});

gulp.task('dev', function ()
{
    gulp.watch('./src/toast.js', ['uglify']);
    gulp.watch('./src/toast.scss', ['minify-css']);
});

gulp.task('dist', ['uglify', 'minify-css']);