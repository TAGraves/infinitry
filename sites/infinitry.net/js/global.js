(function ($) {
    "use strict";

    //Close billy and open content
    var start = function (fn) {
        var windowHeight = $(window).height(),
            content = $('#content'),
            contentTop = content.position().top,
            fnSet = (typeof fn !== "undefined");
        
        content.css('top', contentTop - 171); //this calculation ensures content moves at same speed as the menu
        $('html').removeClass('noscroll'); //allow scrolling
        
        $('header').animate({ //move nav to top, change its bg, and get rid of the button
             bottom: windowHeight-70,
             'background-color': 'rgba(25, 51, 95, .85)'
        }, 750, function () {
            $(this).css({
                bottom: 'auto',
                top: 0
            });
        }).find('.nav-starter').fadeOut(500);
        
        $('nav').animate({ //slide menu in
            right: 0
        }, 750);
        
        $('#billboard-text').animate({top: -342}, 750); //slide billboard text out
        
        content.animate({top: -171}, 750, function () {
            if (fnSet) {
                fn(); //run callback once content is visible
            } else {
                History.pushState({state: 'who-are-we'}, 'Infinitry: Who We Are', '?state=who-are-we');
            }
        }); //slide content in
        
    };
    
    //Restart page
    var restart = function () {
        var windowHeight = $(window).height();
        
        $('#content').animate({top: '100%'}, 750); //slide content out
        
        $('#billboard-text').animate({top: '50%'}, 750); //slide billboard text in
        
        $('nav').animate({ //slide menu out
            right: -2000
        }, 750);
        
        $('header').css({
            top: 'auto',
            bottom: windowHeight-70
        }).animate({ //move nav to bottom, change its bg, and show the button
             bottom: 0,
             'background-color': 'rgba(0, 0, 0, .9)'
        }, 750).find('.nav-starter').fadeIn(500);
        
        $('html').addClass('noscroll'); //disable scrolling
    };
    
    var route = function (state) {
        var scrollTo = $('#' + state).position().top;
        $('html, body').stop().animate({scrollTop: scrollTo-70}, 500);
    }
    
    var History = window.History;
    
    History.silentStateChange = function (data, title, state) {
        data.silent = true;
        History.replaceState(data, title, state);
    }
    
    History.Adapter.bind(window,'statechange',function(){
        var State = History.getState();
        if (!State.data.silent) {
            if (State.data.state === "splash" || typeof State.data.state === "undefined") {
                restart();
            } else {
                if ($('.nav-starter').is(':visible')) { //splash screen is showing
                    start(function () {
                        route(State.data.state);
                    });
                } else {
                    route(State.data.state);
                }
            }
        }
    });
    
    $(function () {
        $('html, body').scrollTop(0);
        //if index.html, push splash state; otherwise, route to correct state
        var state = History.getState().data.state;
        
        if (typeof state !== "undefined" && state !== "splash") {
            //History.silentStateChange({state: 'splash'}, "Infinitry", "?state=splash");
        //} else {
            start(function () {
                route(state);   
            });
        };
        
        $('nav a').click(function (e) {
            e.preventDefault();
            var state = $(this).attr('href').split('?state=')[1],
                title = $('#' + state).data('statetitle');
            if (state === History.getState().data.state) {
                route(state);
            } else {
                History.pushState({state: state}, title, '?state=' + state);
            }
        });
        
        $(window).resize(function () {
        }).trigger('resize');

        $(window).scroll(function () { //scrolling magic for URLs
            var sectionInView = $('.container:in-viewport').parent('[data-statetitle]'),
                title = sectionInView.data('statetitle'),
                state = sectionInView.attr('id');
            
            if (typeof title !== "undefined") {
                $('nav a.active').removeClass('active');
                $('nav a[href="?state=' + state + '"]').addClass('active');
            }
            
        });
        
        //Starter
        $('.nav-starter').click(function (e) {
            e.preventDefault();
            start();
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