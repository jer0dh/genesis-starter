const gulp = require('gulp');
const config = require('../config/');

const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const removeCode = require('gulp-remove-code');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const filter = require('gulp-filter');
const filesExist = require('files-exist');

const webpack = require('webpack');
const webpackStream = require( 'webpack-stream');
const webpackConfig = require( '../../webpack.config.js');

const deployRemote = require('../lib/deployRemote');

/**
 * Vendor Scripts & Assets
 * copy all vendor js and assets to destination excluding any js that is in pkg.jsConcatenatedScripts or pkg.jsConcatenatedVendorScripts
 */
gulp.task('js-vendor-scripts-assets', function(){
    return gulp.src([config.srcFolder + '/js/vendor/**/*'].concat( config.negatedAllConcatenatedScripts ))
        .pipe(gulp.dest( config.destination + '/js/vendor/'));
});



/**
 * copy all other js scripts and assets to destination excluding any js that is in pkg.jsConcatentatedScripts and excluding anything under vendor or app folder
 */
gulp.task('js-other-scripts-assets', function() {
    return gulp.src([config.srcFolder + '/js/**/*', '!' + config.srcFolder + '/js/vendor/**/*', '!' + config.jsAppPath +'/**/*'].concat( config.negatedAllConcatenatedScripts ))
        .pipe(gulp.dest( config.destination + '/js/'));
});


/**
 * create and copy to destination a minified js
 */
gulp.task('js-other-scripts-minify', function() {
    return gulp.src([config.srcFolder + '/js/**/*.js', '!' + config.srcFolder + '/js/vendor/**/*', '!' + config.srcFolder + '/js/**/*.min.js', '!' + config.jsAppPath +'/**/*'].concat( config.negatedAllConcatenatedScripts ))
        .pipe(sourcemaps.init())
        .pipe(removeCode(config.removeCodeOptions))
        .pipe(babel({ presets: ['env']}))
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( config.destination + '/js/'));
});

/**
 * Create Main Concatenated Script file
 *
 * Take array in package.json of js files with paths, run babel, concat, and minify into a file named by jsConcatenatedScriptsName in package.json
 */


gulp.task('js-concat-scripts', function(cb) {
    const noVendorFilter = filter(config.negatedConcatenatedVendorScripts.concat(config.concatenatedScripts), {restore: true});  //only script files and remove vendor scripts temporarily while babel is run

    gulp.src(filesExist(config.allConcatenatedScripts))
        .pipe(sourcemaps.init())
        .pipe(removeCode(config.removeCodeOptions))
        .pipe(noVendorFilter)
        .pipe(babel({ presets: ['env']}))
        .pipe(noVendorFilter.restore)
        .pipe(concat(config.jsConcatenatedScriptsName))
        .pipe(gulp.dest( config.destination + '/js' ))
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( config.destination + '/js'));
    cb();
});


/**
 *  JS app.  Using webpack to package the modules.

 */

gulp.task('js-app', function() {

    return gulp.src([config.jsAppPath + '/' + config.jsAppScript])
        .pipe(sourcemaps.init())
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest( config.destination + '/js/app'))
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( config.destination + '/js/app'));

});


gulp.task('js-clean', function(cb) {
    rimraf( config.destination + '/js', cb );
});

/**
 * Prettier
 */

gulp.task('js-prettier', function(){
    return gulp.src([srcFolder + '/js/*.js','!' + srcFolder + '/js/*.min.js'])
        .pipe(prettier({tabWidth:4, singleQuote: true}))
        .pipe(gulp.dest(srcFolder + '/js'))
});


gulp.task('js-deploy', function() {

    return deployRemote( config.destination + '/js/**/*', '/js' );

});
