(function ($) {
    "use strict";

    //Close billy and open content
    var start = function (fn) {
        var windowHeight = $(window).height(),
            fnSet = (typeof fn !== "undefined"),
            thingToMove = (!matchMedia('only screen and (max-width: 767px)').matches) ? '#billboard-text' : '#billboard';
        
        $('#menu').unbind('touchstart').off('mouseenter mouseleave').unbind('click');
                
        $(thingToMove).stop().animate({marginTop: -windowHeight}, 750, function () {
            $('#top-menu-hack').addClass('no-longer-necessary');
            $('html').removeClass('noscroll');
            //document.ontouchmove = null;
            $('header').addClass('active');
            openMenu();
            if (!matchMedia('only screen and (max-width: 767px)').matches) {
                $('header img').fadeIn(500);
            }
            if (fnSet) {
                fn(); //run callback once content is visible
            } else {
                History.pushState({state: 'whats-our-story'}, 'Infinitry: What\'s our story?', '?state=whats-our-story');
            }
            $('#billboard').data('router', true);
        }); //slide billboard text out
        
        //});
        
    };
    
    //Restart page
    var restart = function () {
        var windowHeight = $('#billboard').height(),
            thingToMove = (!matchMedia('only screen and (max-width: 767px)').matches) ? '#billboard-text' : '#billboard';
        
        $('#billboard').data('router', false);        
        $('header img').fadeOut(200);
        closeMenu();
        $('header').removeClass('active');
        $('html').addClass('noscroll');
        document.ontouchmove = function(event){
            event.preventDefault();
        };
        $('#top-menu-hack').removeClass('no-longer-necessary');
        $(thingToMove).stop().animate({marginTop: 0}, 750);
        $('#menu').hover(function () {
            openMenu();
            $(this).bind('touchstart', function () {
                var $this = $(this);
                $this.unbind('touchstart').off('mouseenter mouseleave').toggleClick(function () {
                    openMenu();
                }, function () {
                    closeMenu();
                }).trigger('click');
            });
        }, function () {
            closeMenu();
        });
                
    };

    var openMenu = function (fn) {
        var width;
        if (matchMedia('only screen and (max-width: 767px)').matches) {
            width = 328;
        } else {
            width = ($(window).width() > 959) ? 768 : 660;
        }
        if (typeof fn === "undefined") {
            fn = function () {};
        }
        $('#menu').addClass('menu-hover').stop().animate({width: width}, 500, fn);
    };
    
    var closeMenu = function () {
        var width = (matchMedia('only screen and (max-width: 767px)').matches) ? 34 : 50;
        $('#menu').stop().animate({width: width}, 200, function () {
            $(this).removeClass('menu-hover');
        });
    };
        
    var route = function (state) { //scrolls to the state's section
        var scrollTo = $('#' + state).position().top, //get location of the section
            menuSize = (matchMedia('only screen and (max-width: 767px)').matches) ? 40 : 60;
        if (!$('#billboard').data('router')) {
        } else {
            $('#billboard, #billboard-text').css('visibility','hidden');
            $('#content').fadeTo(400, 0, function () {
                $(window).scrollTop(scrollTo-menuSize); //scroll there, leave room for the menu
                $('#content').fadeTo(400, 1, function () {
                    $('#billboard, #billboard-text').css('visibility','visible');
                });
            });
        }
    };
        
    $(window).bind('statechange', function () { //when state is changed
        var State = History.getState(); 
        if (State.data.state === "splash" || typeof State.data.state === "undefined") { //if we're moving to the splash page
            restart(); //in case we hit the back button. no consequences for first load
        } else { //non-splash page
            if (!$('header').hasClass('active')) { //splash screen is showing (e.g. we refreshed)
                start(function () { //get rid of the splash page
                    route(State.data.state); //move to the right section
                });
            } else { //menu link or forward/back
                route(State.data.state); //move to the right section
            }
        }
    });
    
    $(function () {
        $('#menu').hover(function () {
            openMenu();
            $(this).bind('touchstart', function () {
                var $this = $(this);
                $this.unbind('touchstart').off('mouseenter mouseleave').toggleClick(function () {
                    openMenu();
                }, function () {
                    closeMenu();
                }).trigger('click');
            });
        }, function () {
            closeMenu();
        });
        
        //route to the current section
        var state = History.getState().data.state;
        if (typeof state !== "undefined" && state !== "splash") { //not splash page
            
            $('#billboard').data('router', true);    
            start(function () {
                route(state);
            });
        };
        
        
        //menu link functionality
        $('nav a').click(function (e) {
            e.preventDefault(); //stop from loading hashtag page
            var state = $(this).attr('href').split('?state=')[1], //state in href
                title = $('#' + state).data('statetitle'); //menu sections have this data attr
            
            if (!$('#billboard').data('router')) {
                //billy menu click
                var windowHeight = $(window).height(),
                    scrollTo = $('#' + state).position().top, //get location of the section
                    thingToMove = (!matchMedia('only screen and (max-width: 767px)').matches) ? '#billboard-text' : '#billboard';

                $('#top-menu-hack').addClass('no-longer-necessary');
                $('#menu').unbind('touchstart').off('mouseenter mouseleave').unbind('click');
                $('html').removeClass('noscroll');
                $('header').addClass('active');
                document.ontouchmove = null;
                $('#content, #billboard, #billboard-text, #mobile-billboard-text').fadeTo(400, 0, function () {
                    $(thingToMove).stop().css('marginTop', -windowHeight);
                    $(window).scrollTop(scrollTo-60); //scroll there, leave room for the menu
                    $('#content, #billboard, #billboard-text, #mobile-billboard-text').fadeTo(400, 100);
                });
                openMenu();
                if (!matchMedia('only screen and (max-width: 767px)').matches) {
                    $('header img').fadeIn(500);
                }
                History.pushState({state: state}, title, '?state=' + state);
                $('#billboard').data('router', true); 
            } else {
                if (state === History.getState().data.state) {
                    route(state); //scroll to top of already selected section
                } else {
                    History.pushState({state: state}, title, '?state=' + state);
                }
            }
        });

        //change menu as we scroll
        $(window).scroll(function () {
            var sectionInView = $('.container:in-viewport').parent('[data-statetitle]'), //only menu items
                title = sectionInView.data('statetitle'),
                state = sectionInView.attr('id');
                
                $('nav a.active').removeClass('active');

            if (typeof title !== "undefined") { //just in case something else got selected somehow; probably unnecessary
                $('nav a[href="?state=' + state + '"]').addClass('active');
            } 
            
        });
        
        
        //Starter
        $('.nav-starter').click(function (e) {
            e.preventDefault();
            start();
        });
        
        $('.our-work div').hover(function () {
            //hover in 
            
            var $this = $(this).find('img'),
                altText = $this.attr('alt').split(';'),
                title = altText[0],
                work = altText[1],
                span = '<span class="image-title">' 
                            + title + 
                        '</span><span class="image-work">' 
                            + work + 
                        '</span>';
            
            $('.our-work img').stop().fadeTo(1,.7).parent().find('.image-bg').remove();
            
            $this.fadeTo(200,1, function () {
                $('<div class="image-bg"><div>' + span + '</div></div>').css({
                    top: 0,
                    left: 0,
                    width: $this.width(),
                    height: 0,
                }).insertAfter($this).animate({height: $this.height()}, 100);
            });
        }, function (e) {
            var $this = $(this).find('img')

                $this.next().animate({height: 0}, 100, function () {
                    $(this).remove();
                    $this.fadeTo(200,.7);
                });
        
                //hover out
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
        
        //Stretch footer to 100% height
        $(window).resize(function () {
            var windowHeight = $('#billboard').height(),
                thingToMove = (!matchMedia('only screen and (max-width: 767px)').matches) ? '#billboard-text' : '#billboard';

            if ($('header').hasClass('active')) {
                $(thingToMove).css('marginTop', -windowHeight);
            }
            $('footer .container').css('minHeight', windowHeight - 132); //not sure why, but it's always 52px too tall - and take off 70 more for padding

        }).trigger('resize'); //stretch footer on page load
        
    });
}(jQuery));