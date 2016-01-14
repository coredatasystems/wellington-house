/**
 * Created by leonaves on 31/03/15.
*/
$(document).ready(function(){
    // cache the window object
    $window = $(window);

    $('section[data-type="background"]').each(function(){
        // declare the variable to affect the defined data-type
        var $scroll = $(this);
        var $scrollPos = $scroll.offset().top
        //Get current background position
        var backgroundArr = $(this).css('backgroundPosition').split(" ");
        var backgroundPosition = backgroundArr[1];

        $(window).scroll(function() {
            // HTML5 proves useful for helping with creating JS functions!
            // also, negative value because we're scrolling upwards
            var yPos = (($window.scrollTop() - $scrollPos) / $scroll.data('speed'));

            // background position
            var coords = '50% calc(' + backgroundPosition + ' + ' + yPos + 'px)';

            // move the background
            $scroll.css({ backgroundPosition: coords });
        }); // end window scroll
    });  // end section function

}); // close out script

// cache the pan value
var totalPanValue = 0;

function mapParallax(map) {

    $(window).scroll(function() {
        // HTML5 proves useful for helping with creating JS functions!
        // also, negative value because we're scrolling upwards
        var yPos = -(($(window).scrollTop() - mapOffset + (windowHeight / mapHeight)) / map.parallaxSpeed);

        // amountToPan
        var yPan = yPos - totalPanValue;

        // move the map
        map.panBy(0, yPan);

        //set new totalPanValue
        totalPanValue = yPos;

    }); // end window scroll
}
