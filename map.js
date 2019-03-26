 var myGoogleMap;
      function initMap() {
          /* global google */
          /* global $ */
          // document.getElementById('map')=> $("#map")
        // map = new google.maps.Map(document.getElementById('map'), {
           myGoogleMap = new google.maps.Map($('#map')[0], {
          center: {lat: 1.35, lng: 103.8},
          zoom: 10
        });
}