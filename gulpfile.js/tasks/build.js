const gulp = require('gulp');
const config = require('../config/');

const gulpSequence = require('gulp-sequence');

gulp.task('build', function(cb) {

    return gulpSequence(

        // remove all files in destination(theme_dest)
        'clean-theme',

        // Using the version in package.json and gulp's templating copy style.css and functions.php to destination with version info
        'version-style-css',
        'version-php-functions-php',

        // Create css from styles.scss and copy to destination
        'styles-sass-min',
        'styles-sass-max',

        // PHPLint the php
        'phplint',

        // After removing in dev code and applying Gulp templating, move all php files to destination
        'php-template-copy',

        // copy all vendor js and assets to destination excluding any js that is in pkg.jsConcatenatedScripts or pkg.jsConcatenatedVendorScripts
        'js-vendor-scripts-assets',

        // copy all other js scripts and assets to destination excluding any js that is in pkg.jsConcatentatedScripts and excluding anything under vendor or app folder
        'js-other-scripts-assets',

        // create and copy to destination a minified js
        'js-other-scripts-minify',

        // Take array in package.json of js files with paths, run babel, concat, and minify. Use jsConcatenatedScriptsName in package.json to name the concantenated js file.
        'js-concat-scripts',

        // Use webpack to package in module javascript
        'js-app',

        // Copy all other files to destination
        'files-template-copy',

        cb

    )

});

