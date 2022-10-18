var d = new Date();
var n = d.getTime();

var apiURL = "/Tools/CareCenters.aspx?v=" + n;

var clockwiseMDURLMask = "https://clockwisemd.com/hospitals/XXX/appointments/new";

//Arrays for Urgent care and Emergency
var WaittimesLocations = [];

//Global error state - JSON error
var ERROR = 0;

function getLocation(apiName) {

    var len = WaittimesLocations.length;
    for (var i = 0; i < len; i++) {

        if (WaittimesLocations[i].name.toString() == apiName.toString()) {
            return WaittimesLocations[i];
        };
    };
};

function setUpLocations(ajaxresult) {

    ERROR = 0;

    //console.log("Initialising array");

    //Build fast lookup of waittime data by id
    var waittimedict = {};
    ajaxresult.linked.waitTimes.forEach(function (x) {
        waittimedict[x.id] = x;
    });

    //Build fast lookup of services data by id
    var servicesdict = {};
    ajaxresult.linked.careCenterServices.forEach(function (x) {
        servicesdict[x.id] = x;
    });

    //Loop through carecenters looking for Urgent Care and Emergency
    ajaxresult.careCenters.forEach(function (center) {

        //A center may have many services - so loop through them
        center.links.services.forEach(function (service) {

            //Copy values out of linked objects
            center.waitTimeString = waittimedict[service].waitTimeString;
            center.minWaitTime = waittimedict[service].minWaitTime;
            center.maxWaitTime = waittimedict[service].maxWaitTime;
            center.waitTimeUnit = waittimedict[service].waitTimeUnit;

            center.open = servicesdict[service].open;
            center.close = servicesdict[service].close;
            center.closedMessage = servicesdict[service].closedMessage;
            center.hasParseError = servicesdict[service].hasParseError;

            if (!center.maxWaitTime) {
                center.maxWaitTime = center.minWaitTime;
            }

            if (!center.minWaitTime.toString()) {
                //console.log("location.ERROR set for " + center.name + "   (" + center.minWaitTime + ")");

                location.ERROR = true;
            } else {
                location.ERROR = false;
            };

            //Check for Urgent Care
            if (service.indexOf("Urgent Care") != -1) {
                center.locationType = "UC";
            }
                //Check for Emergency
            else if (service.indexOf("Emergency") != -1) {
                center.locationType = "ER";
            };

            WaittimesLocations.push(center);

        });

    });

    populateWaitTimes();

    showAll();
};

function getShortWaitTimeString(location) {
    if (isClosed(location)) {
        return "Closed";
    }
    else {
        //if (parseInt(location.minWaitTime) >= 120) {
        //    return "2+ Hour Wait";
        //}
        //else
        if (parseInt(location.minWaitTime) == 0 && parseInt(location.maxWaitTime) == 0) {
            return "Open";
        }
        else {
            if (location.minWaitTime === location.maxWaitTime) {
                return location.minWaitTime + " " + getLongUnits(location);
                //return "3+" + "Hour Wait";
            }
            else {
                //return location.minWaitTime + "-" + location.maxWaitTime + " " + getLongUnits(location);
                return location.maxWaitTime + " " + getLongUnits(location); //minutes only
                //return "3+" + "Hour Wait";
            }

        }
    }
}

function getLongWaitTimeString(location) {

    if (isClosed(location)) {
        return "<h3>Closed</h3><p></p>";
    }
    else {
        //if (parseInt(location.minWaitTime) >= 120) {
        //    return "<h3>2+</h3><p>Hour Wait</p>";
        //}
        //else
        if (parseInt(location.minWaitTime) == 0 && parseInt(location.maxWaitTime) == 0) {
            return "<h3>Open</h3><p></p>";
        }
        else {
            if (location.minWaitTime === location.maxWaitTime) {
                return "<h3>" + location.minWaitTime + "</h3><p>" + getLongUnits(location) + "</p>";
                //return "<h3>" + "3+" + "</h3><p>" + "Hour Wait" + "</p>";
            }
            else {
                //return "<h3>" + location.minWaitTime + "-" + location.maxWaitTime + "</h3><p>" + getLongUnits(location) + "</p>";
                return "<h3>" + location.maxWaitTime + "</h3><p>" + getLongUnits(location) + "</p>"; //minutes only
                //return "<h3>" + "3+" + "</h3><p>" + "Hour Wait" + "</p>";
            }
        }
    }
}

function getLongUnits(location) {
    switch (location.waitTimeUnit.toLowerCase()) {
        case "mins":
        case "min":
        case "minutes":
        case "minute":
            return "Minute Wait";
        case "hours":
            return "Hour Wait";
        default:
            return "";
    }
}


function isClosed(location) {
    return (location.closedMessage.toLowerCase() === "closed");
}

function isUnavailable(location) {
    if (location.ERROR) {
        return true;
    }
    else {
        return false;
    }
}


function populateWaitTimes() {

    WaittimesLocations.forEach(function (location) {

        var locationName = location.name;

        //if(ERROR > 0){
        //    console.log("locationName: " + locationName + "     isUnavailable: " + isUnavailable(location))
        //}

        if (locationName && !isUnavailable(location)) {
            locationName = locationName.replace(/ /g, '-');
            locationName = locationName.replace(/'/g, '');
            locationName = locationName.toLowerCase();

            var waittime = getShortWaitTimeString(location);
            var wt;

            //Search results page
            if (waittime) {
                //var wt = $("#" + locationName).find("#waitTime");
                wt = $("#" + locationName + " #waitTime");

                if (wt) {
                    wt.html(waittime);
                    wt.show();
                };
            }

            wt = $("#" + locationName + " #time");
            waittime = getLongWaitTimeString(location);

            //Location details page
            if (waittime) {
                if (wt) {
                    wt.html(waittime);
                    wt.show();
                };
            }

            //Save My Spot
            if (location.locationType === "UC" && location.clockWiseMDLocationId) {
                var cwMD = $("#" + locationName + " #saveMySpot");

                if (cwMD) {

                    var saveYourSpot = clockwiseMDURLMask.replace("XXX", location.clockWiseMDLocationId)

                    cwMD.attr("href", saveYourSpot);
                    cwMD.show();
                }

            }

        }
        else {
            //console.log("No location name from api");
        };

    });
};

function showAll() {
    $("[id='waitTime'],[id='time']").show();
};

function handleError() {
    ERROR += 1;
    //console.log("ERROR: " + ERROR)

    showAll();
}

function getLocations() {

    if (ERROR > 4) {
        window.location.reload(true);
    }

    $.ajax({
        type: 'GET',
        url: apiURL,
        async: true,
        cache: false,
        dataType: 'json',
        success: setUpLocations,
        error: handleError
    });

}

$(document).ready(function () {

    getLocations();

    setInterval(getLocations, 60000);
});