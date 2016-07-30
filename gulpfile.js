/**
 * Created by ridel1e on 18/07/16.
 */

'use strict';

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  plumber = require('gulp-plumber'),
  rename = require ('gulp-rename'),
  less = require('gulp-less');

var scriptsSrcPaths = [
  './node_modules/angular-messages/angular-messages.min.js',
  './src/*.module.js',
  './src/**/*.js'
];


// scripts tasks

gulp.task('scripts', function () {
  gulp.src(scriptsSrcPaths)
    .pipe(plumber())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./dist/'))
});

// gulp.task('styles', function () {
//   gulp.src('assets/styles/importer.less')
//     .pipe(less())
//     .pipe(gulp.dest('./build/css'))
//     .pipe(liverelaod());
// });

// watch with reload task

gulp.task('watch', function () {

  gulp.watch(scriptsSrcPaths, ['scripts']);
  
});

// default task

gulp.task('default', ['scripts', 'watch']);