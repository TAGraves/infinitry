(function ($) {
    "use strict";
    
    var App = {
        device: {
            isDesktop: function () {
                return !!(this.width() > 767);
            }, // 768 and up
            isMobile: function () {
                return !!(this.width() < 768);
            }, // 767 and down
            isTouch: function () {
                return !!('ontouchstart' in window) || !!('msmaxtouchpoints' in window.navigator);
            }, // detect for touch
            isLandscapeMobile: function () {
                return !!(this.isMobile && this.width() > 479);
            }, //480-767
            isPortraitMobile: function () {
                return !!(this.isMobile && this.width() < 480);
            }, //320-479
            isTablet: function () {
                return !!(this.isDesktop && this.width() < 1025);
            }, //768-1024
            isPortraitTablet: function () {
                return !!(this.width() === 768);
            }, //768
            isLandscapeTablet: function () {
                return !!(this.width() === 1024);
            }, //1024
            width: function () {
                return $(window).width();
            },
            height: function () {
                return $(window).height();
            }
        },
        history: {
            route: function (state) {
                var scrollTo = $('#' + state).position().top, //get location of the section
                    menuOffset = (App.device.isMobile()) ? 40 : 60;
                
                if (App.billboard.hasRouted) {
                    $('#billboard, #billboard-text').css('visibility','hidden');
                    $('#content').fadeTo(400, 0, function () {
                        $(window).scrollTop(scrollTo-menuOffset); //scroll there, leave room for the menu
                        $('#content').fadeTo(400, 1, function () {
                            $('#billboard, #billboard-text').css('visibility','visible');
                        });
                    });
                }
            },
            init: function () {
                $(window).bind('statechange', function () { //when state is changed
                    var State = History.getState(); 
                    if (State.data.state === "splash" || typeof State.data.state === "undefined") { //if we're moving to the splash page
                        App.page.restart(); //in case we hit the back button. no consequences for first load
                    } else { //non-splash page
                        if (!App.billboard.hasRouted) { //splash screen is showing (e.g. we refreshed)
                            App.page.start(function () { //get rid of the splash page
                                App.history.route(State.data.state); //move to the right section
                            });
                        } else { //menu link or forward/back
                            App.history.route(State.data.state); //move to the right section
                        }        
                    }
                });
            }
        },
        menu: {
            click: function (state, title) {
                if (!$('#billboard').data('router')) {
                    //billy menu click
                    var billboard = App.billboard,
                    menu = App.menu,
                    page = App.page;
                    
                    var windowHeight = $(window).height(),
                    scrollTo = $('#' + state).position().top, //get location of the section
                    thingToMove = (!matchMedia('only screen and (max-width: 767px)').matches) ? '#billboard-text' : '#billboard';

                
                    $('#top-menu-hack').addClass('no-longer-necessary');
                    page.scrolling.enable();
                    if (App.device.isDesktop()) {
                        menu.activate();
                    }
                    History.pushState({state: state}, title, '?state=' + state);
                    billboard.hasRouted = true;
                    
                    $('#content, #billboard, #billboard-text, #mobile-billboard-text').fadeTo(400, 0, function () {
                        $(thingToMove).stop().css('marginTop', -windowHeight);
                        $(window).scrollTop(scrollTo-60); //scroll there, leave room for the menu
                        $('#content, #billboard, #billboard-text, #mobile-billboard-text').fadeTo(400, 100);
                    });

                } else {
                    if (state === History.getState().data.state) {
                        App.history.route(state); //scroll to top of already selected section
                    } else {
                        History.pushState({state: state}, title, '?state=' + state);
                    }
                }
            },
            universal: {
                open: function (width) {
                    $('#menu').addClass('menu-hover').stop().animate({width: width}, 500);
                },
                close: function (width) {
                    $('#menu').stop().animate({width: width}, 200, function () {
                        $(this).removeClass('menu-hover');
                    });
                }
            },
            desktop: {
                open: function () {
                    var width = (App.device.isPortraitTablet()) ? 660 : 768;
                    App.menu.universal.open(width);
                },
                close: function () {
                    var width = 50;
                    App.menu.universal.close(width);
                }
            },
            mobile: {
                open: function () {
                    var width = 328;
                    App.menu.universal.open(width);
                },
                close: function () {
                    var width = 34;
                    App.menu.universal.close(width);
                }
            },
            open: function () {
                var device = App.device,
                    menu = this;
                
                if (device.isDesktop()) {
                    menu.desktop.open();
                } else {
                    menu.mobile.open();
                }
            },
            close: function () {
                var device = App.device,
                    menu = this;
                
                if (device.isDesktop()) {
                    menu.desktop.close();
                } else {
                    menu.mobile.close();
                }
            },
            logo: {
                show: function () {
                    $('header img').fadeIn(500);
                },
                hide: function () {
                    $('header img').fadeOut(200);
                }
            },
            hover: {
                bind: function () {
                    var menuHover = App.menu.hover;
                    if (App.device.isTouch()) {
                        menuHover.bindClick();
                    } else {
                        menuHover.bindHover();
                    }
                },
                bindHover: function () {
                    var menu = App.menu;
                    $('#menu').hover(function () {
                        menu.open();
                    }, function () {
                        menu.close();
                    });
                },
                bindClick: function () {
                    var menu = App.menu;
                    $('#menu').toggleClick(function () {
                        menu.open();
                    }, function () {
                        menu.close();
                    });
                },

                unbind: function () {
                    this.unbindHover();
                    this.unbindClick();
                },
                unbindHover: function () {
                    $('#menu').off('mouseenter mouseleave');
                },
                unbindClick: function () {
                    $('#menu').unbind('click');
                }
            },
            activate: function () {
                var menu = App.menu;
                menu.hover.unbind();
                $('header').addClass('active');
                menu.open();
                menu.logo.show();
            },
            deactivate: function () {
                var menu = App.menu;
                menu.logo.hide();
                menu.close();
                $('header').removeClass('active');
                menu.hover.bind();
            }
        },
        billboard: {
            slideOut: function (fn) {
                var device = App.device,
                    whatToMove = device.isMobile() ? '#billboard' : '#billboard-text';
                
                $(whatToMove).stop().animate({marginTop: -device.height()}, 750, fn);
            },
            slideIn: function () {
                var whatToMove = App.device.isMobile() ? '#billboard' : '#billboard-text';
                
                $(whatToMove).stop().animate({marginTop: 0}, 750);
            },
            hasRouted: false
        },
        page: {
            scrolling: {
                desktop: {
                    enable: function () {
                        $('html').removeClass('noscroll');
                    },
                    disable: function () {
                        $('html').addClass('noscroll');
                    }
                },
                touch: {
                    enable: function () {
                        $(document).off('touchmove');
                    },
                    disable: function () {
                        $(document).on('touchmove', function (e) {
                            e.preventDefault();
                        });
                    }
                },
                enable: function () {
                    if (App.device.isTouch()) {
                        this.touch.enable();   
                    } else {
                        this.desktop.enable();
                    }
                },
                disable: function () {
                    if (App.device.isTouch()) {
                        this.touch.disable();   
                    } else {
                        this.desktop.disable();
                    }
                },
            },
            start: function (fn) {
                var billboard = App.billboard,
                    menu = App.menu,
                    page = App.page;
                
                billboard.slideOut(function () {
                    $('#top-menu-hack').addClass('no-longer-necessary');
                    page.scrolling.enable();
                    if (App.device.isDesktop()) {
                        menu.activate();
                    }
                    if (typeof fn !== "undefined") {
                        billboard.hasRouted = true;
                        fn();
                    } else {
                        History.pushState({state: 'whats-our-story'}, 'Infinitry: What\'s our story?', '?state=whats-our-story');
                        billboard.hasRouted = true;
                    }
                });
            },
            restart: function () {
                var billboard = App.billboard,
                    menu = App.menu,
                    page = App.page;

                billboard.hasRouted = false;
                    if (App.device.isDesktop()) {
                        menu.deactivate();
                    }
                page.scrolling.disable();
                $('#top-menu-hack').removeClass('no-longer-necessary');
                billboard.slideIn();
            }
        }
    };
    
    window.App = App;
    
    $(function () {
        
        App.menu.hover.bind();
        
        //route to the current section
        var state = History.getState().data.state;
        if (typeof state !== "undefined" && state !== "splash") { //not splash page
            
            $('#billboard').data('router', true);    
            App.page.start(function () {
                App.history.route(state);
            });
        };
        

        $('nav a').click(function (e) {
            e.preventDefault(); //stop from loading hashtag page
            var state = $(this).attr('href').split('?state=')[1], //state in href
                title = $('#' + state).data('statetitle'); //menu sections have this data attr
            
            App.menu.click(state, title);
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
            App.page.start();
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
        
        App.history.init();
        
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
        
        $(window).resize(function () {
            var windowHeight = App.device.height(),
                thingToMove = (App.device.isMobile()) ? '#billboard' : '#billboard-text';

            if (App.billboard.hasRouted) {
                $(thingToMove).css('marginTop', -windowHeight);
                
                if (App.device.isDesktop()) {
                    $('#billboard').css('marginTop',0);
                    App.menu.activate();
                } else {
                    if ($('header').hasClass('active')) { //went from desktop size to mobile size
                        App.menu.deactivate();
                    }
                }
                
                
            }
            
            //Stretch footer to 100% height
            $('footer .container').css('minHeight', windowHeight - 132); //not sure why, but it's always 52px too tall - and take off 70 more for padding

        }).trigger('resize'); //stretch footer on page load
        
        $('#work-box-right').unbind('click').click(function (e) {
            e.preventDefault();
            var width = $('.work-box div').width();
            $('.work-box ul').animate({left: '-=' +width}, 500);
        });
        
        $('#work-box-left').unbind('click').click(function (e) {
            e.preventDefault();
            var width = $('.work-box div').width();
            $('.work-box ul').animate({left: '+=' +width}, 500);
        });
        
    });
}(jQuery));