const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');

const defaultTask = (cb) => {

    gulpSequence( 'build', 'watch', cb );

};

gulp.task('default', defaultTask);
module.exports = defaultTask;


