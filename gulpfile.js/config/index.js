

const getPackageJson = require( '../lib/getPackageJson');

const pkg = getPackageJson();

let sftp;
try {
    sftp = require('../../sftp.json');
} catch (ex) {
    sftp = { active : false };
}

let rsync;
try {
    rsync = require('../../rsync.json');
} catch (ex) {
    rsync = { active: false };
}


const config = {};

config.pkg = pkg;

config.srcFolder = pkg.themeSrcFolder;
config.themeName = pkg.name;
config.destFolder = pkg.themeDestFolder;
config.destination = config.destFolder + '/' + config.themeName;

/* allow specific instances when gulp-remove-code should remove...but ALWAYS remove if production is true */

config.production = false;
config.removeCodeOptions = {
    production : config.production,
    notTesting : config.production || false,
    notTestingPhp : config.production || false,  // change false to true to remove any php testing code.
};

config.rsync = rsync;
config.sftp = sftp;

config.imagesSrcFolder = 'images/src';
config.imagesDestFolder = 'images/dest';

//config.fontSrcFolder = config.srcFolder + '/fonts';
//config.fontDestFolder = config.destination + '/fonts';

config.themeBackups = 'theme_backup';

// For the files template copy task which copies misc files to destination.  This is the list of files NOT to copy as other tasks do it.

config.doNotCopyList = [
    '!' + config.srcFolder + '/css/**/*.*',
    '!' + config.srcFolder + '/images/**/*.*',
    '!' + config.srcFolder + '/js/**/*.*',
    '!' + config.srcFolder + '/**/*.scss',
    '!' + config.srcFolder + '/**/*.php',
    '!' + config.srcFolder + '/svg*/**/*.*'
];

config.jsConcatenatedScriptsName = pkg.jsConcatenatedScriptsName;
config.concatenatedScripts = pkg.jsConcatenatedScripts;
config.concatenatedVendorScripts = pkg.jsConcatenatedVendorScripts;
config.allConcatenatedScripts = config.concatenatedVendorScripts.concat( config.concatenatedScripts );

// get an array of negated files to exclude js files that will be concatenated
config.negatedConcatenatedScripts = config.concatenatedScripts.map( function (s) {
    return '!' + s;
});
config.negatedConcatenatedVendorScripts = config.concatenatedVendorScripts.map( function (s) {
    return '!' + s;
});
config.negatedAllConcatenatedScripts = config.negatedConcatenatedScripts.concat(config.negatedConcatenatedVendorScripts);

config.jsAppPath = `${config.srcFolder}/js/app`;
config.jsAppScript = 'app.js';


/**
 * svgSprite Config
 */

config.svgSrc = 'svg/src/**/*.svg';
config.svgDest = 'svg/dest';
config.svgConfig = {
    shape: {
        dimension: { // Set maximum dimensions
            maxWidth: 32,
            maxHeight: 32
        },
        spacing: { // Add padding
            padding: 2
        },
        transform: ['svgo'],
        dest: config.svgDest + '/intermediate-svg' // Keep the intermediate files
    },
    mode: {
        inline: true,
        view: { // Activate the «view» mode
            bust: false,
            render: {
                scss: true // Activate Sass output (with default options)
            }
        },
        symbol: {
            inline: true
        } // Activate the «symbol» mode
    },

    svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false
    }
};

module.exports = config;