const gulp = require('gulp');
const rsync = require('gulp-rsync');
const sftp = require('gulp-sftp');

const config = require('../config/');

const deployRemote = (src, dest) => {


    if(config.rsync.active) {
        return gulp.src([ config.destination + '/**' ])
            .pipe(rsync({
                hostname: config.rsync.hostname,
                destination: config.rsync.destination  + config.themeName,
                root: config.destination,
                username: config.rsync.username,
                port: config.rsync.port,
                incremental: true,
                progress: true,
                recursive: true,
                //    clean: true,
                exclude: ['.git', '*.scss']
            }))
    }

    if(config.sftp.active) {
        return gulp.src([ src ])
            .pipe(sftp( {
                host: config.sftp.hostname,
                user: config.sftp.username,
                pass: config.sftp.pw,
                port: config.sftp.port,
                remotePath: config.sftp.remotePath + config.themeName + '/' + dest,
            }));
    }
};

module.exports = deployRemote;