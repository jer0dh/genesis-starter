const gulp = require('gulp');
const config = require('../config/');

const svgSprite = require('gulp-svg-sprite');

gulp.task( 'svgSprite' , function() {
    return gulp.src([config.srcFolder + '/' + config.svgSrc])
        .pipe(svgSprite( config.svgConfig ))
        .pipe(gulp.dest( config.srcFolder + '/' + config.svgDest ));
});