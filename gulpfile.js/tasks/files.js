const gulp = require('gulp');
const config = require('../config/');

const newer = require('gulp-newer');

gulp.task( 'files-template-copy' , function() {
    return gulp.src([config.srcFolder + '/**/*.*'].concat(config.doNotCopyList))
    .pipe(newer( config.destination ))    // only copy if not in destination.
    .pipe(gulp.dest( config.destination ));
});

