$(function () {
    while ($('.accordion-placeholder').length) {
        groupAccordionComponents($('.accordion-placeholder:first'));
    }
});

function groupAccordionComponents($accordion)
{
    while ($accordion.next().hasClass('accordion-placeholder')) {
        $accordion.next().replaceWith($accordion.next().contents());
        $accordion.next().appendTo($accordion);
    }
    $accordion.attr('class', 'accordion');
}