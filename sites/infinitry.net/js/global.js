(function ($) {
    "use strict";

    //Close billy and open content
    var start = function (fn) {
        var windowHeight = $(window).height(),
            content = $('#content'),
            contentTop = content.position().top,
            fnSet = (typeof fn !== "undefined");
        
        $('#billy-menu').unbind('touchstart').off('mouseenter mouseleave').unbind('click');
        
        content.css({
            top: 'auto', //fix Firefox whitespace bug
            marginTop: contentTop
        }); 
        
        $('html').removeClass('noscroll'); //allow scrolling
        
        $('#billboard-text').animate({top: -342}, 750); //slide billboard text out
        
        $('#billy-menu').addClass('billy-menu-hover').stop().animate({width: ($(window).width() > 960) ? 930 : 768}, 500, function () {
            $('#header-pre').addClass('active');
        });
        content.animate({marginTop: -181}, 750, function () { //slide content in
            if (fnSet) {
                fn(); //run callback once content is visible
            } else {
                History.pushState({state: 'whats-our-story'}, 'Infinitry: What\'s our story?', '?state=whats-our-story');
            }
        }); //slide content in
        
    };
    
    //Restart page
    var restart = function () {
        var windowHeight = $(window).height();
        
        $('#content').stop().animate({top: '100%'}, 750); //slide content out
        
        $('#header-pre').removeClass('active');
        $('#billy-menu').removeClass('billy-menu-hover').stop().animate({width: 50}, 500);
        
        $('#billy-menu').hover(function () {
            //hover in
            var $this = $(this);
            var width = ($(window).width() > 960) ? 930 : 768;
            $this.addClass('billy-menu-hover').stop().animate({width: width}, 500);
            
        }, function () {
            //hover out
            var $this = $(this);
            $this.removeClass('billy-menu-hover').stop().animate({width: 50}, 200);
        }).bind('touchstart', function () {
                var $this = $(this);
                $this.unbind('touchstart').off('mouseenter mouseleave').toggleClick(function () {
                    $this.addClass('billy-menu-hover').stop().animate({width: ($(window).width() > 960) ? 930 : 768}, 500);
                }, function () {
                    $this.removeClass('billy-menu-hover').stop().animate({width: 50}, 200);
                }).trigger('click');
            });;
        
        $('#billboard-text').animate({top: '50%'}, 750); //slide billboard text in
        
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
            if (!$('#header-pre').hasClass('active')) { //splash screen is showing (e.g. we refreshed)
                start(function () { //get rid of the splash page
                    route(State.data.state); //move to the right section
                });
            } else { //menu link or forward/back
                route(State.data.state); //move to the right section
            }
        }
    });
    
    $(function () {

        $('#billy-menu').hover(function () {
            //hover in
            var $this = $(this);
            var width = ($(window).width() > 960) ? 930 : 768;
            $this.addClass('billy-menu-hover').stop().animate({width: width}, {
                duration: 500,
                step: function (num) {
                    /*if (num > 200) {
                        $('#billy-menu img').show();
                    }*/
                }
            });
            
            $(this).bind('touchstart', function () {
                var $this = $(this);
                $this.unbind('touchstart').off('mouseenter mouseleave').toggleClick(function () {
                    $this.addClass('billy-menu-hover').stop().animate({width: ($(window).width() > 960) ? 930 : 768}, 500);
                }, function () {
                    $this.removeClass('billy-menu-hover').stop().animate({width: 50}, 200);
                }).trigger('click');
            });
        }, function () {
            //hover out
            var $this = $(this);
            $this.removeClass('billy-menu-hover').stop().animate({width: 50}, 200);
        });
        
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
            $('.billy-menu-hover').width(($(window).width() > 960) ? 930 : 768);
            var windowHeight = $(window).height();
            $('footer .container').css('minHeight', windowHeight - 132); //not sure why, but it's always 52px too tall - and take off 70 more for padding

        }).trigger('resize'); //stretch footer on page load
        
    });
}(jQuery));