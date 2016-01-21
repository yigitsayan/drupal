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

            $(".post-slider").owlCarousel({
                items: 3,
                nav: false,
                responsive: true,
                lazyLoad: true,
                autoPlay : 5000,
                stopOnHover: true,
            });
        });
        $(".twitter-feed").owlCarousel({
            paginationSpeed : 400,
            singleItem: true,
            autoPlay : 4000,
            stopOnHover: true,
        });
        $(window).resize();
        $('#sticky').scrollToFixed();
        Placeholdem( document.querySelectorAll( '[placeholder]' ) );

        $('#open-button').click(function(){
            $('body').addClass('show-menu');
        });

        $('#close-button').click(function(){
            $('body').removeClass('show-menu');
        });
});