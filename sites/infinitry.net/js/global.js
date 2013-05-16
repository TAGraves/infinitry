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
             'background-color': 'rgba(25, 51, 95, .97)'
        }, 750, function () {
            $(this).css({ //We change to a non-calculated property here for screen resizing.
                bottom: 'auto',
                top: 0
            });
        }).find('.nav-starter').fadeOut(500);
        
        $('nav').animate({ //slide menu in
            right: 0
        }, 750);
        
        $('#billboard-text').animate({top: -342}, 750); //slide billboard text out
        
        content.animate({top: -171}, 750, function () { //slide content in
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
        
        $('header').css({ //back to a calculated property to avoid any difficulties
            top: 'auto',
            bottom: windowHeight-70 
        }).animate({ //move nav to bottom, change its bg, and show the button
             bottom: 0,
             'background-color': 'rgba(0, 0, 0, .9)'
        }, 750).find('.nav-starter').fadeIn(500);
        
        $('html').addClass('noscroll'); //disable scrolling
    };
    
    var route = function (state) { //scrolls to the state's section
        var scrollTo = $('#' + state).position().top; //get location of the section
        $('html, body').stop().animate({scrollTop: scrollTo-70}, 500); //scroll there, leave room for the menu
    }
        
    $(window).bind('statechange', function () { //when state is changed
        var State = History.getState(); 
        if (State.data.state === "splash" || typeof State.data.state === "undefined") { //if we're moving to the splash page
            restart(); //in case we hit the back button. no consequences for first load
        } else { //non-splash page
            if ($('.nav-starter').is(':visible')) { //splash screen is showing (e.g. we refreshed)
                start(function () { //get rid of the splash page
                    route(State.data.state); //move to the right section
                });
            } else { //menu link or forward/back
                route(State.data.state); //move to the right section
            }
        }
    });
    
    $(function () {

        //route to the current section
        var state = History.getState().data.state;
        if (typeof state !== "undefined" && state !== "splash") { //not splash page
            start(function () {
                route(state);
            });
        };
        
        //menu link functionality
        $('nav a').click(function (e) {
            e.preventDefault(); //stop from loading hashtag page
            var state = $(this).attr('href').split('?state=')[1], //state in href
                title = $('#' + state).data('statetitle'); //menu sections have this data attr
            if (state === History.getState().data.state) {
                route(state); //scroll to top of already selected section
            } else {
                History.pushState({state: state}, title, '?state=' + state);
            }
        });

        //change menu as we scroll
        $(window).scroll(function () {
            var sectionInView = $('.container:in-viewport').parent('[data-statetitle]'), //only menu items
                title = sectionInView.data('statetitle'),
                state = sectionInView.attr('id');
            
            if (typeof title !== "undefined") { //just in case something else got selected somehow; probably unnecessary
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