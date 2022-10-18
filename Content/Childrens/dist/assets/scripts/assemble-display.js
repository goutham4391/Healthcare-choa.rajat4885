$(document).ready(function () {

    // Hides/shows hero components

    function heroEvents() {
        $(".hero-event p").each(function () {
            if ($(this).text().trim().length) {
                $(this).parents(".hero-event").css("display", "block");
            }
        });

        $(".hero-event .event-location p").each(function () {
            if ($(this).text().trim().length && $(window).width() <= 480) {
                $(this).parent().css("display", "block");
            } else if ($(this).text().trim().length && $(window).width() >= 480) {
                $(this).parent().css("display", "inline-block");
            }
        });

        $(".hero-event .event-date p").each(function () {
            if ($(this).text().trim().length && $(window).width() <= 480) {
                $(this).parent().css("display", "inline-block");
            } else if ($(this).text().trim().length && $(window).width() >= 480) {
                $(this).parent().css("display", "inline-block");
            }
        });
    }


    heroEvents();

    // Removes hero cta if anchor link is empty

    $(".hero-container .hero-cta").each(function () {
        if ($(this).attr('href') === "") {
            $(this).remove();
        } else if ($(this).attr('href') !== "") {
            $(this).css('display', 'inline-block');
        }
    });

    //______________________________________________________________________________________

    // Looks for text in nav links. If empty, removes parent container (individual nav component)

    $(".floating-nav ul li a p").each(function () {
        if (!$(this).text().trim().length) {
            $(this).parents(".floating-nav").css("display", "none");
        }
    });


    $("#text-nav-section h3").each(function () {
        if (!$(this).text().trim().length) {
            $(this).parent().css("display", "none");
        }
    });


    $(".photo-pod .pod .pod-text h2, .photo-pod .pod .pod-text h3, .photo-pod .pod .pod-text p").each(function () {
        if (!$(this).text().trim().length) {
            $(this).remove();
        }
    });

    // For Wait Times 'Save My Spot' - label has data? No? hide.
    $('.returnContainer.waitTimes a div.saveMySpot p').each(function () {
        if (!$(this).text().trim().length) {
            $(this).parentsUntil('div.facility').remove();
        }
    });

    // For Locations 'Save My Spot' - label has data? No? hide. Dupe this - somewhat different parent structure.
    $('.returnContainer.locations a div.saveMySpot p').each(function () {
        if (!$(this).text().trim().length) {
            $(this).parentsUntil('div.addressWait').remove();
        }
    });

    // For Locations Detail 'Services: More Information' - h4 has data? No? hide whole accordion.
    $('div.returnContainer.waitTimes.services div.accordion h4.accordion-header-sm').each(function () {
        if (!$(this).text().trim().length) {
            $(this).parent('div.accordion').remove();
        }
    });

    $('.facility .saveMySpot').each(function () {
        if ($(this).attr('href') === '') {
            $(this).hide();
        }
    });



    // For Patient Stories - has photo? No? hide img element, keep div width for spacing.

    //Don't use this. relay on default blank PNG image, if no image is available.
    // $('div.storyPhoto.description').each(function(){
    // 	if ($(this).find('img').attr('src') === '') {
    // 		$(this).addClass('noImage');
    // 	}
    // });


    //______________________________________________________________________________________

    // $(".photo-pod .pod .pod-text h2").each(function(){
    //     if($(this).text().trim().length) {
    //         $(this).closest('.photo-pod')
    //     }
    // });

    //______________________________________________________________________________________

    // Removes elements if empty

    $(".hero-container img").each(function () {
        if ($(this).attr('src') === "") {
            $(this).remove();
        }
    });


    //______________________________________________________________________________________

    // Paragraph styles when bolded

    // $("p, p.paragraph-content").each(function(){
    //     if ($(this).find('> strong').length) {
    //     	$(this).css({
    //     		'margin' : '0px'
    //     	});
    //     }

    // });

    //______________________________________________________________________________________

    //don't show empty landing page pods in mobile
    $('#pod-empty').children().remove();

    //______________________________________________________________________________________

    //find the last search drop down to take away right margin.
    $('.eventTypeContainer .btn-group:last').addClass('last');

    //______________________________________________________________________________________

    // Remove unnecessary photo pod elements from quote pod

    function quotePodHeight() {
        $('.podContainer .photo-pod').each(function () {
            var photoPodHeight = $('.photo-pod').height();
            console.log(photoPodHeight);

            if ($(this).hasClass('quote-pod')) {
                $(this).find('.pod-image, i.fa').remove();
                $(this).css('height', photoPodHeight);
            }

        });
    }

    //______________________________________________________________________________________

    // Remove mileage styles if mileage is not present

    $(".facility").each(function () {
        var facilityMileage = $(this).find('#distance .mileage');
        if (!$.trim(facilityMileage.html()).length) {
            facilityMileage.parent().next('.icon-container').remove();
            $(this).find('#distance a').css('border-right', 'none');
        }
    });

    //______________________________________________________________________________________


    // Run scripts on window resize

    $(window).resize(function () {

        //______________________________________________________________________________________

        heroEvents();

        //______________________________________________________________________________________

        quotePodHeight();

        //______________________________________________________________________________________



    });

    //END Window Resize function


});