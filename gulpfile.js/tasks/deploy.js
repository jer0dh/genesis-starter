const gulp = require('gulp');
const config = require('../config/');
const deployRemote = require('../lib/deployRemote');


gulp.task('deploy-all', function() {
    return deployRemote(config.srcFolder + '/**/*', '/');
});