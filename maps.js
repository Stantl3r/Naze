function initMap() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var map = new google.maps.Map(document.getElementById('map'), {zoom: 14, center: {lat: position.coords.latitude, lng: position.coords.longitude}})
			var pos = {lat: position.coords.latitude, lng: position.coords.longitude}
			var currentPositionLabel = 'YOU'
			var directionsDisplay = new google.maps.DirectionsRenderer;
			var directionsService = new google.maps.DirectionsService;
			var markers = [];
			//for (var i=0; i<)
			marker = new google.maps.Marker({
				position: pos,
				animation: google.maps.Animation.DROP,
				draggable: true,
				label: currentPositionLabel
            });
            marker.setMap(map);
            marker1 = new google.maps.Marker({
            	position: {lat: 37.77, lng: -122.447}
            })
            marker1.setMap(map);
            directionsDisplay.setMap(map);
			getShelters(getCity(position.coords.latitude, position.coords.longitude));            
			calculateAndDisplayRoute(directionsService, directionsDisplay, position, marker1.getPosition());
			document.getElementById('mode').addEventListener('change', function() {
           		calculateAndDisplayRoute(directionsService, directionsDisplay, position, marker1.getPosition());
        	});
		})
	}

function calculateAndDisplayRoute(directionsService, directionsDisplay, position, destination) {
	var selectedMode = document.getElementById('mode').value;
	directionsService.route({
		origin: {lat: position.coords.latitude, lng: position.coords.longitude},
		destination: destination,
		travelMode: google.maps.TravelMode[selectedMode]
	}, function(response, status) {
		if (status == 'OK') {
			directionsDisplay.setDirections(response);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}
function getCity(lat, lng) {
	city = '';
	var latlng = new google.maps.LatLng(lat, lng);
	geocoder = new google.maps.Geocoder();
	geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				city = results[0].formatted_address.split(',')[2];
			} 
	  	}
	});
	return city;
}

function getShelters(city) {
	console.log(city)
	city = city.split(' ');
	url = 'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/National_Shelter_System_Facilities/FeatureServer/0/query?where=CITY%20like%20\'%25';
	for (i = 0; i < city.length; i++) {
		if (i == city.length - 1) {
			url += city[i];
		} else {
			url += (city[i] + '%20');
		}
	}
	url += '%25\'&outFields=*&outSR=4326&f=json';
	var xhr = new XMLHttpRequest(); 
	xhr.open("GET", url, false);
	xhr.send(null);

	shelter_lat = [];
	shelter_lng = [];
	var shelters_json = JSON.parse(xhr.responseText);
	for (i = 0; i < shelters_json.features.length; i++) {
		shelter_lat.push(shelters_json.features[i].attributes.LATITUDE);
		shelter_lng.push(shelters_json.features[i].attributes.LONGITUDE);
	}
	return shelter_lat
}
	
}