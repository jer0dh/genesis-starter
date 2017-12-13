/* Search form
-------------------------------------------------------------------------
Select the icon or link and add click event to toggle the search form
 */


$('.search-link').on('click', function(e){
    e.preventDefault();
    $('.wsearch').toggleClass('hide-opacity');
});

/*        $('.menu-toggle').on('clicked', function(e){
            $('.wsearch').addClass('hide-opacity');
        });*/