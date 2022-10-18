


// BIO LINE CLAMPING (hides bios longer than 5 lines)

// only show bio read more when height exceeds 150
var minHeight = 149;
$('.read-more').show();

$(function () {


    // restrict visible height and hide read more button
    $(".bio.line-clamp").each(function () {
        var $this = $(this),
            $readmore = $('.read-more', this),
            h = $this.height();
        $readmore.css({ 'display': 'block' });
        if (h < minHeight) {
            $readmore.hide();
        }
    });


    // reveal hidden portion of bio
    var $el, $ps, $up, totalHeight;

    $(".bio .button").click(function () {

        totalHeight = minHeight;

        $el = $(this);
        $p = $el.parent();
        $up = $p.parent();
        $ps = $up.find("p:not('.read-more')");

        $ps.each(function () {
            totalHeight += $(this).outerHeight();
        });

        console.log($up.height());
        //$up.css({ "height": $up.height(), "max-height": 9999 })
        $up.css({ "height": $up.height(), "max-height": 9999 })
            .animate({ "height": totalHeight }, function () {
                $up.css({
                    // allow brower resize
                    "height": "auto",
                    "overflow": "visible"
                });
            });
        $p.fadeOut();
        return false;

    });
});


// temporary header history back 
//$('.header-back .back').on("click", function (e) {
//    e.preventDefault;
//    window.history.go(-1);
//});
$.widget("custom.headercomplete", $.ui.autocomplete, {
    _create: function () {
        this._super();
        this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
    },
    _renderMenu: function (ul, items) {
        var that = this;
        if (items && items.length > 0)
            that._renderItemData(ul, $("#search").val());
        $.each(items, function (index, item) {
            that._renderItemData(ul, item);
        });
    }
});


$("#search").headercomplete({
    minLength: 3,
    source: function (request, response) {
        var autoUrl = $('#frmAutoComplete').attr('action');

        $.ajax({
            url: autoUrl,
            cache: false,
            type: "POST",
            data: {
                term: request.term,
            },
            context: this,
            traditional: true,
            success: function (data) {
                if (data != null && data.Results != '') {
                    $('#searchAutoComplete').html(data.Results)
                }

                form = $('#myModal form');
                searchUrl = form.attr('action');
                $('.searchTopicLink').each(function () {
                    tab = $(this).attr('tab');
                    $(this).attr('href', '/search?&q=' + request.term + '&tab=' + tab);
                });
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    }
});

function bindAutoComplete() {
    $("#search").catcomplete({
        minLength: 3,
        source: function (request, response) {
            var autoUrl = $('#frmAutoComplete').attr('action');
            $.ajax({
                url: autoUrl,
                type: "POST",
                data: {
                    term: request.term,
                },
                success: function (data) {
                    var result = JSON.parse(data);
                    response(result);
                }
            });
        }
    });
}

// hide autocomplete when modal is closed
$('#myModal .close').on("click",
    function () {
        $('.ui-autocomplete').hide();
    }
);

//PERFORMING SEARCH --------------------------
$('#search1').on('keypress',
    function (e) {
        //enter key press
        if (e.which === 13) {
            e.preventDefault();
            Search.performNewSearch($('#search1').val(), localStorage.getItem("selectedTab"));
        }
    }
);

$('#mobile-search').on('keypress',
    function (e) {
        //enter key press
        if (e.which === 13) {
            e.preventDefault();
            Search.performNewSearch($('#mobile-search').val());
        }
    }
);

$('#search').on('keypress',
    function (e) {
        //enter key press
        if (e.which === 13) {
            e.preventDefault();
            Search.performNewSearch($('#search').val());
        }
    }
);

$('#search-zip').on('keypress',
    function (e) {
        //enter key press
        if (e.which === 13) {
            e.preventDefault();
            Facets.onFacetClick($('#search-zip').val(), 'zip', true);
            //Search.performNewSearch($('#search1').val(), localStorage.getItem("selectedTab"));
        }
    }
);

// hide modal and autocomplete with ESC key
$(document).keydown(function (event) {
    if (event.keyCode == 27) {
        $('.modal').modal("hide");
        $('.ui-autocomplete').hide();
    }
});


var Search = {
    performNewSearch: function (term, tab) {
        window.location.href = '/search' + "?q=" + term + "&tab=" + tab + "&zip=" + $("#search-zip").val();
    },

    useCurrentLocation: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(Search.setLocationCookies);
        }
    },

    setLocationCookies: function (position) {
        /* document.cookie = "latitude=" + position.coords.latitude + "; domain=" + document.domain;
        document.cookie = "longitude=" + position.coords.longitude + "; domain=" + document.domain; */
        var latlng = { lat: position.coords.latitude, lng: position.coords.longitude };
        geocoder = new google.maps.Geocoder;
        geocoder.geocode({ 'location': latlng }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    zipCodeFromGoogle = '';
                    for (var i = 0; i < results[0].address_components.length; i++) {
                        var addr = results[0].address_components[i];
                        if (addr.types[0] == 'postal_code') {
                            zipCodeFromGoogle = addr.long_name;

                        }
                    }
                    $('#search-zip').val(zipCodeFromGoogle);
                    Facets.onFacetClick($('#search-zip').val(), 'zip', true);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });

        //Search.loadSearchResults();
    },

    loadSearchResults: function (pageNumber) {
        var tab = localStorage.getItem("selectedTab");
        if (tab === "events") {
            Search.loadEvents(pageNumber);
        }
        else if (tab === "locations") {
            Search.loadLocations(pageNumber);
        }
        else if (tab === "doctors") {
            if (Facets.getFacetValues("random") == null || Facets.getFacetValues("random").length < 1) {
                var rand = 0;

                var originalUrl = window.location.href;
                if (originalUrl.search("ran=") > -1) {
                    rand = getParameterByName('ran');
                }
                else {
                    rand = Math.floor(Math.random() * 101);
                    if (history.pushState) {
                        var newurl = window.location.href + '&ran=' + rand;
                        window.history.pushState({ path: newurl }, '', newurl);
                    }
                }
                localStorage.setItem('random', rand);

                if (originalUrl.search("pag=") > -1) {
                    pageNumber = getParameterByName('pag');
                }
            }
            Search.loadDoctors(pageNumber);
        }
        else {
            tab = "resources";
            Search.loadResources(pageNumber);
        }
        console.log(Facets.getFacetString());

    },

    loadLocations: function (pageNumber) {

        var url = $('#frmLocationsSearchResults').attr('action');
        var query = $("#search1").val();
        locationTypes = Facets.getFacetValues("location_type");
        serviceLines = Facets.getFacetValues("location_service_lines");
        distance = Facets.getFacetValues("d");

        if (!pageNumber) {
            pageNumber = 1;
        }
        zip = Facets.getFacetValues("zip");
        /*  if ($("#search-zip").val() != 'undefined') {
             zip = $("#search-zip").val();
         } */
        if (zip.length > 0) {
            var zipText = zip[0];
        }
        $.ajax({
            url: url,
            data: {
                q: query,
                s: ((pageNumber - 1) * 10),
                servicesAndConditions: serviceLines,
                locationtype: locationTypes,
                distance: distance,
                zip: zipText
            },
            cache: false,
            type: "POST",
            context: this,
            traditional: true,
            success: function (data) {
                if (pageNumber == 1 && data != null) {

                    $("#filter-nav-sec").html(data.Facets);
                    $("#facetTokens").empty();
                    Facets.addFacets(serviceLines, "location_service_lines");
                    Facets.addFacets(locationTypes, "location_type");
                    Facets.addFacets(distance, "d");
                    Facets.addFacets(zip, "zip");
                    Facets.initFacets();
                }
                navFiltersWithoutAnimation();
                if (data != null && data.Results != '') {
                    $("#locations").html(data.Results);
                    //Search.initPagination();
                }
                if ($("#map-pins") && data.Map != null && data.Map != '') {
                    $("#map-pins").replaceWith(data.Map);
                }
                getLocations();
                initMap();
            },
            error: function (xhr, status, error) {
                // dismiss the progress spinner
                // $('.loader').fadeOut();
                // $('.loader-container').removeClass('active');
                console.log(xhr.responseText);
            }
        });
    },

    loadResources: function (pageNumber) {

        var url = $('#frmResourcesSearchResults').attr('action');
        var query = $("#search1").val();
        pageTypes = Facets.getFacetValues("page_type");
        servicesAndConditions = Facets.getFacetValues("services_and_conditions");

        if (!pageNumber) {
            pageNumber = 1;
        }

        $.ajax({
            url: url,
            data: {
                q: query,
                s: ((pageNumber - 1) * 10),
                servicesAndConditions: servicesAndConditions,
                types: pageTypes
            },
            cache: false,
            type: "POST",
            context: this,
            traditional: true,
            success: function (data) {
                console.log(JSON.stringify(data));
                if (pageNumber == 1 && data != null) {

                    if (data.Results != "") {
                        //$('#noResultsFound').hide();
                        //$('#results').show();
                    } else {
                        //$('#noResultsFound').show();
                        // $('#results').hide();
                    }

                    $("#alternateSearch").replaceWith(data.DidYouMean);
                    $("#filter-nav-sec").html(data.Facets);
                    $("#facetTokens").empty();
                    Facets.addFacets(servicesAndConditions, 'services_and_conditions');
                    Facets.addFacets(pageTypes, "page_type");


                }
                navFiltersWithoutAnimation();
                if (data != null && data.Results != '') {
                    $("#" + tab).html(data.Results);
                    //Search.initPagination();
                    Search.addDocumentIcons();
                }
                Facets.initFacets();
                for (let index = 0; index < servicesAndConditions.length; index++) {
                    const serviceFiltered = servicesAndConditions[index];
                    if ($(".link.facetLink[value='" + serviceFiltered + "']").length) {
                        $(".link.facetLink[value='" + serviceFiltered + "']").hide();
                    }

                }
            },
            error: function (xhr, status, error) {
                // dismiss the progress spinner
                // $('.loader').fadeOut();
                // $('.loader-container').removeClass('active');
                console.log(xhr.responseText);
            }
        });

    },

    loadEvents: function (pageNumber) {

        var url = $('#frmEventsSearchResults').attr('action');
        var query = $("#search1").val();
        pageTypes = Facets.getFacetValues("event_types");
        servicesAndConditions = Facets.getFacetValues("events_services_and_conditions");
        eventCategories = Facets.getFacetValues("event_categories");
        eventTypes = Facets.getFacetValues("event_types");
        eventDate = Facets.getFacetValues("event_month_year");

        if (!pageNumber) {
            pageNumber = 1;
        }

        $.ajax({
            url: url,
            data: {
                q: query,
                s: ((pageNumber - 1) * 10),
                servicesAndConditions: servicesAndConditions,
                eventCategories: eventCategories,
                eventTypes: eventTypes,
                eventMonthYear: eventDate
            },
            cache: false,
            type: "POST",
            context: this,
            traditional: true,
            success: function (data) {

                if (pageNumber == 1 && data != null) {

                    if (data.Results != "") {
                        //$('#noResultsFound').hide();
                        //$('#results').show();
                    } else {
                        //$('#noResultsFound').show();
                        // $('#results').hide();
                    }

                    $("#filter-nav-sec").html(data.Facets);
                    $("#facetTokens").empty();
                    Facets.addFacets(servicesAndConditions, 'events_services_and_conditions');
                    Facets.addFacets(eventCategories, "event_categories");
                    Facets.addFacets(eventTypes, "event_types");
                    if (eventDate.length != 0) {
                        Facets.selectDropDownFacet(eventDate, "event_month_year");
                        $('#sel1').val(eventDate).selectmenu('refresh')
                    } else {
                        $('#sel1 option:contains("Select Month")').prop('selected', true);
                        $('#sel1').selectmenu("refresh");
                    }
                    Facets.initDatePicker();


                }
                navFiltersWithoutAnimation();
                if (data != null && data.Results != '') {
                    $("#" + tab).html(data.Results);
                    //Search.initPagination();
                }
                Facets.initFacets();
            },
            error: function (xhr, status, error) {
                // dismiss the progress spinner
                // $('.loader').fadeOut();
                // $('.loader-container').removeClass('active');
                console.log(xhr.responseText);
            }
        });

    },

    loadDoctors: function (pageNumber) {

        var url = $('#frmDoctorsSearchResults').attr('action');
        var query = $("#search1").val();
        specialty = Facets.getFacetValues("specialties");
        providerType = Facets.getFacetValues("group_provider_type");
        language = Facets.getFacetValues("languages");
        gender = Facets.getFacetValues("gender");
        distance = Facets.getFacetValues("d");
        network = Facets.getFacetValues("network");
        random = Facets.getFacetValues("random");
        zip = Facets.getFacetValues("zip");
        /*  if ($("#search-zip").val() != 'undefined') {
             zip = $("#search-zip").val();
         } */
        if (zip.length > 0) {
            var zipText = zip[0];
        }
        if (!pageNumber) {
            pageNumber = 1;
        }

        $.ajax({
            url: url,
            data: {
                q: query,
                s: ((pageNumber - 1) * 10),
                specialty: specialty,
                languagesspoken: language,
                gender: gender,
                type: providerType,
                distance: distance,
                network: network,
                zip: zipText,
                r: random
            },
            cache: false,
            type: "POST",
            context: this,
            traditional: true,
            success: function (data) {

                if (pageNumber == 1 && data != null) {


                    $("#filter-nav-sec").html(data.Facets);
                    $("#facetTokens").empty();

                    //Call Add facets here
                    Facets.addFacets(specialty, "specialties");
                    Facets.addFacets(language, "languages");
                    Facets.addFacets(gender, "gender");
                    Facets.addFacets(providerType, "group_provider_type");
                    Facets.addFacets(network, "network");
                    Facets.addFacets(distance, "d");
                    Facets.addFacets(zip, "zip");

                    Facets.initFacets();
                }
                navFiltersWithoutAnimation();
                if (data != null && data.Results != '') {
                    $("#" + tab).html(data.Results);
                    //Search.initPagination();
                    Facets.initDoctorLocations();
                    Facets.initDoctorBadges();
                }
            },
            error: function (xhr, status, error) {
                // dismiss the progress spinner
                // $('.loader').fadeOut();
                // $('.loader-container').removeClass('active');
                console.log(xhr.responseText);
            }
        });

    },

    //initPagination: function () {
    //    $('.pagination-link').on("click", function (e) {
    //        linkText = this.innerText;
    //        pageNumber = parseInt(linkText);
    //        Search.goToPage(pageNumber);
    //    }

    //    );
    //    $("div.pagination ul.pagination").not('div.pagination.alpha-filter ul.pagination').rPage();
    //},

    //goToPage: function (page) {
    //    $('html,body').animate({ scrollTop: $("#results").offset().top - 15 }, 'slow');
    //    Search.loadSearchResults(page);
    //},

    addDocumentIcons: function () {
        $("#resources a[href$='pdf']").closest('.result-container').addClass("pdf");
        $("#resources a[href$='pdfx']").closest('.result-container').addClass("pdf");
        $("#resources a[href$='ppt']").closest('.result-container').addClass("ppt");
        $("#resources a[href$='pptx']").closest('.result-container').addClass("ppt");
        $("#resources a[href$='xls']").closest('.result-container').addClass("xls");
        $("#resources a[href$='xlsx']").closest('.result-container').addClass("xls");
        $("#resources a[href$='doc']").closest('.result-container').addClass("doc");
        $("#resources a[href$='docx']").closest('.result-container').addClass("doc");
    }
}


// FACETS --------------------------------
var Facets = {

    // "location_type", "");
    // "location_service_lines", "");

    // "d", "");
    // "page_type", "");
    // "services_and_conditions", "");


    // "gender", "");
    // "languages", "");
    // "group_provider_type", "");
    // "specialties", "");
    // "network", "");

    // "events_services_and_conditions", "");
    // "event_categories", "");
    // "event_types", "");
    // "event_month_year", "");
    // 'random', "");

    addFacets: function (facetArray, facetName) {
        if (facetName !== 'zip') {
            for (index = 0; index < facetArray.length; index++) {
                element = facetArray[index];
                id = facetName + '-' + element.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, '');
                $('#' + id).attr('checked', true);
                if ($('#' + id).val() && $('#' + id).val() !== '') {
                    element = $('#' + id).val()
                }
                Facets.addFacetToken(element, facetName);
            }
        } else {
            if (facetArray.length > 0) {
                $("#search-zip").val(facetArray[0]);
                Facets.addFacetToken(facetArray[0], facetName);
            } else {
                $("#search-zip").val('');
            }
        }

    },

    selectDropDownFacet: function (facetArray, facetName) {
        for (index = 0; index < facetArray.length; index++) {
            element = facetArray[index];
            id = facetName + '-' + element.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, '');
            $('#' + id).attr('checked', true);

            Facets.addFacetToken(element, facetName);
        }
    },

    onFacetClick: function (facet, facetField, singleSelect) {
        if (typeof b == 'undefined') {
            b = false;
        }
        if (singleSelect) {
            localStorage.setItem(facetField, "")
        }
        if (facet === "clear" || facet === "") {
            localStorage.setItem(facetField, "")
            pageNumber = 1;
            //Search.loadSearchResults();
            window.location.href = Facets.getFacetString()
            return;
        }

        tagids = Facets.getFacetValues(facetField);

        if (tagids.indexOf(facet) > -1) {
            tagids = $.grep(tagids,
                function (value) {
                    return value != facet;
                });
        } else {
            tagids.push(facet);
        }
        localStorage.setItem(facetField, JSON.stringify(tagids));
        if (facet == "Select Month") {
            localStorage.setItem(facetField, "")
        }
        pageNumber = 1;
        var width = $(window).width();
        if (width <= 979) {
            $('html,body').animate({ scrollTop: $("#results").offset().top - 15 }, 'slow');

        }
        //Search.loadSearchResults();
        var newUrl = Facets.getFacetString();
        window.location.assign(newUrl);
    },

    addFacetToken: function (facet, facetField) {
        var $a = $("<a>", { "class": "close", "value": facet, "data-field": facetField, text: 'x', "tabindex": -1 });
        $a.off().on("click", function (e) {
            $(this).parent().fadeOut("fast", function () {
                Facets.onFacetClick(facet, facetField);
            });
            e.preventDefault();
        });
        facetText = facet;
        if (facetText == "F") {
            facetText = "Female"
        } else if (facetText == "M") {
            facetText = "Male"
        } else if (facetText == "is_tccn") {
            facetText = "TCCN"
        }
        var $span = $("<span>", { "class": "token-label", text: facetText });
        var $div = $("<div>", { "class": "token", "style": "display:none;" });
        $div.append($span);
        $div.append($a);
        $("#facetTokens").append($div);
        $div.fadeIn("fast");
    },

    initFacets: function () {
        $(".facetLink").off().on("click", function () {
            isSingleSelect = $(this).attr("type") == "radio";
            Facets.onFacetClick($(this).attr("value"), $(this).attr("name"), isSingleSelect);
        });
    },

    initDoctorLocations: function () {
        // see all locations modal launcher
        $('.see-all-locations').on("click", function (e) {
            e.preventDefault();
            $('#modalLocations .location-content').empty();
            $(this).siblings().clone().appendTo('#modalLocations .location-content');
            doctorName = $(this).attr("data-doctor");
            $('#modalDoctorName').html("Locations for " + doctorName);
            $("#modalLocations").modal();
        });
    },

    initDoctorBadges: function () {
        // tooltips
        $('[data-toggle="tooltip"]').tooltip({
            animated: 'fade',
            placement: 'bottom',
            html: true,
            delay: { show: 100, hide: 300 }
        });
        $('[data-toggle="tooltip"]').on('mouseleave', function () {
            $('[data-toggle="tooltip"]').tooltip('hide');
        });
    },

    getFacetValues: function (facetName) {
        facetValues = localStorage.getItem(facetName);
        facets = [];
        if (facetValues && facetValues != 'undefined') {
            facets = JSON.parse(facetValues);
        }
        return facets;
    },

    setFacetsFromUrl: function () {
        if (getUrlVars()["tab"] === "events") {
            Facets.setEventFacetsFromUrl();
        } else if (getUrlVars()["tab"] === "doctors") {
            Facets.setDoctorFacetsFromUrl()
        } else if (getUrlVars()["tab"] === "locations") {
            Facets.setLocationFacetsFromUrl()
        } else {
            Facets.setResourceFacetsFromUrl()
        }
    },

    setUrlFacetsFromArray: function (arrayOfFacetFields) {
        for (index = 0; index < arrayOfFacetFields.length; index++) {
            facetFromUrlField = arrayOfFacetFields[index];
            if (getUrlVars()[facetFromUrlField] !== undefined && getUrlVars()[facetFromUrlField].length > 0) {
                services = getUrlVars()[facetFromUrlField];
                services = services.replace(/\+|%20/g, " ");
                tags = services.split('||');
                localStorage.setItem(facetFromUrlField, JSON.stringify(tags));
            }
        }
    },

    setResourceFacetsFromUrl: function () {
        Facets.setUrlFacetsFromArray(["page_type", "services_and_conditions"]);
    },

    setLocationFacetsFromUrl: function () {

        Facets.setUrlFacetsFromArray(["location_type", "location_service_lines", "d", "zip"]);
    },

    setDoctorFacetsFromUrl: function () {

        Facets.setUrlFacetsFromArray(["specialties", "languages", "gender", "group_provider_type", "d", "random", "zip"]);

        if (getUrlVars()['network'] !== undefined && getUrlVars()['network'].length > 0) {
            network = getUrlVars()['network'];
            network = network.replace(/\+|%20/g, " ");
            //a special fix for the network tag that contains an apostrophe 's'
            network = network.replace(/%27/g, "’");
            tags = network.split('||')
            localStorage.setItem("network", JSON.stringify(tags));
        }

    },

    setLocationFacetsFromUrl: function () {

        Facets.setUrlFacetsFromArray(["location_type", "location_service_lines", "d", "zip"]);
    },

    setEventFacetsFromUrl: function () {
        Facets.setUrlFacetsFromArray(["event_categories", "events_services_and_conditions", "event_types"]);

        months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        if (getUrlVars()['event_month_year'] !== undefined && getUrlVars()['event_month_year'].length > 0) {
            date = new Date(getUrlVars()['event_month_year'].replace('+', ' 1 '));
            monthNum = date.getMonth();
            month = months[monthNum];
            tags = [];
            tags.push(month + ' ' + date.getFullYear());
            localStorage.setItem("event_month_year", JSON.stringify(tags));
        }
    },

    getUrlSafeStringFromFacet: function (facetNameInStorage) {
        facetValue = localStorage.getItem(facetNameInStorage);
        if (facetValue && facetValue !== "" && facetValue !== "[]") {
            return JSON.parse(facetValue).join("||").replace(/\s/g, '+').replace(/’/g, "%27");
        } else {
            return "";
        }
    },

    getFacetString: function () {

        tab = localStorage.getItem("selectedTab");
        url = "//" + window.location.host + '/search' + '?q=' + $("#search1").val() + '&zip=' + Facets.getUrlSafeStringFromFacet("zip") + '&tab=' + tab;
        if (tab === "events") {
            eventServicesFromUrl = '&events_services_and_conditions=' + Facets.getUrlSafeStringFromFacet("events_services_and_conditions");
            eventCategoriesFromUrl = '&event_categories=' + Facets.getUrlSafeStringFromFacet("event_categories");
            eventTypeFromUrl = '&event_types=' + Facets.getUrlSafeStringFromFacet("event_types");
            eventMonthYearFromUrl = '&event_month_year=' + Facets.getUrlSafeStringFromFacet("event_month_year");
            url = url + eventServicesFromUrl + eventCategoriesFromUrl + eventTypeFromUrl + eventMonthYearFromUrl;
        }
        else if (tab === "locations") {
            locationTypeFromUrl = '&location_type=' + Facets.getUrlSafeStringFromFacet("location_type");
            locationServiceLinesFromUrl = '&location_service_lines=' + Facets.getUrlSafeStringFromFacet("location_service_lines");
            dFromUrl = '&d=' + Facets.getUrlSafeStringFromFacet("d");
            url = url + locationTypeFromUrl + locationServiceLinesFromUrl + dFromUrl;
        }
        else if (tab === "doctors") {
            genderFromUrl = '&gender=' + Facets.getUrlSafeStringFromFacet("gender");
            languagesFromUrl = '&languages=' + Facets.getUrlSafeStringFromFacet("languages");
            group_provider_typeFromUrl = '&group_provider_type=' + Facets.getUrlSafeStringFromFacet("group_provider_type");
            specialtiesFromUrl = '&specialties=' + Facets.getUrlSafeStringFromFacet("specialties");
            networkFromUrl = '&network=' + Facets.getUrlSafeStringFromFacet("network");
            //randomFromUrl = '&random=' + Facets.getUrlSafeStringFromFacet("random");
            dFromUrl = '&d=' + Facets.getUrlSafeStringFromFacet("d");

            url = url + genderFromUrl + languagesFromUrl + group_provider_typeFromUrl
                + specialtiesFromUrl + networkFromUrl + dFromUrl;
        }
        else {
            pageTypeFromUrl = '&page_type=' + Facets.getUrlSafeStringFromFacet("page_type");
            servicesAndConditionsFromUrl = '&services_and_conditions=' + Facets.getUrlSafeStringFromFacet("services_and_conditions");
            url = url + pageTypeFromUrl + servicesAndConditionsFromUrl;
        }
        return url;
    },

    clearFacets: function () {
        localStorage.setItem("location_type", "");
        localStorage.setItem("location_service_lines", "");

        localStorage.setItem("d", "");
        localStorage.setItem("page_type", "");
        localStorage.setItem("services_and_conditions", "");


        localStorage.setItem("gender", "");
        localStorage.setItem("languages", "");
        localStorage.setItem("group_provider_type", "");
        localStorage.setItem("specialties", "");
        localStorage.setItem("network", "");
        localStorage.setItem('random', "");

        localStorage.setItem("events_services_and_conditions", "");
        localStorage.setItem("event_categories", "");
        localStorage.setItem("event_types", "");
        localStorage.setItem("event_month_year", "");
        localStorage.setItem("zip", "");
    },

    initDatePicker: function () {
        $('#sel1').on('selectmenuchange', function (e, ui) {
            month = ui.item;
            monthElement = $(month);
            Facets.onFacetClick(month.value, 'event_month_year', true);
        });
    }

}



// set active sort item
$('.sort-option a').on("click", function (e) {
    console.log('click');
    e.preventDefault();
    $(this).parent().siblings('li').removeClass('active');
    $(this).parent().addClass('active');
});

// mobile - move facet rail to center
$(window).resize(function () {
    var width = $(window).width();
    if ($('#centerFacets').length && $('#sideFacets').length) {
        if (width <= 979 && $('#centerFacets').html().match(/^\s*$/) !== null) {
            $('#facets').appendTo('#centerFacets');

        } else if (width > 979 && $('#sideFacets').html().match(/^\s*$/) !== null) {
            $('#facets').appendTo('#sideFacets');

        }
        if ($("#sel1-menu").attr('aria-hidden') == "false") {
            $('#sel1').selectmenu("close");
        }
    }



});



$('.toggle-facets').mousedown(function () {
    $('#facets').css({ 'display': 'block' });
});
// scroll to top of facets when toggled
$('.toggle-facets').mouseup(function () {
    $('.center-facets').toggleClass('open');
    $('html,body').animate({ scrollTop: $("#results").offset().top - 15 }, 'slow');
});

// mobile - facet close button
$('.close-facets button').on("click", function () {
    $('#facets').css({ 'display': 'block' });
    $(this).parent().animate({ 'bottom': '0' }, 'fast', function () {
        $('.close-facets').parent().css({ 'overflow': 'hidden' });
        $('.center-facets').removeClass('open');
        $('.close-facets').animate({ 'bottom': '-2rem' }, 'fast', function () {
            setTimeout(function () {
                $('.close-facets').parent().css({ 'overflow': 'visible' });
                $('.close-facets').css({ 'bottom': '-1rem' });
            }, 500);
            $('html, body').stop().animate({
                scrollTop: $('#searchTabs').offset().top
            }, 600);
        });
    });
});

// mobile - close facet accordions
//if ($(window).width() > 960) {
//    $('.filter-options').addClass('active');
//} else {
//    $('.nav-arrow').removeClass('fa-minus');
//    $('.filter-options').removeClass('active');
//}

function navFiltersWithoutAnimation() {

    // Toggles chevron icons in navigation for filter

    $(".nav-item").each(function () {
        var filterOptions = $(this).next(".filter-options");

        if (filterOptions.find("ul li").length > 5) {
            filterOptions.find(".filter-see-all").css("display", "block");

            // FIRST FIND OUT HOW MANY ITEMS ARE IN THE FILTER-OPTIONS LIST

            var filterOptionsCount = $(".filter-options").length;

            for (y = 0; y < filterOptionsCount; y++) {
                var filterCount = $(".filter-options").eq(y).find("li").length;

                var destination = $(".filter-options").eq(y).find('.filter-see-all .filter-see-all-container ul');
                var destinationLength = $(".filter-options").eq(y).find('.filter-see-all .filter-see-all-container ul li').length;
                if (destinationLength <= 0 && filterCount > 5) {

                    for (x = filterCount - 1; x >= 5; x--) {
                        destination.prepend($(".filter-options").eq(y).find("li")[x].outerHTML);
                        //$( ".filter-options").eq(y).find( "li" )[x].remove(); 
                        $(".filter-options").eq(y).find("li").eq(x).remove();
                    }
                }
            }
        }

        // Add/remove 'active' class for display
        if (filterOptions.hasClass('active')) {
            //$(this).children('i').addClass('fa-minus');
            $(this).children('i').addClass('fa-chevron-up');
            filterOptions.show();
        } else {
            //$(this).children('i').addClass('fa-plus');
            $(this).children('i').addClass('fa-chevron-down');
            filterOptions.hide();
        }

    });

    $(".nav-item").off().click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        // DISPLAYS FILTERS SECTION
        var filterOptions = $(this).next(".filter-options");

        // Add/remove 'active' class for display
        if (filterOptions.hasClass('active')) {
            $(this).children('i').removeClass('fa-minus');
            $(this).children('i').addClass('fa-plus');
            //$(this).children('i').removeClass('fa-chevron-up');
            //$(this).children('i').addClass('fa-chevron-down');
            filterOptions.slideUp(measureHeight);
        } else {
            $(this).children('i').removeClass('fa-plus');
            $(this).children('i').addClass('fa-minus');
            //$(this).children('i').removeClass('fa-chevron-down');
            //$(this).children('i').addClass('fa-chevron-up');
            filterOptions.slideDown(measureHeight);
        }

        $(this).next().toggleClass("active");


    });

    // DISPLAYS 'SEE ALL' FILTES SECTION

    $('.filter-see-all-toggle').click(function () {

        // SHOWS 'SEE ALL' CONTAINER
        $(this).next('.filter-see-all-container').css('display', 'block');

        // HIDES 'SEE ALL' CONTAINER
        $(this).css('display', 'none');

    });

}

// TABS ------------------------------

function onTabClick(selectedTab) {
    Facets.clearFacets();
    Search.performNewSearch($('#search1').val(), selectedTab);
}


$('.search-submit').click(function (e) {
    e.preventDefault();
    Facets.onFacetClick($('#search-zip').val(), 'zip', true);
});

function switchTab(selectedTab) {
    $('#results').find('.tab-pane.active.in').toggleClass('active').toggleClass('in');
    $('#results').find('.tab-pane#' + selectedTab).toggleClass('active').toggleClass('in');
    $(selectedTab).tab('show');
    tab = selectedTab;
    if (tab === "doctors" || tab === "locations") {
        $("#location-form").fadeIn("fast");
    }
    else {
        $("#location-form").fadeOut("fast");
    }
    pageNumber = 1;
    localStorage.setItem("selectedTab", selectedTab);

    Search.loadSearchResults();
}

//HELPERS
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

if ($('#results').length) {
    Facets.clearFacets();
    Facets.setFacetsFromUrl();

    if (decodeURIComponent(getUrlVars()["q"]) != 'undefined') {
        $('#search1').val(decodeURIComponent(getUrlVars()["q"]));
    }
    if (getUrlVars()["tab"] != "doctors" && getUrlVars()["tab"] != "locations" && getUrlVars()["tab"] != "events" && getUrlVars()["tab"] != "resources") {
        switchTab("resources");
    } else {
        switchTab(getUrlVars()["tab"]);
    }
    jQuery("[tab-name='" + getUrlVars()["tab"] + "']").tab("show");
}



// ES5 version

'use strict';

// youtube and vimeo embedded video player
if ($('#videoUrl').length) {
    $(function () {
        var playButton = document.querySelector('.video-container a');
        if (playButton) {
            playButton.addEventListener('click', playVideo);
        }

        var videoUrl = $('#videoUrl').attr('href');
        var videoId = videoUrl.split('.com/')[1];
        if (videoUrl.indexOf('vimeo') >= 0) {
            // vimeo
            videoId = parseVimeoId(videoUrl);
            $.ajax({
                type: 'GET',
                url: 'https://vimeo.com/api/v2/video/' + videoId + '.json',
                jsonp: 'callback',
                dataType: 'jsonp',
                success: function success(data) {
                    var thumbnail_src = data[0].thumbnail_large;
                    $('#thumb_wrapper').append('<img src="' + thumbnail_src + '"/>');
                }
            });
        } else {
            // youtube
            videoId = videoId.split('v=')[1];
            $('#thumb_wrapper').append('<img src="https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg"/>');
        }

        function parseVimeoId(url) {
            var vimeoRegex = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
            var parsed = url.match(vimeoRegex);
            return parsed[1];
        };

        function playVideo(e) {
            e.preventDefault();
            e.stopPropagation();
            var videoContainer = this.parentNode;
            var videoUrl = this.href;
            var videoId = videoUrl.split('.com/')[1];
            var iframeUrl = void 0;

            if (videoUrl.indexOf('vimeo') >= 0) {
                // vimeo
                videoId = parseVimeoId(videoUrl);
                iframeUrl = 'https://player.vimeo.com/video/' + videoId + '?autoplay=1';
                $.ajax({
                    type: 'GET',
                    url: 'https://vimeo.com/api/v2/video/' + videoId + '.json',
                    jsonp: 'callback',
                    dataType: 'jsonp',
                    success: function success(data) {
                        var thumbnail_src = data[0].thumbnail_large;
                        $('#thumb_wrapper').append('<img src="' + thumbnail_src + '"/>');
                    }
                });
            } else {
                // youtube
                videoId = videoId.split('v=')[1];
                iframeUrl = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
                $('#thumb_wrapper').append('<img src="https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg"/>');
            }

            videoContainer.innerHTML = '<iframe src="' + iframeUrl + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
        }
    });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;

    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


//# sourceMappingURL=app.js.map
