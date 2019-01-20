function initMap() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var map = new google.maps.Map(document.getElementById('map'), {zoom: 14, center: {lat: position.coords.latitude, lng: position.coords.longitude}})
			var pos = {lat: position.coords.latitude, lng: position.coords.longitude}
			var currentPositionLabel = 'YOU'
			var directionsDisplay = new google.maps.DirectionsRenderer;
			var directionsService = new google.maps.DirectionsService;
			marker = new google.maps.Marker({
				position: pos,
				animation: google.maps.Animation.DROP,
				draggable: true,
				label: currentPositionLabel
            });
            marker.setMap(map)
            directionsDisplay.setMap(map);
            calculateAndDisplayRoute(directionsService, directionsDisplay, position, '4115 Voltaire Street');
		})
	}

function calculateAndDisplayRoute(directionsService, directionsDisplay, position, destination) {
	directionsService.route({
		origin: {lat: position.coords.latitude, lng: position.coords.longitude},
		destination: destination,
		travelMode: 'DRIVING'
	}, function(response, status) {
		if (status == 'OK') {
			directionsDisplay.setDirections(response);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}

	
}