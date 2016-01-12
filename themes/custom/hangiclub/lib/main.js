jQuery(document).ready(function($) {
    $(window).resize( function(){
            $(".slider").owlCarousel({
                items: 3,
                nav: false,
                responsive: true,
                lazyLoad: true,
                autoPlay : 5000,
                stopOnHover: true,
            });
        });
        $(window).resize();
});