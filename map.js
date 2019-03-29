 /*global map
   global google
   global $
 */
let map = null;
function initMap(){

          //Create the google coordinate
            let singapore = new google.maps.LatLng(1.35, 103.8);
            
            //Create the google map
            map = new google.maps.Map(
            document.getElementById('map'), {center: singapore, zoom: 12});
}
