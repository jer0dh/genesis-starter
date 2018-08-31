# genesis-starter

A gulp based dev environment to help speed up Wordpress theme development using the Genesis Framework

## Folders


### `/theme_backup`
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
  
  * js files listed in `package.json` under `jsConcatenatedVendorScripts` and `jsConcatenatedScripts` will be concatenated and minified into a single file named from `jsConcatenatedScriptsName` and placed
  in `/js` folder.  They will be concatenated in the order they appear in the arrays with `jsConcatenatedVendorScripts` first. The only difference
  between the two is jsConcatenatedVendorScripts will not run through Babel.  Here's an example:
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
remote server so no password has to be entered each time this is run.  Configuration file is read in from filename defined in "remote" key
of package.json.

We are using rsync.json file.  Be sure to include this in your .gitignore file.  The format is
```
{
 "adtive"      : true,
 "hostname"  : "yourhostftpdomain.com",
  "username"  : "username",
  "port"      : 18763,
 "destination" : "~/pathonhost/"
  }

```

`gulp-sftp` can also be used to sftp files up to host if rsync not available.

`package.json` contains the name of the file containing config needed for this such as `username`, `port`, destination path,
etc.  By default it's called `rsync.json`.  This file name MUST be listed in your `.gitignore` file so it
does not get saved in a public repo.

`sftp.json` contains your sftp information if using sftp.  It should also be listed in your `.gitignore` file.  Its format is like this:

```$xslt
{
  "active"  :  true,
  "hostname": "ftp.hostname.com",
  "user": "yourusername",
  "pass": "yourpassword",
  "remotePath": "/public_html/wp-content/themes",
  "port": "18763"
}
```
> note: might need to create the initial theme folder via an ftp client for sftp to work.

The `send` key in the files will determine which way to deploy either rsync or sftp.  Set one of them to true and one to false.

#### Default and Watches
Default task will run the 'deploy-all-clean' task that cleans the `theme_dest`, runs all the tasks to
refresh the `theme_dest` folder, and then deploys it to remote server.

It watches for changes in `/css/**/*.scss`, `/js/**/*.*`, `/**/*.php`, runs any needed tasks, and deploys.

It watches the `/images/src` folder and minifies any new images.

### Zip task
see `/theme_backups` folder description

  
## Theme Options 
This ever growing list of options are common client website needs.  They are not added to the `theme_src` but
can be using the instructions below.  The basic instructions are
  * install the javascript library needed either in the `/js/vendor` directory or via `npm`
  and place the file path in the `package.json` so the gulp task will concatentate and minify it.
  * place any css needed in the `css/supporting` directory and use the `@import` command to add it into `styles.css`
  * any javascript code needed to initialize or customize the javascript library can be put in a js file under `/js` and
  add this file to `package.json` so it will be concatenated and minified.
  * move any php file needed from `theme_options/lib` to `theme_src/lib` and `require` this file in the `functions.php`


### Sticky Nav
  * using [sticky.js](http://stickyjs.com)
  * added `js/vendor/sticky.js` from gitHub. (no npm install)
  * added `js/vendor/sticky.js` to jsContenatedScripts to package.json
  * added code in `js/scripts.js` to init sticky.js on `.nav-primary`
  * added `css/supporting/_nav_sticky.scss` to apply any new css needed (added css to move sticky nav down if wp-admin-bar present)
  
  Warning: the sticky.js in this theme has be slightly altered to fix a responsive height issue.
  
#### Other sticky options
  * [headroom.js](http://wicky.nillia.ms/headroom.js/).  9k+ gitHub stars
    - specifically for a header as it appears to monitor only when window is not at the top and not in relation to the element headroom
    has been assigned.  
    - Nice in that it does not create the css styles for the sticky header.  Only changes the classes so we can decide how it sticks
    - Classes are added so you can hide the header as it scrolls down and viewing the page. As soon as the user starts to scroll up a bit,
    it adds a class so you can then show the header
  * [Sticky-Kit](http://leafo.net/sticky-kit/). 2.5K+ gitHub stars
    - `npm install sticky-kit --save-dev
    - allows multiple sticky elements, but will not stack without addition coding
   
     
  
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
## Bootstrap Update
  * Bootstrap 4 can be used instead.  
  * `npm install bootstrap --save-dev`
  * add `"node_modules/bootstrap/dist/js/bootstrap.bundle.js"` to `jsConcatenatedVendorScripts` in package.json.  This includes popper.js.  Only 67KB when minified
  * `_bootstrap4.scss` or `_bootstrap-grid.scss` can be `@import`ed in the `style.scss` and it will load the SASS version of bootstrap directly from
   the source files in the node_modules folder.  `boostrap-grid.scss` only loads the new bootstrap grid framework.
     
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

### Lazyload images using Lozad.js [ApporvSaxena/Lozad.js](https://github.com/ApoorvSaxena/lozad.js#usage)
This library was featured in CSS Tricks where it is using the IntersectionObserver API so no polling needed.  This makes it
much more performant. Works with most latest browsers and for those it does not, like Safari, there is a polyfill.  By default images with class
'lozad' will only load when in viewport. iframes and others can also use this.  Looks like they have a polyfill to incorporate more
browsers at [this site](https://www.npmjs.com/package/intersection-observer) and on that page if you want it to work on even older browsers,
add `<script src="https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver"></script>` in addition.


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

### A Better dropdown - [Select2](https://select2.org/)
A great dropdown with many options, especially, great for a multi-select dropdown.  Included in the php is a great filter for wp_dropdown_categories() 
that adds the appropriate markup (`select` tags with the `multiple` attribute and `option` tags with the `selected` attribute).  It also allows the user
to type to search for the options they want.  Select2 does not seem to have great support for accessibility. Screen readers have some issues.  As of 
August 2017, it appears WooCommerce has forked Select2 and beta testing [an accessible and backward compatible version of Select2.](https://woocommerce.wordpress.com/2017/08/08/selectwoo-an-accessible-replacement-for-select2/)
 
  * `npm install --save select2`
  * add `node_modules/select2/dist/js/select2.full.js` to `jsConcatenatedVendorScripts` in `package.json`
  * if using multiple select dropdowns, copy `/theme_options/lib/select-dropdown.php` and add the appropriate `require_once` to `functions.php`
  
### Another Better dropdown - [Chosen](https://github.com/harvesthq/chosen)
Found that Gravity Forms will use this to improve their select input if you opt to in advanced settings of the field.  It has
also been starred over 21K in github.  Will look at this for my next project


### Recommended Dev plugin
  * [Query Monitor](https://wordpress.org/plugins/query-monitor/) by John Blackbourn.  It will show queries, hooks, PHP warnings and notices.
  
### Theme Customization panel
This option can be added to quickly add settings and options on the WordPress Theme Customize panel under Appearance | Customize.

  * add `theme_options/lib/customization.php` to `theme_src` and `include` it in the functions.php
  * add `theme_options/lib/customization.js` to `theme_src/js` and make sure `customization.php` contains the correct path to enqueue it.
  * alter these files to include the settings/controls you want to add
  * [Great article on creating these settings](https://premium.wpmudev.org/blog/wordpress-theme-customization-api/)
  * [WordPress Docs on Theme Customization API](https://codex.wordpress.org/Theme_Customization_API)


### Linear Gradients
[A great site with 180 sample linear gradients for backgrounds.](https://webgradients.com)


### Page builder option
Have not used it but it has a large 1 million+ installs, it's free, and compatible with all themes.
[Page Builder by SiteOrigin](https://wordpress.org/plugins/siteorigin-panels/)

### Full Width Genesis
Many times we want full width even in the content.  
  * Remove default css for `.site-inner, .wrap` in `_structureAndLayout.scss`.  The `.site-inner` and all `.wrap` have max-width set.
  * Can keep `.wrap` with max-width but add the following statement without `site-inner` listed
  
  ```php
  add_theme_support( 'genesis-structural-wraps', array(
  	'header',
  	'menu-primary',
  	'menu-secondary',
  	'site-inner',
  	'footer-widgets',
  	'footer',
  ) );
  ``` 
  * Wraps would have to be added to content areas that we want not to be full width.  
  A good option would be to use the `genesis_entry_header` and `genesis_entry_footer` actions to add the wrap for 
  `<article>`.  Use the `genesis_statndard_loop()` code to determine best place depending on theme needs.

Another full width option which allows background color to expand full width involves keeping the wraps and css in place but to use some extra css to expand the container.
   ```css
   
   .banner {
     margin-left: -9999px;
     margin-right: -9999px;
     padding-left: 9999px;
     padding-right: 9999px;
   }
   
   ```
   
### Animations
Adding some easy and nice animations is easy using Daniel Eden's animate.css file.  [It is found here](https://github.com/daneden/animate.css/blob/master/animate.css)
  * run `npm install animate.css --save` and place `@import '../../node_modules/animate.css/animate.css';` in the `/theme_src/css/styles.scss` file.
  
  OR
  
  * create a file under `theme_src/css/supporting` called `animate.css` and copy the content of this file from the link above and place a corresponding 
  import in the styles.scss file.
  
  * Instructions for adding the animations on a particular element are at the link
  
For more extensive type animations.  We would recommend [GreenSock](https://greensock.com/)


### CSS Grid 
As I write this [caniuse.com](https://caniuse.com/#feat=css-grid) reports 76.71% browser support which is 10% higher than 7 months ago.  So this is coming.
This can probably be used for future projects, but would require some fallbacks.  Need to test to see if this autoprefixer will add the ms prefixes.
If not available, then [this css-tricks article](https://css-tricks.com/browser-compatibility-css-grid-layouts-simple-sass-mixins/) offers mixins to add
the ms prefixes.  In addition [this article](https://rachelandrew.co.uk/css/cheatsheets/grid-fallbacks) shows how to create some fallbacks.
  
### Accessibility
To test page for accessibility issues
  * add `tota11y.php` or add it's code to `functions.php`.  Add `theme_options\js\vendor\tota11y.js` to `theme_src`. Might want to check for [latest version here](http://khan.github.io/tota11y/)
  * change WP_DEBUG to true in `wp-config.php` on the web host.
  * Open page and click on button in a fixed position in the lower left.
  
### Sliding sidebar menu using [slideout.js](https://github.com/mango/slideout)

* `npm install slideout --save`
* add `node_modules/slideout/dist/slideout.js` to `jsConcatenatedVendorScripts` in `package.json` 
* add `theme_options/css/supporting/_slideOut.scss` to `theme_src/css/support`
* add `theme_options/js/slideout-cust.js` to `theme_src/js`
* add `theme_src/js/slideout-cust.js` to `jsConcatenatedScripts` in `package.json`
* make sure the `event-bus.js` file is in `jsConcatenatedScripts` in `package.json` and loaded before `slideout-cust.js`
* add `theme_src/lib/sideout.php` to `theme_src/lib` and add `require_once( get_stylesheet_directory() . '/lib/slideout.php' );` to `functions.php`.
* add the following to `/theme_src/css/style.scss`
```css

/* Slideout
----------------------------------------------------------- */
@import "../../node_modules/slideout/index";
@import "supporting/slideOut";

```

### Remove code
It's nice to be able to add some testing code to your php and javascript files.  What's not nice, is forgetting the testing code is still there when you've
push out the production theme.  Removing or commenting out the test code is what we normally do but requires time to reinstate code if we need to 
test again.  The gulp-remove-code plugin allows us to surround the testing code with a comment that will determine if it should be removed or not.

```javascript
        //removeIf(production)
        console.log( 'starting scripts.js');
        //endRemoveIf(production)
```

In the `gulpfile.js` there is a constant called `production`.  Change this to `true` and all testing code (including the start and end comments) will
be removed.  There is another object called `removeCodeOptions`.  This is passed to the gulp-remove-code plugin so one can add different variables
to test with.  Each key on the object could be used in the testing comment.  Each key should always be OR'ed with `production` so that if `production` is
true, all testing code is removed.  This gives you the option to only have some of the testing code active in a non production environment.

```php
//removeIf(notTesting)
   wp_enqueue_script( GS_MAIN_SCRIPT, get_stylesheet_directory_uri() . "/js/jasmine.js", array( 'jquery' ), $version, true );
//endRemoveIf(notTesting)
```
> NOTE: Remember to restart the gulp process after changing any variables in the `gulpfile.js`

### Vue js
Vue looks promising and the ability to incorporate it into WordPress would be beneficial.  Added ability to create a javascript
app using modules.  Instead of browserfy, we are using the notorious webpack..integrated using gulp streams.  Vue-loader and
vue is installed.

The root js app file is '/js/app/app.js'  This can be changed in `gulpfile.js/config/index.js`


### Event/Message Bus for javascript `theme_src/js/event-bus.js`

Creates a global event/message bus that can be used throughout the life of the web page.  It also extends
Query to add .onP and .triggerP functions on any jQuery object.

.onP is the same as .on except it will automatically add a namespace of '3' if no namespace is added.
.triggerP will trigger an 'event' in order of the namespaces.  Starting with '1' and ending with '5'

This is similar to the Wordpress Action/Hook pattern so that one can give certain callbacks priority.

Just as when using .on or .trigger, data can be passed at the time of setting 'onP' or data can be passed at the time
the event is triggered

Data passed using 'onP' must be the second argument of 'onP' as an Object.  It can be accessed in the trigger
callback in the event.data.  See examples in file.

Data can also be passed to the callback by passing in an array of arguments when event is triggered.  See example in file

Uses jQuery triggerHandler since no need for bubbling

### Testing performance
[Lighthouse](https://developers.google.com/web/tools/lighthouse/#devtools)

### Gutenberg Notes
Bill Erickson has a [great article](https://www.billerickson.net/getting-your-theme-ready-for-gutenberg/) on this.  So far most
of the themes we build uses a modular type system using [ACF](https://www.advancedcustomfields.com/) and their Flexible Layout 
Field.  Once Gutenberg is more finished and custom block creation finalized, we may move over to Gutenberg...unless ACF adds
the ability to create custom blocks using their interface. It will be nice to have the ACF data in the post_content.

### Element scrolled into view
  * Couple of functions found [here](https://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling)
  * [ScrollMagic](http://scrollmagic.io/)
      Good article: https://ihatetomatoes.net/svg-scrolling-animation-triggered-scrollmagic/
  * ScrollReveal.js
  * [Waypoints.js](http://imakewebthings.com/waypoints/guides/getting-started/)
  * jQuery AniView

## Change Log

### 2018-8-31
  * Adding sample section template-parts when creating modules using ACF
  * Adding optional javascript code for responsive background images, and section load with scrolled in view.
  * Added php functions for help in responsive background images
  * Added svg Sprite gulp task
  * Added to the acf backend styling
  * Adding aria-label to responsive menu buttons

### 2018-7-20
  * rearranging css, optimizing.

### 2018-7-17
  * Adding a bit of Gutenberg code for future.
  
### 2018-5-1
  * Adding deploy-all task and adding to default
  * fixing readme on rsync.json and sftp.json.. should be "active" and not "send"

### 2018-4-30
  * Changing from one big monolithic gulpfile.js file to a gulpfile.js directory and the tasks split up.  Also optimized
  some of the tasks and added ability to use webpack to compile a javascript app using modules..including using vue.js

### 2018-04-27
  * added gulp-if and gulp-sftp to be able to sftp to hosts where we cannot use certificates for Auth nor ssh access for rsync

### 2018-03-27
  * added [files-exist](https://www.npmjs.com/package/files-exist) to js gulp task so it will error if it can't find one
  of the javascript libraries

### 2018-03-22
  * Adding gulp task to copy misc files from src to dest.  It does not touch the files processed by the other tasks. It is
  run only as the default task (no watch setup for this since these files don't change often)

### 2018-02-20
  * Adding Bootstrap 4 as option.  Adding Bootstrap4 Grid only to theme_src

### 2018-01-30
  * adding mixin to create css for fluid-text
  * added in theme_options code to add titles to flexible layouts on the backend
  * added in theme_options code to report error if ACF plugin not loaded.

### 2018-01-21
  * mobile-first css for responsive nav 

### 2018-01-20
  * Altering Genesis CSS and making it use em and mobile first media queries

### 2018-01-18
  * adding gulp-remove-code
  * cleaning up `theme_versions` directory
  * adding event-bus doc

### 2018-01-18 v1.0.2
  * finished slidout.js 
  * moved all slideout.js code to `theme_options`
  
### 2018-01-17
  * wrote GsBus.js to provide an event/message bus similar to Wordpress with priorities
  * adding/experimenting with slideout for a side menu - may try sidr.js next

### 2018-01-16
  * Adding notes on select2
  * adding theme option to add tota11y.js to web page when wp_debug is on so one could analyze for accessibility issues.
  
### 2018-01-12
  * Researching and checking out full width options.  Making note in README.MD
  
### 2018-01-11
  * Making sure style.css in root of theme is included in the styles all task
  * Adding notes regarding different sticky options
  * Adding separate vendor and user js scripts arrays to concatenate together.  Vendor scripts are not run through babel which has caused issue with
  some javascript libraries. Using gulp-filter to continue to be able to use the same Gulp task
  * Ran npm update --save-dev
  

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
  
