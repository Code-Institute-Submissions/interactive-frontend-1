// A class that represents a point-of-interest's latitude and longitude coordinates
function Coords(latitude, longitude) {
    var self = this;
    self.latitude = latitude;
    self.longitude = longitude;
}

// A class that represents an entry in the point of interests table
function PointOfInterest(name, address, coords, categories, marker, place) {
    var self = this;
    self.name = name;
    self.address = address;
    self.coords = coords;
    self.categories = categories; // e.g. ["category1","category2",..,"categoryN"]
    self.marker = marker; // A google map marker
    self.beachFlag = "false";
    self.place = place; // A google place
}