(function ($) {
    "use strict";

    $(function () {
        $(window).resize(function () {}).trigger('resize');

        //Starter
        $('.nav-starter').click(function (e) {
            e.preventDefault();
            var windowHeight = $(window).height(),
                contentTop = $('#content').position().top
            $('#content').css('top', contentTop - 171);
            $('html').removeClass('noscroll');
            $('header').animate({
                 bottom: windowHeight-70,
                 'background-color': 'rgba(25, 51, 95, .85)'
            }, 750).find('.nav-starter').fadeOut(500);
            $('nav').animate({
                right: 0
            }, 750);
            $('#billboard-text').animate({top: -342}, 750);
            $('#content').animate({top: -171}, 750);
            // $('html, body').stop().animate({scrollTop: windowHeight-70}, 750);
        });
        
        //IE < 10 doesn't support the placeholder attribute, so hack it in.
        $('.ie input, .ie textarea').each(function () {
            var $this = $(this),
                placeholder = $this.attr('placeholder');
            $this.val(placeholder);
            $this.focus(function () {
                $this.val('');
            }).blur(function () {
                if ($this.val() === "") {
                    $this.val(placeholder);
                }
            });
        });
    });
}(jQuery));