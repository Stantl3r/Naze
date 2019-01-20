function initMap() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var map = new google.maps.Map(document.getElementById('map'), {zoom: 14, center: {lat: position.coords.latitude, lng: position.coords.longitude}})
			var pos = {lat: position.coords.latitude, lng: position.coords.longitude}
			var directionsDisplay = new google.maps.DirectionsRenderer;
			var directionsService = new google.maps.DirectionsService;
			var markers = [];
			marker = new google.maps.Marker({
				position: pos,
				animation: google.maps.Animation.DROP,
				draggable: true,
            });
            marker.setMap(map);
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById('right-panel'));
            var control = document.getElementById('floating-panel');
        	control.style.display = 'block';
        	map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
			var loc = getShelters(getCity(position.coords.latitude, position.coords.longitude));
			for(var i = 0; i<loc.shelter_lat.length; i++){
				markers[i] = new google.maps.Marker({
					position: new google.maps.LatLng(loc.shelter_lat[i],loc.shelter_lng[i]),
					map: map
				});
			}
			var distance = 100000000000;
			var closest_index = 0;
			for(var j = 0; j<markers.length; j++){
				var dlon = (loc.shelter_lng[j]-position.coords.longitude)*(Math.PI/180);
				var dlat = (loc.shelter_lat[j]-position.coords.latitude)*(Math.PI/180);
				var a = Math.sin(dlat/2)*Math.sin(dlat/2) + Math.cos(position.coords.latitude*(Math.PI/180)) *
				Math.cos(loc.shelter_lat[j]*(Math.PI/180))* Math.sin(dlon/2)*Math.sin(dlon/2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
				var d = 6371* c;
				if(d<distance){
					distance = d;
					closest_index = j;
				}
			}
			markers[closest_index].setMap(map);       
			calculateAndDisplayRoute(directionsService, directionsDisplay, position, markers[closest_index].getPosition());
			document.getElementById('mode').addEventListener('change', function() {
           		calculateAndDisplayRoute(directionsService, directionsDisplay, position, markers[closest_index].getPosition());
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
	var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyCykp6C4Ivqy-lhHMB1It1UcZnHkoVMU8Y';
	var xhr = new XMLHttpRequest(); 
	xhr.open("GET", url, false);
	xhr.send(null);
	var location_json = JSON.parse(xhr.responseText);
	return location_json.results[0].formatted_address.split(',')[1]
}

function getShelters(city) {
	city = city.split(' ');
	url = 'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/National_Shelter_System_Facilities/FeatureServer/0/query?where=CITY%20like%20\'%25';
	for (i = 1; i < city.length; i++) {
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
	return{
		shelter_lat: shelter_lat,
		shelter_lng: shelter_lng
	};
}
	
}