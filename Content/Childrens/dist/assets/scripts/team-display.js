// TEAM & PROFILE SCRIPTS

// Set Profile Pic Height on Provider Bio & Find a doc

function profilePicHeight() {
    setTimeout(function () {

        $('.returnContainer, .profile-image-container').each(function () {

            var profileHeight = $(this).find(".default-image").height();

            $(this).find('.profile-pic').css('height', profileHeight);

        });

    }, 200);
}

// Team Gallery Carousel

function teamCarousel() {

    $('.team-wrapper').each(function () {

        var jcarousel = $(this).find('.jcarousel');

        jcarousel
		    .on('jcarousel:reload jcarousel:create', function () {
		        var carousel = $(this),
		            width = carousel.innerWidth();
		        // console.log(carousel);

		        if (width >= 600) {
		            width = width / 5;

		        } else {
		            width = width / 4;
		        }

		        // width = width / 5;

		        carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
		    })
		    .jcarousel({
		        wrap: 'circular'
		    });

        $(this).find('.jcarousel-control-prev')
		    .jcarouselControl({
		        target: '-=1'
		    });

        $(this).find('.jcarousel-control-next')
		    .jcarouselControl({
		        target: '+=1'
		    });
    });
}

// Profiles 9 and under

function nineUnder() {

    $('.team-wrapper.nineUnder').each(function () {

        // Team-wrapper container
        var teamWrapper = $(this);

        // Finds width of browser window
        var docSizeWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        // Unwrap jcarousel
        teamWrapper.find('.jcarousel, .jcarousel-wrapper').contents().unwrap();

        // Remove jcarousel controls
        teamWrapper.find('.jcarousel-controllers').remove();

    });

    setTimeout(function () {

        $('.team-wrapper.nineUnder').each(function () {

            var profileHeight = $(this).find(".carousel.profile").height();

            $(this).find('.carousel.profile-pic').css('height', profileHeight);

        });

    }, 150);

    $('.team-wrapper.nineUnder').css('visibility', 'visible');

}

// Profiles 10 through 12

function tenToTwelve() {

    // profilePicHeight();

    // console.log("GOOOEY PIEEEEE 10 - 12");

    $('.team-wrapper.tenToTwelve').each(function () {

        // Team-wrapper container
        var teamWrapper = $(this);

        // Each profile
        var profiles = $(this).find("ul.profile-list-container div.profile");

        // Finds width of browser window
        var docSizeWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if (docSizeWidth <= 480) {

            // Unwrap jcarousel
            teamWrapper.find('.jcarousel, .jcarousel-wrapper').contents().unwrap();
            // Remove jcarousel controls
            teamWrapper.find('.jcarousel-controllers').remove();

            // Unwrap list (li) from profiles
            teamWrapper.find('ul.profile-list-container > li div.profile').unwrap();

            // Wrap every 3 profiles in list (li)
            for (var i = 0; i < profiles.length; i += 3) {
                profiles.slice(i, i + 3).wrapAll("<li></li>");
            }


        } else if (docSizeWidth <= 768) {

            // Unwrap jcarousel
            teamWrapper.find('.jcarousel, .jcarousel-wrapper').contents().unwrap();
            // Remove jcarousel controls
            teamWrapper.find('.jcarousel-controllers').remove();

            // Unwrap list (li) from profiles
            teamWrapper.find('ul.profile-list-container > li div.profile').unwrap();

            // Wrap every 3 profiles in list (li)
            for (var x = 0; x < profiles.length; x += 2) {
                profiles.slice(x, x + 2).wrapAll("<li></li>");
            }


        } else {

            // Unwrap jcarousel
            teamWrapper.find('.jcarousel, .jcarousel-wrapper').contents().unwrap();
            // Remove jcarousel controls
            teamWrapper.find('.jcarousel-controllers').remove();

            // Unwrap list (li) from profiles
            teamWrapper.find('ul.profile-list-container > li div.profile').unwrap();
        }

    });

    setTimeout(function () {

        $('.team-wrapper.tenToTwelve').each(function () {

            var profileHeight = $(this).find(".carousel.profile").height();

            $(this).find('.carousel.profile-pic').css('height', profileHeight);

        });

    }, 100);

    $('.team-wrapper.tenToTwelve').css('visibility', 'visible');

}

// Profiles 13 through 15

function thirteenToFifteen() {

    // profilePicHeight();

    // console.log("GOOOEY PIEEEEE 13 - 15");

    $('.team-wrapper.thirteenToFifteen').each(function () {

        // Team-wrapper container
        var teamWrapper = $(this);

        // Each profile
        var profiles = $(this).find("ul.profile-list-container div.profile");

        // Finds width of browser window
        var docSizeWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        // Unwrap jcarousel
        teamWrapper.find('.jcarousel, .jcarousel-wrapper').contents().unwrap();
        // Remove jcarousel controls
        teamWrapper.find('.jcarousel-controllers').remove();

        // Unwrap list (li) from profiles
        teamWrapper.find('ul.profile-list-container > li div.profile').unwrap();

        if (docSizeWidth <= 480) {

            // Wrap every 3 profiles in list (li)
            for (var i = 0; i < profiles.length; i += 3) {
                profiles.slice(i, i + 3).wrapAll("<li></li>");
            }

        } else if (docSizeWidth <= 768) {

            // Wrap every 3 profiles in list (li)
            for (var x = 0; x < profiles.length; x += 2) {
                profiles.slice(x, x + 2).wrapAll("<li></li>");
            }


        } else {

            teamWrapper.find('ul.profile-list-container > li div.profile').unwrap();

            teamWrapper.find('ul.profile-list-container div.profile').wrapAll('<li></li>');

        }

    });

    setTimeout(function () {

        $('.team-wrapper.thirteenToFifteen').each(function () {

            var profileHeight = $(this).find(".carousel.profile").height();

            $(this).find('.carousel.profile-pic').css('height', profileHeight);

        });

    }, 100);

    $('.team-wrapper.thirteenToFifteen').css('visibility', 'visible');

}

// Profiles 15 and up

function fifteenUp() {

    // profilePicHeight();

    // console.log("GOOOEY PIEEEEE 15 +");

    $('.team-wrapper.fifteenUp').each(function () {

        // Team-wrapper container
        var teamWrapper = $(this);

        // Each profile
        var profiles = $(this).find("ul.profile-list-container div.profile");

        // Finds width of browser window
        var docSizeWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        //if (docSizeWidth <= 480) {

            //// Unwrap jcarousel
            //teamWrapper.find('.jcarousel, .jcarousel-wrapper').contents().unwrap();

            ////// Remove jcarousel controls
            //teamWrapper.find('.jcarousel-controllers').hide();


            //// Unwrap list (li) from profiles
            //teamWrapper.find('ul.profile-list-container > li div.profile').unwrap();

            //// Wrap every 3 profiles in list (li)
            //for (var i = 0; i < profiles.length; i += 3) {
            //    profiles.slice(i, i + 3).wrapAll("<li></li>");
            //}

        //} else if (docSizeWidth <= 992) {

            //// Unwrap jcarousel
            //teamWrapper.find('.jcarousel, .jcarousel-wrapper').contents().unwrap();
            //// Remove jcarousel controls
            //teamWrapper.find('.jcarousel-controllers').hide();


            //// Unwrap list (li) from profiles
            //teamWrapper.find('ul.profile-list-container > li div.profile').unwrap();

            //// Wrap every 3 profiles in list (li)
            //for (var x = 0; x < profiles.length; x += 2) {
            //    profiles.slice(x, x + 2).wrapAll("<li></li>");
            //}

        //} else {

            // Unwrap list (li) from profiles
            teamWrapper.find('ul.profile-list-container > li div.profile').unwrap();

            // Wrap every 3 profiles in list (li)
            for (var y = 0; y < profiles.length; y += 3) {
                profiles.slice(y, y + 3).wrapAll("<li></li>");
            }

            // $(".profile").removeAttr("style");

            if ($(this).find('.jcarousel-wrapper').length !== 0) {

                setTimeout(function () {
                    teamCarousel();
                }, 200);

            } else if ($(this).find('.jcarousel-wrapper').length === 0) {

                teamWrapper.find('.jcarousel-controllers').show();

                $(this).children('.row').children().wrapAll('<div class="jcarousel-wrapper"></div>');
                $(this).find('.profile-list-container').wrapAll('<div class="jcarousel" data-jcarousel="true"></div>');

            }
        //}

    });

    setTimeout(function () {

        $('.team-wrapper.fifteenUp').each(function () {

            var profileHeight = $(this).find(".carousel.profile").height();

            $(this).find('.carousel.profile-pic').css('height', profileHeight);

        });

    }, 300);

    $('.team-wrapper.fifteenUp').css('visibility', 'visible');

}


$(document).ready(function () {

    function profileOverlay() {

        // Finds width of browser window
        var docSizeWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        var docSizeHeight = window.innerHeight || window.outerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var profileContainerHeight = $('.profile-container').outerHeight();

        var profileContainerWidth = $('.profile-container').outerWidth();

        if (docSizeWidth < 600) {
            // console.log("SMALLER THAN 600");
            $('.profile-container').css({
                'margin-top': '-' + profileContainerHeight / 2 + 'px',
                'margin-left': 'auto',
                'left': 'auto'
            });

        } else if (docSizeWidth >= 600) {
            // console.log("LARGER THAN 600");
            $('.profile-container').css({
                'margin-top': '-' + profileContainerHeight / 2 + 'px',
                'margin-left': '-' + profileContainerWidth / 2 + 'px',
                'left': '50%'
            });

        }

        if (profileContainerHeight >= docSizeHeight) {
            $('.profile-container').css({
                'overflow': 'auto',
                'overflow-x': 'hidden',
                'overflow-y': 'scroll',
                'max-height': docSizeHeight,
                'top': 'auto',
                'margin-top': 'auto'
            });

        } else {
            $('.profile-container').css({
                'overflow': 'none',
                'overflow-x': 'none',
                'overflow-y': 'hidden',
                'max-height': 'none',
                'margin-top': '-' + profileContainerHeight / 2 + 'px',
                'top': '50%'
            });
        }

        var profileHeight = $(".team-profile-modal .default-image").height();

        $('.team-profile-modal .profile-pic').css('height', profileHeight);
    }

    $('.team-wrapper .profile').each(function () {

        $(this).on('click', function () {

            var docSizeWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            var profileModal = $(this).find('.team-profile-modal');

            var scrollBarWidth = (window.innerWidth - $(window).width());

            profileModal.clone().prependTo("body");

            $('body').children('.team-profile-modal').fadeIn().promise().done(function () {
                profileOverlay();

                setTimeout(function () {
                    $(".profile-container").animate({
                        opacity: 1
                    }, 200);
                }, 100);

            });

            /*$('#top-link-block').css('visibility', 'hidden');*/

            $('body').css({
                'padding-right': scrollBarWidth
            });

            var pagePosition = $(window).scrollTop();

            if (docSizeWidth <= 991) {

                $('body').css({
                    'position': 'fixed',
                    'top': -pagePosition
                });

            } else if (docSizeWidth >= 992) {

                $('html, body').css({
                    'height': '100%',
                    'position': 'relative'
                });

                $('body').css({
                    'overflow': 'hidden'
                });

            }

            $('.profile-container > i.fa-times').on('click', function () {

                $(this).parents('.team-profile-modal').fadeOut().remove();

                if (docSizeWidth <= 991) {

                    $('html, body').removeAttr("style");

                    $('body').css({
                        'position': 'static'
                    });

                    $(window).scrollTop(pagePosition);

                } else if (docSizeWidth >= 992) {

                    $('html, body').removeAttr("style");

                }

                /*$('#top-link-block').css('visibility', 'visible');*/

                $(".profile-container").css('opacity', '0');

            });

            $('.team-profile-modal').on('click', function () {

                $(this).fadeOut().remove();

                if (docSizeWidth <= 991) {

                    $('html, body').removeAttr("style");

                    $('body').css({
                        'position': 'static'
                    });

                    $(window).scrollTop(pagePosition);

                } else if (docSizeWidth >= 992) {

                    $('html, body').removeAttr("style");

                }

                /*$('#top-link-block').css('visibility', 'visible');*/

                $(".profile-container").css('opacity', '0');

            });

        });


    });



    $('.team-wrapper').each(function () {

        // Number of profiles
        var teamCount = $(this).find('.profile').length;

        // Run conditions for team gallery scripts
        if (teamCount <= 9) {
            $(this).addClass('nineUnder');
            nineUnder();
        } else if (teamCount > 9 && teamCount <= 12) {
            $(this).addClass('tenToTwelve');
            tenToTwelve();
        } else if (teamCount > 12 && teamCount <= 15) {
            $(this).addClass('thirteenToFifteen');
            thirteenToFifteen();
        } else {
            $(this).addClass('fifteenUp');
            fifteenUp();
        }

    });

    // Run conditions for team gallery scripts on windwo resize 
    $(window).resize(function () {

        profileOverlay();

        $('.team-wrapper').each(function () {

            // Number of profiles
            var teamCount = $(this).find('.profile').length;

            if (teamCount <= 9) {
                $(this).addClass('nineUnder');
                nineUnder();
            } else if (teamCount > 9 && teamCount <= 12) {
                $(this).addClass('tenToTwelve');
                tenToTwelve();
            } else if (teamCount > 12 && teamCount <= 15) {
                $(this).addClass('thirteenToFifteen');
                thirteenToFifteen();
            } else {
                $(this).addClass('fifteenUp');
                fifteenUp();
            }

        });

        profilePicHeight();

    });

    // Run on window orientation
    $(window).on("orientationchange", function (event) {

        profileOverlay();

        $('.team-wrapper').each(function () {

            // Number of profiles
            var teamCount = $(this).find('.profile').length;

            if (teamCount <= 9) {
                $(this).addClass('nineUnder');
                nineUnder();
            } else if (teamCount > 9 && teamCount <= 12) {
                $(this).addClass('tenToTwelve');
                tenToTwelve();
            } else if (teamCount > 12 && teamCount <= 15) {
                $(this).addClass('thirteenToFifteen');
                thirteenToFifteen();
            } else {
                $(this).addClass('fifteenUp');
                fifteenUp();
            }

        });

        profilePicHeight();

    });


    // var profileCount = $('.profile').length;
    // console.log(profileCount);


}); // END Page Document Ready function



$(window).load(function () {

    profilePicHeight();

});