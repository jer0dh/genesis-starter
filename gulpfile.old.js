/* Dependencies
----------------------------------------------------------------- */

const gulp = require('gulp');
const runSequence = require('run-sequence');

const newer = require('gulp-newer');
const rename = require('gulp-rename');
const template = require('gulp-template');
const clean = require('gulp-rimraf'); // remove files using gulp globs
const rimraf = require('rimraf'); // remove directories
const zip = require('gulp-zip');

const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const phplint = require('phplint').lint;

const rsync = require('gulp-rsync');
const prettier = require('gulp-prettier');
const filter = require('gulp-filter');

const removeCode = require('gulp-remove-code');

const filesExist = require('files-exist');

const gulpif = require('gulp-if');
const sftp = require('gulp-sftp');

try {
    const sftpConfig = require('./sftp.json');
} catch (ex) {
    const sftpConfig = { send : "false" };
}


/* VARIABLES
--------------------------------------------------------------------------------------------------------------------------------------- */

const pkg = require('./package.json');

const srcFolder = pkg.themeSrcFolder;
const themeName = pkg.name;
const destFolder = pkg.themeDestFolder;
const destination = destFolder + '/' + themeName;

/* allow specific instances when gulp-remove-code should remove...but ALWAYS remove if production is true */

const production = false;
const removeCodeOptions = {
    production : production,
    notTesting : production || false,
    notTestingPhp : production || false,  // change false to true to remove any php testing code.
};

const remote = require( './' + pkg.remote );

const imagesSrcFolder = 'images/src';
const imagesDestFolder = 'images/dest';

const fontSrcFolder = srcFolder + '/fonts';
const fontDestFolder = destination + '/fonts';

const themeBackups = 'theme_backup';


/* Versioning
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
const bump = require('gulp-bump');
const semver = require('semver');
const fs = require('fs');  // `fs` is used instead of require to prevent caching in watch (require caches)

const getPackageJson = function () {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

/* this task is run during any gulp watch so getPackageJson is used to bypass normal file caching */
gulp.task('bump', function(){
    let pkg = getPackageJson();
    // increment version
    let newVer = semver.inc(pkg.version, 'prerelease');

    return gulp.src('./package.json')
        .pipe(bump({ version: newVer }))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-patch', function(){
    gulp.src('./package.json')
        .pipe(bump({type:'patch'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-minor', function(){
    gulp.src('./package.json')
        .pipe(bump({type:'minor'}))
        .pipe(gulp.dest('./'));
});


/**
 * Creates the style.css in the root of the theme containing theme name, VERSION, etc.  No styles are actually put in here.  For WordPress only
 *
 */
gulp.task('style-css-version', function() {
    return gulp.src([ srcFolder + '/style.scss'])
        .pipe(template({pkg: getPackageJson(), production}))
        .pipe(rename(function(path){
            path.extname = '.css'
        }))
        .pipe(gulp.dest( destination ));
});


gulp.task('php-functions-php-version', function(cb) {

    gulp.src([srcFolder + '/functions.php'])
        .pipe(template({pkg: getPackageJson(), production}))
        .pipe(removeCode(removeCodeOptions))
        .pipe(gulp.dest( destination ));
    cb();
});

gulp.task('bump-and-push', function(cb) {
    runSequence('bump','style-css-version','php-functions-php-version', () => cb() );
});


/* STYLES TASKS
-------------------------------------------------------------------------------------------------------------------------------------- */




/**
 * Sass Minify - copies minified css version of /css/sass/*.scss
 */
gulp.task('styles-sass-min', function () {
    return gulp.src( srcFolder + '/css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed', sourceMap: true}).on('error', sass.logError))
        .pipe(autoprefixer({}))  // browsers: ['last 4 versions']
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
        .pipe(autoprefixer()) //flexbox: "no-2009",browsers: ['last 4 versions']
        .pipe(gulp.dest( destination + '/css'));
});


gulp.task('styles-all-tasks', ['style-css-version','styles-sass-min', 'styles-sass-max' ], function(cb) {
    cb();
});


gulp.task('styles-clean', function(cb) {
    rimraf( destination + '/css', cb );
});



/* PHP TASKS
------------------------------------------------------------------------------------------------------------------------------------- */

gulp.task('php-template-copy', function(cb) {

    gulp.src([srcFolder + '/**/*.php'])
        .pipe(newer( destination ))
        .pipe(removeCode(removeCodeOptions))
        .pipe(template({pkg: getPackageJson(), production}))
        .pipe(gulp.dest( destination ));
    cb();
});

gulp.task('php-all-tasks', ['php-template-copy', 'phplint'], function(cb) {
    cb();
});

gulp.task('php-clean', function(cb){
    gulp.src([destination + '/**/*.php'], {read: false})
        .pipe(clean());
    cb();
});


gulp.task('phplint', function (cb) {
    phplint([srcFolder + '/**/*.php'], function (err, stdout, stderr) {
        if (err) {
            cb(err)
            process.exit(1)
        }
        cb()
    })
});

gulp.task('test', ['phplint'])


/* MISC FILES TASKS
------------------------------------------------------------------------------------------------------------------------------------------------- */

// This should copy any other directories and non-php or non-scss files anywhere the template src except the standard directories of css, fonts, images, and js. We
// will let the other tasks deal with those standard directories.
// Since these normally do not change, we will only do this task as the default task and not as a watch

gulp.task('files-template-copy', function(cb) {

    const doNotCopyList = [
        '!' + srcFolder + '/css/**/*.*',
        '!' + srcFolder + '/fonts/**/*.*',
        '!' + srcFolder + '/images/**/*.*',
        '!' + srcFolder + '/js/**/*.*',
        '!' + srcFolder + '/**/*.scss',
        '!' + srcFolder + '/**/*.php',
    ];

    gulp.src([srcFolder + '/**/*.*'].concat(doNotCopyList))
        .pipe(newer( destination ))    // only copy if not in destination.
        .pipe(gulp.dest( destination ));
    cb();
});

/* JAVASCRIPT TASKS
------------------------------------------------------------------------------------------------------------------------------------- */
/**
 * vendor folder will be copied to dest as is, including non-js files
 * all js (not in jsContcatenatedScripts nor in jsConcatenatedVendorScripts) under root of js folder will be minified and both copied over to dest
 * all non-js files and folders (excluding 'vendor' ) under root of js will be copied to dest.
 */
//get array with all scripts and vendor scripts to be concatenated...vendor scripts first
    var concatenatedScripts = pkg.jsConcatenatedScripts;
    var concatenatedVendorScripts = pkg.jsConcatenatedVendorScripts;

    var allConcatenatedScripts = concatenatedVendorScripts.concat( concatenatedScripts);


// get an array of negated files to exclude js files that will be concatenated
var negatedConcatenatedScripts = concatenatedScripts.map( function (s) {
   return '!' + s;
});
var negatedConcatenatedVendorScripts = concatenatedVendorScripts.map( function (s) {
    return '!' + s;
});
var negatedAllConcatenatedScripts = negatedConcatenatedScripts.concat(negatedConcatenatedVendorScripts);

/**
 * Vendor Scripts & Assets
 * copy all vendor js and assets to destination excluding any js that is in pkg.jsConcatenatedScripts or pkg.jsConcatenatedVendorScripts
 */
gulp.task('js-vendor-scripts-assets', function(){
    return gulp.src([srcFolder + '/js/vendor/**/*'].concat( negatedAllConcatenatedScripts ))
        .pipe(gulp.dest( destination + '/js/vendor/'));
});

/**
 * copy all other js scripts and assets to destination excluding any js that is in pkg.jsConcatentatedScripts and excluding anything under vendor folder
 */
gulp.task('js-other-scripts-assets', function() {
    return gulp.src([srcFolder + '/js/**/*', '!' + srcFolder + '/js/vendor/**/*', '!' + srcFolder + '/js/**/*.min.js'].concat( negatedAllConcatenatedScripts ))
        .pipe(gulp.dest( destination + '/js/'));
});


/**
 * create and copy to destination a minified js
 */
gulp.task('js-other-scripts-minify', function() {
    return gulp.src([srcFolder + '/js/**/*.js', '!' + srcFolder + '/js/vendor/**/*', '!' + srcFolder + '/js/**/*.min.js'].concat( negatedAllConcatenatedScripts ))
        .pipe(sourcemaps.init())
        .pipe(removeCode(removeCodeOptions))
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
    const noVendorFilter = filter(negatedConcatenatedVendorScripts.concat(concatenatedScripts), {restore: true});  //only script files and remove vendor scripts temporarily while babel is run

    gulp.src(filesExist(allConcatenatedScripts))
        .pipe(sourcemaps.init())
        .pipe(removeCode(removeCodeOptions))
        .pipe(noVendorFilter)
        .pipe(babel({ presets: ['env']}))
        .pipe(noVendorFilter.restore)
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

/**
 * Prettier
 */

gulp.task('js-prettier', function(){
    return gulp.src([srcFolder + '/js/*.js','!' + srcFolder + '/js/*.min.js'])
        .pipe(prettier({tabWidth:4, singleQuote: true}))
        .pipe(gulp.dest(srcFolder + '/js'))
})

gulp.task('js-clean', function(cb) {
    rimraf( destination + '/js', cb );
});
/* FONT TASKS
------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
gulp.task('fonts', function() {
    gulp.src([ fontSrcFolder + '/**/*'])
        //.pipe(newer( fontDestFolder ))

        .pipe(gulp.dest( fontDestFolder ));
});


/* IMAGE TASKS
--------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/**
 * Images contained in images/src folder off of project root.  Tasks should compress the images and place them in images/dest.  Since some imaages will be
 * uploaded to WordPress's media library and some will be theme assets, we leave the moving of the compressed images up to the user.
 */

gulp.task('images', function() {
    gulp.src([ imagesSrcFolder + '/**/*']).
    pipe(newer( imagesDestFolder ))
        .pipe(imageMin({
            progressive: true
        }))
        .pipe(gulp.dest( imagesDestFolder ));
});

gulp.task('images-all-tasks', ['images'], function(cb) {
    cb();
});

gulp.task('images-clean', function(cb) {
    rimraf( imagesDestFolder, cb );
});

gulp.task('images-move', function() {
   gulp.src([srcFolder + '/images/**/*'])
       .pipe(gulp.dest( destination + '/images'))
});

/* CLEAN
---------------------------------------------------------------------------------------------------------------------------------------------------------------------  */

gulp.task('clean-theme', function(cb) {
    rimraf( destination, cb);
});

gulp.task('clean-all', ['images-clean'], function(cb) {
    rimraf( destination, cb );
});



/* DEPLOY TASKS
---------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
const rsyncing = sftpConfig.send !== "true";

var rsyncRemote = function() {
    return gulp.src([ destination + '/**'])
        .pipe(gulpif(rsyncing, rsync({
            hostname: remote.hostname,
            //          destination: '~/public_html/wp-content/themes/' + themeName,
            //         destination: '~/staging/3/wp-content/themes/' + themeName,
            destination: remote.destination  + themeName,
            root: destination,
            username: remote.username,
            port: remote.port,
            incremental: true,
            progress: true,
            recursive: true,
            //    clean: true,
            exclude: ['.git', '*.scss']
        })))
        .pipe(gulpif(sftpConfig.send === "true", sftp( {
            host: sftpConfig.hostname,
            user: sftpConfig.username,
            pass: sftpConfig.pw,
            port: sftpConfig.port,
            remotePath: sftpConfig.destination + themeName + '/',

        })));

};

gulp.task('deploy-remote', rsyncRemote );

gulp.task('deploy-js', ['js-all-tasks'], rsyncRemote );

gulp.task('deploy-php', ['php-all-tasks'], rsyncRemote );

gulp.task('deploy-styles', ['styles-all-tasks'], rsyncRemote );

gulp.task('bump-deploy-js', ['bump-and-push','js-all-tasks'], rsyncRemote );

gulp.task('bump-deploy-php', ['bump-and-push','php-all-tasks'], rsyncRemote );

gulp.task('bump-deploy-styles', ['bump-and-push','styles-all-tasks'], rsyncRemote );


gulp.task('deploy-all', function(cb) {
    runSequence('php-all-tasks', 'js-all-tasks', 'styles-all-tasks', 'images-move', 'deploy-remote', () => cb() );
});

gulp.task('bump-deploy-all', function(cb) {
    runSequence( 'bump','php-all-tasks', 'js-all-tasks', 'styles-all-tasks', 'deploy-remote', () => cb() );
});

gulp.task('deploy-all-clean', function(cb) {
    runSequence('clean-theme', 'fonts', 'files-template-copy','php-all-tasks', 'js-all-tasks', 'styles-all-tasks', 'images-move', 'deploy-remote', () => cb() );
});

gulp.task('deploy-images', ['images-move'], rsyncRemote );


/* DEFAULT and WATCHES
---------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

gulp.task('default', ['deploy-all-clean'], function() {

    gulp.watch([srcFolder + '/css/**/*.scss'], ['bump-deploy-styles']);
    gulp.watch(srcFolder +'/js/**/*.*', ['bump-deploy-js']);
    gulp.watch(srcFolder + '/**/*.php', ['bump-deploy-php']);
    gulp.watch(imagesSrcFolder + '/**/*', ['images']);

});


/* Misc
----------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/**
 * zip task will compress and create a zip file of the theme_dest folder and place it in themeBackups folder - it will have version and timestamp in name
 * It is not placed in the git repo
 *
 * Manually place zip file to keep indefinitely in the theme_versions folder
 *
 */
gulp.task('zip', function() {

    runSequence('clean-theme', 'php-all-tasks', 'js-all-tasks', 'styles-all-tasks', function() {
        let now = new Date(),
            year = now.getUTCFullYear(),
            month = now.getMonth() + 1,
            day = now.getDate(),
            hour = now.getHours(),
            minutes = now.getMinutes();
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        hour = hour < 10 ? '0' + hour : hour;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let nowString = year + '-' + month + '-' + day + '@' + hour + ':' + minutes;
        let name = pkg.name + '-' + pkg.version + '-' + nowString;

        return gulp.src( destFolder + '/**/*' )
            .pipe(zip(name + '.zip'))
            .pipe(gulp.dest( themeBackups ));

    });



});