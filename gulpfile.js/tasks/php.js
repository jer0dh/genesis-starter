const gulp = require('gulp');
const config = require('../config/');
const newer = require('gulp-newer');
const removeCode = require('gulp-remove-code');
const template = require('gulp-template');
const clean = require('rimraf');
const getPackageJson = require('../lib/getPackageJson');
const phplint = require('phplint').lint;
const deployRemote = require('../lib/deployRemote');

/* PHP TASKS
------------------------------------------------------------------------------------------------------------------------------------- */

gulp.task('php-template-copy', function(cb) {

    gulp.src([config.srcFolder + '/**/*.php'])
        .pipe(newer( config.destination ))
        .pipe(removeCode( config.removeCodeOptions))
        .pipe(template({pkg: getPackageJson(), production: config.production}))
        .pipe(gulp.dest( config.destination ));
    cb();
});


gulp.task('phplint', function (cb) {
    phplint([config.srcFolder + '/**/*.php'], function (err, stdout, stderr) {
        if (err) {
            cb(err);
            process.exit(1)
        }
        cb()
    })
});

gulp.task('php-all-tasks', ['php-template-copy', 'phplint'], function(cb) {
    cb();
});

gulp.task('php-clean', function(cb){
    gulp.src([config.destination + '/**/*.php'], {read: false})
        .pipe(clean());
    cb();
});


gulp.task('php-deploy', function() {

    return deployRemote( config.destination + '/**/*.php', '' );

});