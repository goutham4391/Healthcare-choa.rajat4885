function locationSearchApplyFilters() {

    var types = [];
    var specialties = [];
    
    $('#type_facet_category :checked').each(function () {
        types.push($(this).val());
    });
    $('#locationtype').val(types.join(','));

    $('#specialties_facet_category :checked').each(function () {
        specialties.push($(this).val());
    });
    $('#locationserviceline').val(specialties.join(','));

    $('#distance_facet_category :checked').each(function () {
        $('#distance').val($(this).val());
    });

    if ($('#type_facet_category :checked').length === 0) {
        $('#type').val("");
    }

    if ($('#distance_facet_category :checked').length === 0) {
        $('#distance').val("");
    }

    locationSearchSubmit();
}

function locationSearchClear() {

    $("input:checkbox").each(function () {
        $(this).removeAttr('checked');
    });

    $("input:radio").each(function () {
        $(this).removeAttr('checked');
    });

    $('#locationtype').val("");
    $('#locationserviceline').val("");
    $('#distance').val("");

    locationSearchSubmit()
}

function locationSearchReset()
{ 
    $("input[type=search]").val("");

    $("input:checkbox").each(function () {
        $(this).removeAttr('checked');
    });

    $("input:radio").each(function () {
        $(this).removeAttr('checked');
    });

    $('#locationtype').val("");
    $('#locationserviceline').val("");
    $('#distance').val("");

    $('#locations-search').trigger("submit");
}

function locationSearchSubmit() {
    $('#locations-search').trigger("submit");
}


$(document).ready(function () {

    $('.locationRemoveFilterBtn').click(function () {

        var removeFilterValue = $(this).parent().prev().text();
        if (removeFilterValue) {
            $('#type_facet_category :checked').each(function () {
                if (removeFilterValue === $(this).val()) {
                    $(this).removeAttr('checked');
                }
            });

            $('#specialties_facet_category :checked').each(function () {
                if (removeFilterValue === $(this).val()) {
                    $(this).removeAttr('checked');
                }
            });

          

            $('#distance_facet_category :checked').each(function () {
                removeFilterValue = removeFilterValue.replace(' miles', '').replace('+', '');
                if (removeFilterValue === $(this).val() || $(this).val() > 2145) {
                    $(this).removeAttr('checked');
                }
            });

            locationSearchApplyFilters();
        }
    });

});