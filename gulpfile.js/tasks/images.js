const gulp = require('gulp');
const config = require('../config/');

const deployRemote = require('../lib/deployRemote');


/* IMAGE TASKS
--------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/**
 * Images contained in images/src folder off of project root.  Tasks should compress the images and place them in images/dest.  Since some imaages will be
 * uploaded to WordPress's media library and some will be theme assets, we leave the moving of the compressed images up to the user.
 */

gulp.task('images', function() {
    gulp.src([ config.imagesSrcFolder + '/**/*']).
    pipe(newer( cofig.imagesDestFolder ))
        .pipe(imageMin({
            progressive: true
        }))
        .pipe(gulp.dest( config.imagesDestFolder ));
});

gulp.task('images-all-tasks', ['images'], function(cb) {
    cb();
});

gulp.task('images-clean', function(cb) {
    rimraf( config.imagesDestFolder, cb );
});

gulp.task('images-move', function() {
    gulp.src([config.srcFolder + '/images/**/*'])
        .pipe(gulp.dest( config.destination + '/images'))
});

gulp.task('images-deploy', function() {

    return deployRemote( config.destination + '/images/**/*', '/images' );
});