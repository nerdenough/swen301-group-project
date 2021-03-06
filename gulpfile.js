'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var mocha = require('gulp-mocha');

gulp.task('default', ['watch', 'sass']);

gulp.task('sass', function() {
  return gulp
    .src('./sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function() {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('test', function() {
  return gulp
    .src('./tests/**/*.js')
    .pipe(mocha())
});
