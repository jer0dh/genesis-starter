const gulp = require('gulp');
const config = require('../config/');

const rimraf = require('rimraf');

/* CLEAN
---------------------------------------------------------------------------------------------------------------------------------------------------------------------  */

gulp.task('clean-theme', function(cb) {
    rimraf( config.destination, cb);
});

gulp.task('clean-all', ['images-clean'], function(cb) {
    rimraf( config.destination, cb );
});

