/* Dependencies
----------------------------------------------------------------- */

var gulp = require('gulp');

var newer = require('gulp-newer');
var rename = require('gulp-rename');
var template = require('gulp-template');
var clean = require('gulp-rimraf');

var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');



/* VARIABLES
--------------------------------------------------------------------------------------------------------------------------------------- */
var pkg = require('./package.json');
var srcFolder = pkg.themeSrcFolder;
var themeName = pkg.name;
var destFolder = pkg.themeDestFolder;
var destination = destFolder + '/' + themeName;

var production = true;

var remote = require( './' + pkg.remote );




/* STYLES TASKS
-------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Creates the style.css in the root of the theme containing theme name, version, etc.  No styles are actually put in here.  For WordPress only
 *
 */
gulp.task('styles-style-css', function(cb) {
    gulp.src([ srcFolder + '/style.scss'])
        .pipe(template({pkg: pkg, production}))
        .pipe(rename(function(path){
            path.extname = '.css'
        }))
        .pipe(gulp.dest( destination ));
        cb();
});


/**
 * Sass Minify - copies minified css version of /css/sass/*.scss
 */
gulp.task('styles-sass-min', function () {
    return gulp.src( srcFolder + '/css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed', sourceMap: true}).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 3 versions']}))
        .pipe(rename(function(path){
            path.extname = '.min.css'
        }))

        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest( destination + '/css'));
});

/**
 * Sass Max - copies un-minified css version of /css/sass/style.scss
 */
gulp.task('styles-sass-max', function () {
    return gulp.src( srcFolder + '/css/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 3 versions']}))
        .pipe(gulp.dest( destination + '/css'));
});


/* PHP TASKS
------------------------------------------------------------------------------------------------------------------------------------- */

gulp.task('php-template-copy', function(cb) {

    gulp.src([srcFolder + '/**/*.php'])
        .pipe(newer( destination ))
        .pipe(template({pkg: pkg, production}))
        .pipe(gulp.dest( destination ));
    cb();
});

gulp.task('php-clean', function(cb){
    gulp.src([destination + '/**/*.php'], {read: false})
        .pipe(clean());
    cb();
});




/* JAVASCRIPT TASKS
------------------------------------------------------------------------------------------------------------------------------------- */
/**
 * vendor folder will be copied to dest as is including non-js files
 * all js (not in jsContcatenatedScripts) under root of js folder will be minified and both copied over to dest
 * all non-js files and folders (excluding 'vendor' ) under root of js will be copied to dest.
 */

// get an array of negated files to exclude js files that will be concatenated
var negatedConcatenatedScripts = pkg.jsConcatenatedScripts.map( function (s) {
   return '!' + s;
});


/**
 * Vendor Scripts & Assets
 * copy all vendor js and assets to destination excluding any js that is in pkg.jsConcatenatedScripts
 */
gulp.task('js-vendor-scripts-assets', function(){
    return gulp.src([srcFolder + '/js/vendor/**/*'].concat( negatedConcatenatedScripts ))
        .pipe(gulp.dest( destination + '/js/vendor/'));
});

/**
 * copy all other js scripts and assets to destination excluding any js that is in pkg.jsConcatentatedScripts and excluding anything under vendor folder
 */
gulp.task('js-other-scripts-assets', function() {
    return gulp.src([srcFolder + '/js/**/*', '!' + srcFolder + '/js/vendor/**/*', '!' + srcFolder + '/js/**/*.min.js'].concat( negatedConcatenatedScripts ))
        .pipe(gulp.dest( destination + '/js/'));
});


/**
 * create and copy to destination a minified js
 */
gulp.task('js-other-scripts-minify', function() {
    return gulp.src([srcFolder + '/js/**/*.js', '!' + srcFolder + '/js/vendor/**/*', '!' + srcFolder + '/js/**/*.min.js'].concat( negatedConcatenatedScripts ))
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['env']}))
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( destination + '/js/'));
});


/**
 * Create Main Concatenated Script file
 *
 * Take array in package.json of js files with paths, run babel, concat, and minify into a file named by jsConcatenatedScriptsName in package.json
 */
gulp.task('js-concat-scripts', function(cb) {
    gulp.src(pkg.jsConcatenatedScripts)
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['env']}))
        .pipe(concat(pkg.jsConcatenatedScriptsName))
        .pipe(gulp.dest( destination + '/js' ))
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( destination + '/js'));
    cb();
});

gulp.task('js-all-tasks', ['js-vendor-scripts-assets', 'js-other-scripts-assets', 'js-other-scripts-minify','js-concat-scripts'], function(cb) {
   cb();
});


