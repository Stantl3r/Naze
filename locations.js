var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

city = 'Salt Lake City'.split(' ')
url = 'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/National_Shelter_System_Facilities/FeatureServer/0/query?where=CITY%20like%20\'%25'
for (i = 0; i < city.length; i++) {
	if (i == city.length - 1) {
		url += city[i]
	} else {
		url += (city[i] + '%20')
	}
}
url += '%25\'&outFields=*&outSR=4326&f=json'

var xhr = new XMLHttpRequest(); 
xhr.open("GET", url, false);
xhr.send(null);
          
var shelters_json = JSON.parse(xhr.responseText);
for (i = 0; i < shelters_json.features.length; i++) {
	console.log(shelters_json.features[i].attributes.ADDRESS);
}