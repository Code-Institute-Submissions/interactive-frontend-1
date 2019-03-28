 /*global map
   global google
   global $
 */
 function initMap() {
           map = new google.maps.Map($('#map')[0], {
          center: {lat: 1.35, lng: 103.8},
          zoom: 10
        });
}