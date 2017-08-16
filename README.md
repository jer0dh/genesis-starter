# genesis-starter

A gulp based dev environment to help speed up Wordpress theme development using the Genesis Framework

## Folders

### `/images`
Images contained in images/src folder off of project root.  Tasks should compress the images and place them in 
images/dest.  Since some imaages will be uploaded to WordPress's media library and some will be theme assets, we leave 
the moving of the compressed images up to the user.

### `/images_backup`
zip task will compress and create a zip file of the theme_dest folder and place it in this folder. It will have 
version and timestamp in name. 

This is not placed in the git repo.

Manually place zip file to keep indefinitely in the theme_versions folder

### `/theme_dest`
This contains the theme folder to be deployed to WordPress server at `/wp-contents/themes`

This is not in the git repo.

### `/theme_options`
This contains miscellaneous files which has contents many themes may or may not want. 

Manually copy and paste into theme source.  

### `/theme_src`
This is the source of the theme.  Edit these files.

### `/theme_versions`
Manually place zipped files to store in repo

## Gulp Tasks
Most of the options are read from the `package.json` file.  The rest are in the Variable
section of the `gulpfile.js`

#### Style Tasks
  * uses the name, version, etc, from `package.json` and places it into `/style.css` for Wordpress to get the template information.
  * Reads in all /css/*.scss files, runs SASS on them, and produces the css files and minified css files into the `/theme_dest`
  
#### PHP Tasks
  * uses the name, version, and production variables from `package.json` and `gulpfile.js` and fills in
  any underscore templating language in the php files.  For example, in `functions.php` we have php code that
  will serve up the un-minified versions of scripts, but we also include underscore templating to produce
  php code that will always serve up un-minified versions of scripts if `production` is set to `false`:
  ````
  	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '<% if(production){%>.min<% } %>'; 
  	  
  	wp_enqueue_script( 'scripts', get_stylesheet_directory_uri() . "/js/scripts{$suffix}.js", array( 'jquery' ), $version, true );
  ````
  * all php files are copied to `/theme_dest`
  
#### Javascript Tasks
  * all js file are run through babel so can be written with latest JS.
  
  * all js files listed in `package.json` under `jsConcatenatedScripts` will be concatenated and minified into a single file named from `jsConcatenatedScriptsName` and placed
  in `/js` folder.  They will be concatenated in the order they appear in the array. Here's an example:
  ````
    "jsConcatenatedScripts": [
      "node_modules/jquery/dist/jquery.js",
      "theme_src/js/scripts.js",
      "theme_src/js/vendor/test.js"
    ]
  ````
  
  * all files and folders under `/js/vendor` will be copied to `theme_dest` except files listed in `jsConcatenatedScripts`
  
  * all other files and folders under `/js` will be copied to `theme_dest` except for files listed in `jsConcatenatedScripts` 
  and any `*.min.js` files.  All `*.js` files will be run through a minifier and copied to `theme_dest` with `*.min.js` extension.
  
#### Image Tasks
See `/images` folder description

#### Clean Tasks
Used to remove the `theme_dest` destination to remove any files removed from `theme_src`.  This is run during beginning of
default task

#### Deploy Tasks
Uses `gulp-rsync` to sync `theme_dest` to remote server.  Best to have exchanged keys with
remote server so no password has to be entered each time this is run.

`package.json` contains the name of the file containing config needed for this such as `username`, `port`, destination path,
etc.  By default it's called `rsync.json`.  This file name MUST be listed in your `.gitignore` file so it
does not get saved in a public repo.

#### Default and Watches
Default task will run the 'deploy-all-clean' task that cleans the `theme_dest`, runs all the tasks to
refresh the `theme_dest` folder, and then deploys it to remote server.

It watches for changes in `/css/**/*.scss`, `/js/**/*.*`, `/**/*.php`, runs any needed tasks, and deploys.

It watches the `/images/src` folder and minifies any new images.

### Zip task
see `/theme_backups` folder description


### Sticky Nav
  * using [sticky.js](http://stickyjs.com)
  * added `js/vendor/sticky.js` from gitHub. (no npm install)
  * added `js/vendor/sticky.js` to jsContenatedScripts to package.json
  * added `js/scripts.js` code to init sticky.js on `.nav-primary`
  * added `css/supporting/_nav_sticky.scss` to apply any new css needed (added css to move sticky nav down if wp-admin-bar present)
  


## Change Log

###2017-08-16
  * adding Genesis StudioPress Responsive menu.
  * adding sticky nav