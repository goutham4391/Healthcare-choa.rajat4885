function trackCurrentLocation()
{
    var currentLatitude = getCookie('latitude');
    var currentLongitude = getCookie('longitude');

    if (currentLatitude === '' || currentLongitude === '') {
        getCurrentLocation();
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    }
}

function setPosition(position) {
    document.cookie = "latitude=" + position.coords.latitude + "; domain=" + document.domain;
    document.cookie = "longitude=" + position.coords.longitude + "; domain=" + document.domain;
    window.location.reload(true);
}