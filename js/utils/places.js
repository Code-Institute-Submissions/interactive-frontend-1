var beverleyMap;
var service;
var infowindow;
var bouncer;

var beverleyLatitude = 1.35;
var beverleyLongitude = 103.8;

var beachflagIcon = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

function searchPointsOfInterest(query, types) {
    // console.log("searchPointsOfInterest");

    var poiQuery = query + "+beverley";
    var poiTypes = types;

    var request = {
        type: poiTypes,
        query: poiQuery,
    };

    service = new google.maps.places.PlacesService(beverleyMap);
    service.textSearch(request, textSearchCallback);

}

function showMarker(marker) {
        marker.setMap(beverleyMap);
}

function hideMarker(marker) {
        marker.setMap(null);
}

function loadMarkers(defaultPlacesIds) {

    for (i = 0; i < defaultPlacesIds.length; i++) {
        var defaultPlaceId = defaultPlacesIds[i];

        var request = {
            placeId: defaultPlaceId
        };

        service = new google.maps.places.PlacesService(beverleyMap);
        service.getDetails(request, detailsCallback);

    }

}

// Function that initialises an empty map with center on Beverley, UK.
function initialiseBeverleyMap() {

    var beverleyLocation = new google.maps.LatLng(beverleyLatitude, beverleyLongitude);

    beverleyMap = new google.maps.Map(
        document.getElementById("beverleyMap"), {
            center: beverleyLocation,
            zoom: 12
        });

    infowindow = new google.maps.InfoWindow();
}

function textSearchCallback(results, status) {
    
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            var marker = createMarker(place, null);
            updatePointsOfInterest(place, marker);
        }

    } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {

        alert("We didn't find any matchs for your search!");

    } else {

        alert("Oppps! Something went wrong. You may try check your connection and reload the page to see if it works!");

    }
}

function changeMarkerIcon(pointOfInterest) {
    hideMarker(pointOfInterest.marker);
    
        var name = pointOfInterest.name;
        var place = pointOfInterest.place;
    
        if (pointOfInterest.beachFlag === "true") {
            pointOfInterest.marker = createMarker(place, null);
            pointOfInterest.beachFlag = "false";
        } else {
            pointOfInterest.marker = createMarker(place, beachflagIcon);
            pointOfInterest.beachFlag = "true";
        }
    
        makeWindow(pointOfInterest.place, pointOfInterest.marker);
    
    }


function detailsCallback(place, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var marker = createMarker(place, null);
        updatePointsOfInterest(place, marker);
    }
    // Ignore any errors as this one is only run on loading the default locations
}

function createMarker(place, image) {

    var placeLocation = place.geometry.location;

    var marker = new google.maps.Marker({
        map: beverleyMap,
        position: placeLocation,
        icon: image
    });

    google.maps.event.addListener(marker, 'click', function () {

        makeWindow(place, marker);

        /* Stop the bouncing marker, if there is one */
        if ( bouncer && bouncer.getAnimation() !== null ) {
            bouncer.setAnimation(null);
            bouncer = null;
        }

        /* Bounce the clicked marker, and save it as the bouncing one */
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            bouncer = marker;
        }

        /* Load Flickr photos for this markers location */
        loadFlickrPhotos(place.name, pointsOfInterestViewModel.flickrHeader, pointsOfInterestViewModel.flickrError, pointsOfInterestViewModel.flickrPhotos);
        loadWikipediaExtracts(place.name, pointsOfInterestViewModel.wikipediaHeader, pointsOfInterestViewModel.wikipediaExtracts );

    });

    return marker;
}

function makeWindow(place, marker) {

    var name = place.name;
    var address = place.formatted_address;
    var phoneNumber = place.international_phone_number;
    var website = place.website;
    var openingHours = place.opening_hours;
    var rating = place.rating;
    var url = place.url;

    var infoWindowContent = "<p><strong>Name: </strong>" + name + "</p>";
    if (address) {
        infoWindowContent += "<p><strong>Address: </strong>" + address + "</p>";
    }
    if (phoneNumber) {
        infoWindowContent += "<p><strong>Phone: </strong>" + phoneNumber + "</p>";
    }
    if (rating) {
        infoWindowContent += "<p><strong>Rating: </strong>" + rating + "</p>";
    }
    if (openingHours) {
        if (openingHours.open_now) {
            infoWindowContent += "<p><strong>Open Now!</strong></p>";
        } else {
            infoWindowContent += "<p><strong>Closed!</strong></p>";
        }
    }
    if (website) {
        infoWindowContent += "<p><a href=\"" + website + "\">Website</a>";
    }
    if (url) {
        if (website) {
            infoWindowContent += " | ";
        } else {
            infoWindowContent += "<p>";
        }
        infoWindowContent += "<a href=\"" + url + "\">See on Google Maps</a></p>";
    }

    infowindow.setContent(infoWindowContent);
    infowindow.open(beverleyMap, marker);
}