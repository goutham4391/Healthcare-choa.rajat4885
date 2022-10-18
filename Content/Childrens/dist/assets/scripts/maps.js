var lastOpenInfoWin = null;
var markers = [];
var styles = [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "administrative.neighborhood", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "landscape.natural.terrain", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.government", "elementType": "geometry.stroke", "stylers": [{ "visibility": "simplified" }, { "hue": "#ff0000" }, { "saturation": "-25" }] }, { "featureType": "poi.medical", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "saturation": "16" }, { "gamma": "0.26" }, { "color": "#ffeaab" }] }, { "featureType": "poi.medical", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.medical", "elementType": "labels.icon", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "hue": "#70ff00" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "lightness": "-2" }] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry.fill", "stylers": [{ "color": "#fdb824" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "hue": "#ff0000" }, { "weight": "0.01" }, { "saturation": "48" }] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }, { "saturation": "47" }, { "color": "#747474" }] }, { "featureType": "road.local", "elementType": "labels.icon", "stylers": [{ "visibility": "on" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [{ "visibility": "off" }, { "color": "#ff0000" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#0080c4" }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "lightness": "55" }, { "saturation": "-50" }, { "color": "#53bceb" }] }];


function createInfoWindow(marker, locationPin) {

    google.maps.event.addListener(marker, 'click', function () {
        openToolTip(marker, locationPin);
    });
    
    
}

function openToolTip(marker, locationPin) {
    var showUrl = locationPin[8];
    var showDistance = locationPin[9];
    var distance = locationPin[10];

    var content = "";

    if (showUrl === 'True') {
        if (showDistance === 'True') {
            content = "<br><p class='name'>" + locationPin[0] + "</p><p class='tooltipAddress'>" + locationPin[5] + "</p><p style='color:#008ac6;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700'>" + distance + " mi <i class='fa fa-map-marker'></i></p><div class='row'><a href='" + locationPin[6] + "' class='page-link' style='margin:0px !important;'>View details</a></div><div class='row'><a target='_blank' href='" + locationPin[7] + "' class='page-link'>Get directions</a></div>";
        }
        else {
            content = "<br><p class='name'>" + locationPin[0] + "</p><p class='tooltipAddress'>" + locationPin[5] + "</p><div class='row'><a href='" + locationPin[6] + "' class='page-link' style='margin:0px !important;'>View details</a></div><div class='row'><a target='_blank' href='" + locationPin[7] + "' class='page-link'>Get directions</a></div>";
        }

    }
    else {
        if (showDistance === 'True') {
            content = "<br><p class='name'>" + locationPin[0] + "</p><p class='tooltipAddress'>" + locationPin[5] + "</p><p style='color:#008ac6;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700'>" + distance + " mi <i class='fa fa-map-marker'></i></p><div class='row'><a target='_blank' href='" + locationPin[7] + "' class='page-link' style='margin-top:0px !important;'>Get directions</a></div>";
        }
        else {
            content = "<br><p class='name'>" + locationPin[0] + "</p><p class='tooltipAddress'>" + locationPin[5] + "</p><div class='row'><a target='_blank' href='" + locationPin[7] + "' class='page-link' style='margin-top:0px !important;'>Get directions</a></div>";
        }

    }

    var infowindow = new google.maps.InfoWindow({
        content: content,
        maxWidth: 300
    });

    if (lastOpenInfoWin) { lastOpenInfoWin.close(); }
    lastOpenInfoWin = infowindow;
    infowindow.open(marker.get('map'), marker);
    google.maps.event.addListener(infowindow, 'domready', function () {
        setInfoWindowPan(infowindow)
    });

}

function setInfoWindowPan(infowindow) {    
    var center = infowindow.getPosition();
    newlat=center.lat() +.006;    
    locationMap.panTo(new google.maps.LatLng(newlat, center.lng()));
}

function setMarkers(map) {
    var iconBase = '/Content/Childrens/dist/assets/images/';
    var icons = {
        other: {
            icon: iconBase + 'map-pin-clinic-small.png'
        },
        emergency: {
            icon: iconBase + 'map-pin-hospital-small.png'
        },
        urgentcare: {
            icon: iconBase + 'map-pin-urgent-care-small.png'
        },
        telemedicine: {
            icon: iconBase + 'map-pin-telemed-small.png'
        }
    };

    for (var i = 0; i < locations.length; i++) {
        var locationPin = locations[i];
        var locationLat = ""
        var locationLong = ""
        if (!locationPin[1] || !locationPin[2]) {
            geocodeAddress(locationPin);

        } else {
            locationLat = locationPin[1]
            locationLong = locationPin[2]


            var marker = new google.maps.Marker({
                position: { lat: locationLat, lng: locationLong },
                map: map,

                icon: icons[locationPin[4]].icon,
                title: locationPin[0],
                zIndex: locationPin[3]
            });

            markers.push(marker);
            createInfoWindow(marker, locationPin);
        }

    }
}

function geocodeAddress(locationArray) {
    the_address = locationArray[5];
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': the_address
    }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            // resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: locationMap,
                position: results[0].geometry.location
            });
            markers.push(marker);
            createInfoWindow(marker, locationArray);
            setZoom(locationMap);
        } else {
            //alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function setZoom(locationMap) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
    }
    if (markers.length == 1) {
        locationMap.setZoom(14);
        locationMap.setCenter(markers[0].getPosition());
    } else {
        locationMap.fitBounds(bounds);
        locationMap.panToBounds(bounds);
    }
}

var locationMap;
function initMap() {
    if (typeof latitude == 'undefined' || latitude == null) {
        var latitude = 33.749249;
    }
    if (typeof longitude == 'undefined' || longitude == null) {
        var longitude = -84.5606888;
    }

    if (locations.length == 1) {
        locationMap = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: { lat: latitude, lng: longitude },
            styles: styles
        });
    }
    else {
        locationMap = new google.maps.Map(document.getElementById('map'), {
            center: { lat: latitude, lng: longitude },
            styles: styles
        });
    }

    setMarkers(locationMap);

    if (markers.length == 1 && locations.length == 1) {
        setTimeout(function () { openToolTip(markers[0], locations[0]); }, 500);
    }
    else {
        setZoom(locationMap);
    }

    locationMap.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('legend'));

    setTimeout(function () {
        $('#legend').css('display', 'block');
    }, 500);


}