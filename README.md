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
This ever growing list of options are common client website needs.  They are not added to the `theme_src` but
can be using the instructions below.  The basic instructions are
  * install the javascript library needed either in the `/js/vendor` directory or via `npm`
  and place the file path in the `package.json` so the gulp task will concatentate and minify it.
  * place any css needed in the `css/supporting` directory and use the `@import` command to add it into `styles.css`
  * any javascript code needed to initialize or customize the javascript library can be put in a js file under `/js` and
  add this file to `package.json` so it will be concatenated and minified.
  * move any php file needed from `theme_options/lib` to `theme_src/lib` and `require` this file in the `functions.php`
  
  
### Background Slide
This has been used to create a simple home page with beautiful images covering the whole screen and sliding in the background.  This 
js can also be used inside smaller containers as well.  If you need text or more complex slider, use the carousel shown below.
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
A highly customizable slider.  It's a toss up between this slider and swiper.js slider.
  * install slick.js: `npm install slick-carousel --save` 
  * copy `node_modules/slick-carousel/slick/slick.scss` to `theme_src/css/supporting` and add
  `@import "supporting/slick.scss` to `style.scss`
  * follow the step above with `slick-theme.scss` if you want slick's default styling
  * add `node_modules/slick-carousel/slick/slick.js` to `jsConcatenatedScripts` in `package.json`
  * add php code to produce the markup needed by slick.js
  * add javascript code in `theme_src/js/my_scripts.js` to initialize slick on the element's markup
  * slick.js currently does not support responsive image markup (img tag with srcset and sizes attributes).  `theme_options/js/slick-responsive-lazy.js` 
  gives an example of how one can still do this with background images.
  * `theme_options/css/supporting/_slick-custom.scss` gives some example styling to create a set aspect ratio for the slider, add classes needed for `slick-responsive-lazy.js`,
  altering next and previous icons, and providing a fluid size text for the content.

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
  
### Lazyload images using [lazysizes by Alexander Farkas](https://github.com/aFarkas/lazysizes)
  * install by `npm install lazysizes --save`
  * add `node_modules/lazysizes/lazysizes.js` to `jsConcatenatedScripts` in `package.json`
  * copy `theme_options/lib/lazyload.php` to `/theme_src/lib/` and alter it for your needs.
  It is currently set to change all image tags in the post_content using the_content filter
  * add to `functions.php`:
     ```php
     //* Lazyload functions
     require_once( get_stylesheet_directory() . '/lib/lazyload.php' );
     ```
  * see more explanation of [changing image tag markup with this article](https://jhtechservices.com/changing-your-image-markup-in-wordpress/) 


### Parallax Images
  * copy `theme_options/css/supporting/parallax.scss` to `theme_src/css/supporting` and add
      `@import "supporting/parallax.scss` to `style.scss`
  * add the parallax mixin to a selector with the height of the selector as a parameter
  ```
  .parallax-container {
    @include parallax(30em);
    background-image: url('path to img');
    }
  ```
  
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

### Elegant Icons for social media
  * copy `theme_options/css/supporting/_elegant-icons.scss` to `theme_src/css/supporting` and add
      `@import "supporting/elegant-icons` to `style.scss`
  * download the elegant icon fonts from [here](https://www.elegantthemes.com/blog/resources/elegant-icon-font) and copy to the `fonts` directory
  * Checkout the icons [here](https://www.elegantthemes.com/blog/resources/elegant-icon-font) to get the class name to use in your markup

### Search form
Most themes have a way to search the site.  Remember, by default WP search only returns text found in the content of pages and posts.  It does not find content
in ACF fields unless you add some of the code in the ACF section of these theme options. This code hides the search form and shows it when a icon/link is clicked
  * Add php from `theme_options/lib/searchform.php` - alter to put the search form where you want it in the page.
  * Add `searchform.js` and alter the selector to select the icon/link you want clicked to show the search form.
  * Add `_searchform.scss` and alter to match how the search form is added to the page.

### Recommended Dev plugin
  * [Query Monitor](https://wordpress.org/plugins/query-monitor/) by John Blackbourn.  It will show queries, hooks, PHP warnings and notices.
  

  
  
## Change Log

### 2018-01-11
  * Making sure style.css in root of theme is included in the styles all task
  

### 2017-12-13
  * Adding code from project to use as templates.  Mainly stored in `theme_options/functions.php`
    * get social icons function
    * structural wrap settings
    * creation of sidebar
    * shortcode
    * footer change
  * Adding Elegant Icons for social media 
  * Updated sticky nav initialization in `scripts.js`
  * Added Search form php, js, and scss to `theme_options`
  * Adding php code to allow content stored in ACF fields to be in the results of a search using the frontend WP search form
  * Moving all optional ACF php code to `theme_options/lib/acf.php`
  * Adding `theme_options/js/polyfill.js` that adds the Object.assign method for IE
  * Adding `theme_options/js/slick-responsive-lazy.js`. Gives an example of how one can use responsive images and slick.js.
  * Adding `theme_options/css/supporting/_slick-custom.scss`. Gives some example styling to create a set aspect ratio for the slider, add classes needed for `slick-responsive-lazy.js`,
             altering next and previous icons, and providing a fluid size text for the content.
      
### 2017-12-12
  * Adding [phplint](https://github.com/wayneashleyberry/phplint) to gulp pipeline

### 2017-12-02
  * Altering gulpfile.js to separate out the watches again and still do versioning.  Too slow after last change where we performed
  versioning and all tasks on any change.  Now it does versioning and copying only the changes up.
### 2017-11-23
  * adding gulp-bump, semver so versioning is done with any change
  
### 2017-11-18
  * adding $post_id argument to get_field_without_wpautop function.
  * Altered sticky.js to prevent it from setting height to container
  * Added debounce.js and code to debounce updating sticky.js during resize
  
### 2017-11-06
  * Adding SASS function `to-em` to convert from px to em
  * Adding SASS mixin `mq($from, $until, $and, $type)` to create media queries in em
  * Adding SASS variable $breakpoints containing the default bootstrap breakpoints
  * `mq` can take `md` or `lg` from $breakpoints map to insert their em value.

### 2017-08-25
  * Adding Lazy loading of images
  * Adding parallax images

### 2017-08-23
  * Instructions on adding slick-carousel to theme
  
### 2017-08-22
  * adding Theme Customization panel code
  * adding backstretch.js code options
  
### 2017-08-16
  * adding Genesis StudioPress Responsive menu.
  * adding sticky nav
  
