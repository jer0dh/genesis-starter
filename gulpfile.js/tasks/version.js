const gulp = require('gulp');
const config = require('../config/');

const bump = require('gulp-bump');
const semver = require('semver');
const fs = require('fs');  // `fs` is used instead of require to prevent caching in watch (require caches)
const getPackageJson = require('../lib/getPackageJson');
const removeCode = require('gulp-remove-code');
const rename = require('gulp-rename');
const gulpSequence = require('gulp-sequence');
const template = require('gulp-template');



/* this task is run during any gulp watch so getPackageJson is used to bypass normal file caching */
gulp.task('bump', function(){
    let pkg = getPackageJson();
    // increment version
    let newVer = semver.inc(pkg.version, 'prerelease');

    return gulp.src('./package.json')
        .pipe(bump({ version: newVer }))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-patch', function(){
    gulp.src('./package.json')
        .pipe(bump({type:'patch'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-minor', function(){
    gulp.src('./package.json')
        .pipe(bump({type:'minor'}))
        .pipe(gulp.dest('./'));
});


/**
 * Creates the style.css in the root of the theme containing theme name, VERSION, etc.  No styles are actually put in here.  For WordPress only
 *
 */
gulp.task('version-style-css', function() {
    return gulp.src([ config.srcFolder + '/style.scss'])
        .pipe(template({pkg: getPackageJson(), production : config.production }))
        .pipe(rename(function(path){
            path.extname = '.css'
        }))
        .pipe(gulp.dest( config.destination ));
});


gulp.task('version-php-functions-php', function(cb) {

    gulp.src([config.srcFolder + '/functions.php'])
        .pipe(template({pkg: getPackageJson(), production: config.production}))
        .pipe(removeCode(config.removeCodeOptions))
        .pipe(gulp.dest( config.destination ));
    cb();
});

gulp.task('bump-and-push', function(cb) {
    gulpSequence('bump','version-style-css','version-php-functions-php', () => cb() );
});
