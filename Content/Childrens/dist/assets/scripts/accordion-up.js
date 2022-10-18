$(function () {
    $(document).ready(function () {
        $('.content-panels .panel-heading').on('click', function (e) {
                $('.content-panels section .panel-default').each(function () {
                    if ($(this).hasClass('active')) {
                        var currentElement = $(this);
                        var offset = currentElement.offset();
                        if (offset) {
                            setTimeout(function () {
                                $('html,body').animate({
                                    scrollTop: currentElement.offset().top
                                }, 500);
                            }, 500);
                        }
                    }
                });
        });

        $('.content-panels .accordion-heading').on('click', function (e) {
            $('.content-panels section .panel-body .row .panel-group  .accordion-heading').each(function () {
                if ($(this).hasClass('active')) {
                    var currentElement = $(this);
                    var offset = currentElement.offset();
                    if (offset) {
                        setTimeout(function () {
                            $('html,body').animate({
                                scrollTop: currentElement.offset().top
                            }, 500);
                        }, 500);
                    }
                }
            });
        });
    });
});