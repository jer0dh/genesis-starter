

const gulp = require('gulp');
const config = require('../config/');
const gulpSequence = require('gulp-sequence');


gulp.task('watch-styles-tasks', function(cb) {
   return gulpSequence('bump-and-push', 'styles-sass-min', 'styles-sass-max', 'styles-deploy', cb);
});

gulp.task('watch-javascript-tasks', function(cb) {
   return gulpSequence('bump-and-push', 'js-vendor-scripts-assets', 'js-other-scripts-assets','js-other-scripts-minify', 'js-concat-scripts', 'js-deploy', cb);
});

gulp.task('watch-javascript-app-tasks', function(cb) {
   return gulpSequence('bump-and-push', 'js-app', 'js-deploy', cb);
});

gulp.task('watch-php-tasks', function(cb) {
   return gulpSequence('bump-and-push', 'phplint','php-template-copy', 'php-deploy', cb);
});

gulp.task('watch-images-tasks', function(cb) {
   return gulpSequence('images-move', 'images-deploy', cb);
});


gulp.task('watch', function() {

    gulp.watch([config.srcFolder + '/css/**/*.scss'], ['watch-styles-tasks']);

    gulp.watch([config.srcFolder + '/js/**/*', '!' + config.jsAppPath +'/**/*'], ['watch-javascript-tasks']);

    gulp.watch([config.jsAppPath + '/**/*'], ['watch-javascript-app-tasks']);

    gulp.watch([config.srcFolder + '/**/*.php'], ['watch-php-tasks']);

    gulp.watch([config.srcFolder + '/images/**/*'], ['watch-images-tasks']);

});