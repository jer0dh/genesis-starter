const gulp = require('gulp');
const config = require('../config/');

const gulpSequence = require('gulp-sequence');
const zip = require('gulp-zip');

const getPackageJson = require('../lib/getPackageJson');

/**
 * zip task will compress and create a zip file of the theme_dest folder and place it in themeBackups folder - it will have version and timestamp in name
 * It is not placed in the git repo
 *
 * Manually place zip file to keep indefinitely in the theme_versions folder
 *
 */
gulp.task('zip', function() {

    gulpSequence('clean-theme', 'php-all-tasks', 'js-all-tasks', 'styles-all-tasks', function() {
        let now = new Date(),
            year = now.getUTCFullYear(),
            month = now.getMonth() + 1,
            day = now.getDate(),
            hour = now.getHours(),
            minutes = now.getMinutes(),
            pkg = getPackageJson();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        hour = hour < 10 ? '0' + hour : hour;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let nowString = year + '-' + month + '-' + day + '@' + hour + ':' + minutes;
        let name = pkg.name + '-' + pkg.version + '-' + nowString;

        return gulp.src( config.destFolder + '/**/*' )
            .pipe(zip(name + '.zip'))
            .pipe(gulp.dest( config.themeBackups ));

    });



});