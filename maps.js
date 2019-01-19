function initMap() {
  // The location of Uluru
  var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: uluru});
  // The marker, positioned at Uluru
  var markers = [];
  var currentPositionLabel = 'YOU'
  var destinationPositionLabel = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var infoWindow = new google.maps.InfoWindow;

  /*for (i=0; i,markers.length;i++){
  	bounds.extend(markers[i].getPosition());
  }*/

  if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            marker = new google.maps.Marker({
              position: pos,
              animation: google.maps.Animation.DROP,
              draggable: true,
              label: currentPositionLabel
            });
            //var GeoMarker = new GeolocationMarker();
            //GeoMarker.setCircleOptions({fillColor: '#808080'});
            marker.setMap(map);
            map.setCenter(pos)
            marker.addListener('click', toggleBounce);
            //var bounds = map.LatLngBounds();
            //map.fitBounds(bounds);
            //GeoMarker.setMap(map);
            /*map.setCenter(pos);
            map.fitBounds(bounds);
            if(count(markers) == 1){
            	map.setMaxZoom(15);
            	map.fitBounds(bounds);
            }
            else if(map.getZoom()> 15){
            		map.setZoom(15);
            }
            else{
            	map.setZoom(map.getZoom()-1)
            }*/
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
}
function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
