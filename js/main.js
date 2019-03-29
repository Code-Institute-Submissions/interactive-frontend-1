/*global ko
  global initialiseBeverleyMap
  global loadMarkers
  global searchPointsOfInterest
  global changeMarkerIcon
  global loadFlickrPhotos
  global loadWikipediaExtracts
  global showMarker
  global hideMarker
  global PointOfInterest
  global Coords
*/
var pointsOfInterest = ko.observableArray();
var availableCategories = ko.observableArray(["all"]);
var placeIds = [];

// The viewmodel for the UI, together with default points of interest
function PointsOfInterestViewModel() {
    var self = this;

    // Default points of interest
    var defaultPlacesIds = [
        "ChIJMxZ-kwQZ2jERdsqftXeWCWI", // Gardens by the bay
        "ChIJawetdFYR2jER5wN2ZytxwW4", // Beverley Westwood
        "ChIJN6GRIgwQ2jERSCjOqPhNygU", // Ng Teng Fong
        "ChIJFXzxL2Aa2jERnoWTOdJdVKk", // Singapore Polytechnic
        "ChIJb6xq2bAZ2jERE1P6sVKtofw", // Flemingate
        "EhVPcmNoYXJkIFJkLCBTaW5nYXBvcmUiLiosChQKEgm7_uZIkRnaMRH69P43P_eZjhIUChIJdZOLiiMR2jERxPWrUs9peIg" // Orchard Road
    ];

    self.queryText = ko.observable();
    self.queryCategory = ko.observable("all");

    self.filterText = ko.observable();
    self.filterCategory = ko.observable("all");

    self.wikipediaHeader = ko.observable("Wikipedia Extract");
    self.wikipediaExtracts = ko.observableArray([]);

    self.flickrHeader = ko.observable("Flickr Photos");
    self.flickrError = ko.observable();
    self.flickrPhotos = ko.observableArray([]);

    // Initialise an empty map with the center placed on Beverley
    initialiseBeverleyMap();

    // Load the markers for the default points of interest
    loadMarkers(defaultPlacesIds);

    // Operations
    self.addPointsOfInterest = function () {

        var query = self.queryText().replace(' ', '+');
        var type = self.queryCategory();

        var types = [];
        if (type != "all") {
            types = [type];
        }

        searchPointsOfInterest(query, types);

    };

    self.onClickPointOfInterest = function (pointOfInterest) {
        changeMarkerIcon(pointOfInterest);
        loadFlickrPhotos(pointOfInterest.name, self.flickrHeader, self.flickrError, self.flickrPhotos);
        loadWikipediaExtracts(pointOfInterest.name, self.wikipediaHeader, self.wikipediaExtracts);
    };

    self.filteredPointsOfInterest = ko.computed(function () {
        var filterCategory = self.filterCategory();
        var filterText = self.filterText();

        // Everything is a match
        if (filterCategory === "all" && !filterText) {

            ko.utils.arrayForEach(pointsOfInterest(), function (pointOfInterest) {

                var marker = pointOfInterest.marker;
                showMarker(marker);

            });

            return pointsOfInterest();

            // Only items with name filterText are a match
        } else if (filterCategory === "all" && filterText) {
            return ko.utils.arrayFilter(pointsOfInterest(), function (pointOfInterest) {
                var isMatch = pointOfInterest.name.toLowerCase().startsWith(filterText.toLowerCase());

                var marker = pointOfInterest.marker;
                if (isMatch) {
                    showMarker(marker);
                } else {
                    hideMarker(marker);
                }

                return isMatch;
            });

            // Only items with categories.has(filterCategory) and name filterText are a match
        } else if (filterCategory != "all" && filterText) {
            return ko.utils.arrayFilter(pointsOfInterest(), function (pointOfInterest) {
                var isMatch = pointOfInterest.categories.indexOf(filterCategory) != -1 &&
                    pointOfInterest.name.toLowerCase().startsWith(filterText.toLowerCase());

                var marker = pointOfInterest.marker;
                if (isMatch) {
                    showMarker(marker);
                } else {
                    hideMarker(marker);
                }

                return isMatch;
            });

            // Only items with categories.has(filterCategory) are a match
        } else if (filterCategory != "all" && !filterText) {
            return ko.utils.arrayFilter(pointsOfInterest(), function (pointOfInterest) {
                var isMatch = pointOfInterest.categories.indexOf(filterCategory) != -1;

                var marker = pointOfInterest.marker;
                if (isMatch) {
                    showMarker(marker);
                } else {
                    hideMarker(marker);
                }

                return isMatch;
            });
        }
    });

}

function updatePointsOfInterest(place, marker) {

    var placeId = place.place_id;

    var result = placeIds.indexOf(placeId);
    if (result === -1) {

        placeIds.push(placeId);
        
        var newPointOfInterest = new PointOfInterest( 
          	place.name,
            place.formatted_address,
            new Coords(latitude = place.geometry.location.lat(), longitude = place.geometry.location.lng()),
            place.types,
            marker,
            place
        );

        pointsOfInterest.push(newPointOfInterest);
        updateAvailableCategories(newPointOfInterest.categories);

    } else {
        alert("The point of interest you are searching is already on the list!");
    }
}


function updateAvailableCategories(categories) {

    for (i = 0; i < categories.length; i++) {
        var category = categories[i];
        if (availableCategories.indexOf(category) === -1) {
            availableCategories.push(category);
        }
    }
}

var pointsOfInterestViewModel;
function run() {

    pointsOfInterestViewModel = new PointsOfInterestViewModel();
    
    ko.applyBindings(pointsOfInterestViewModel);

    loadFlickrPhotos(null, pointsOfInterestViewModel.flickrHeader, pointsOfInterestViewModel.flickrError, pointsOfInterestViewModel.flickrPhotos);
    loadWikipediaExtracts( null, pointsOfInterestViewModel.wikipediaHeader, pointsOfInterestViewModel.wikipediaExtracts );

}