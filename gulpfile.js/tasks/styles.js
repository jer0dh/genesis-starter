const gulp = require('gulp');


const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const config = require('../config/');

const deployRemote = require('../lib/deployRemote');

/* STYLES TASKS
-------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Sass Minify - copies minified css version of /css/sass/*.scss
 */
gulp.task('styles-sass-min', function () {
    return gulp.src( config.srcFolder + '/css/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed', sourceMap: true}).on('error', sass.logError))
        .pipe(autoprefixer({}))  // browsers: ['last 4 versions']
        .pipe(rename(function(path){
            path.extname = '.min.css'
        }))

        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( config.destination + '/css'));
});

/**
 * Sass Max - copies un-minified css version of /css/sass/style.scss
 */
gulp.task('styles-sass-max', function () {
    return gulp.src( config.srcFolder + '/css/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer()) //flexbox: "no-2009",browsers: ['last 4 versions']
        .pipe(gulp.dest( config.destination + '/css'));
});


gulp.task('styles-deploy', function() {

    return deployRemote( config.destination + '/css/**/*', '/css' );

});

