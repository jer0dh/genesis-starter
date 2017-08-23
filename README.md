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
  * added code in `js/scripts.js` to init sticky.js on `.nav-primary`
  * added `css/supporting/_nav_sticky.scss` to apply any new css needed (added css to move sticky nav down if wp-admin-bar present)
  
  
## Theme Options 

  
### Background Slider
  * using [backstretch.js](https://github.com/jquery-backstretch/jquery-backstretch)
  * add `theme_options/js/vendor/jQuery.backstretch.js` to `theme_src/js/src/vendor`.  Add `vendor/jQuery.backstretch.js` to `jsConcatenatedScripts` in `package.json`
  * `theme_options/lib/backstretch.php` contains possible php code to help with customizing backstretch
    * a `div` with class `backstretch_overlay` to put a gradient on top of the images
    * an example of using an Advanced Custom Fields Gallery so the user can choose images and creating a local js 
        variable with the url's of these images
  * add `theme_options/css/supporting/backstretch.scss` to `theme_src/css/supporting` 
     * only needed to style if adding overlay ontop of images
     * contains the style to apply to `.backstretch_overly`
     * add `@import "supporting/backstretch";` to `theme_src/css/style.css` 
  
  * add js code to start backstretch on the element you want with an array of images.  See above link for syntax.
 
 
### Bootstrap options
A great way to get some of the css classes of bootstrap like the grid and responsive classes. In the past I've added the
bootstrap modal css and created a boostrap.js file with only the modal code using [Boostrap's website](http://getbootstrap.com/).
  * add `theme_options/css/supporting/bootstrap` to `theme_src/css/supporting` (or download latest)
  * add `theme_options/css/supporting/bootstrap.scss` to `theme_src/css/supporting` and edit it to import in only the bootstrap items you need.
  * add `@import "supporting/boostrap"` to the `theme_src/css/style.scss`
  * if some of the features needed need javascript, obtain the bootstrap.js file, place in `theme_src/js/vendor`, 
  and add `vendor/bootstrap.js` to `jsConcatenatedScripts` in `package.json`
  * Another way to add the latest bootstrap would be to `npm install bootstrap --save` and copy from `node_modules` to `theme_src`. 
  Or use the full path to the code under `node_modules` above.
  * Another great way of using bootstrap and genesis would be to use [this starter theme](https://github.com/salcode/bootstrap-genesis)
   
### Carousel - [Slick.js](https://github.com/kenwheeler/slick/) 
  * install slick.js: `npm install slick-carousel --save` 
  * copy `node_modules/slick-carousel/slick/slick.scss` to `theme_src/css/supporting` and add
  `@import "supporting/slick.scss` to `style.scss`
  * follow the step above with `slick-theme.scss` if you want slick's default styling
  * add `node_modules/slick-carousel/slick/slick.js` to `jsConcatenatedScripts` in `package.json`
  * add php code to produce the markup needed by slick.js
  * add javascript code in `theme_src/js/my_scripts.js` to initialize slick on the element's markup

### Infinite Scroll - using [modified Bill Erickson code](https://www.billerickson.net/infinite-scroll-in-wordpress/)
  * copy `theme_options/js/infinite-scroll.js` to `theme_src/js`
  * add `theme_src/js/infinite-scroll.js` to `jsConcatenatedScripts` in `package.json`
  * copy `theme_options/lib/infinite-scroll.php` to `theme_src/lib`
  * add to `functions.php`:
  ```php
  //* Infinite Scroll functions
  require_once( get_stylesheet_directory() . '/lib/infinite-scroll.php' );
  ```
  * see notes in files on altering
  
### Scroll to section of page using [jQuery.scrollTo](https://github.com/flesler/jquery.scrollTo)
  * install jQuery.scrollTo: `npm install jquery.scrollto --save`
  * add `node_modules/jquery.scrollto/jquery.scrollTo.js` to `jsConcatenatedScripts` in `package.json`
  * in `theme_src/js/my_scripts.js` add the javascript to perform the scrolling
  
### Theme Customization panel
This option can be added to quickly add settings and options on the WordPress Theme Customize panel under Appearance | Customize.

  * add `theme_options/lib/customization.php` to `theme_src` and `include` it in the functions.php
  * add `theme_options/lib/customization.js` to `theme_src/js` and make sure `customization.php` contains the correct path to enqueue it.
  * alter these files to include the settings/controls you want to add
  * [Great article on creating these settings](https://premium.wpmudev.org/blog/wordpress-theme-customization-api/)
  * [WordPress Docs on Theme Customization API](https://codex.wordpress.org/Theme_Customization_API)

### Page builder option
Have not used it but it has a large 1 million+ installs, it's free, and compatible with all themes.
[Page Builder by SiteOrigin](https://wordpress.org/plugins/siteorigin-panels/)


## Change Log

###2017-08-23
  * Instructions on adding slick-carousel to theme
  
###2017-08-22
  * adding Theme Customization panel code
  * adding backstretch.js code options
  
###2017-08-16
  * adding Genesis StudioPress Responsive menu.
  * adding sticky nav
  
