//Necessary variables
var map;
var indian = new L.LayerGroup([]);
var asian = new L.LayerGroup([]);
var black = new L.LayerGroup([]);
var hawaiian = new L.LayerGroup([]);
var white = new L.LayerGroup([]);
var unknown = new L.LayerGroup([]);

//Object for Layer Control
var overlays = {
	"American Indian or Alaska Native" : indian,
	"Asian" : asian,
	"Black or African American" : black,
	"Native Hawaiian or Other Pacific Islander" : hawaiian,
	"White" : white,
	"Unknown" : unknown
}

//Set counter for table data
var armedKilled = 0;
var armedHit = 0;
var unarmedKilled = 0;
var unarmedHit = 0;


// Function to draw your map
var drawMap = function() {

  // Create map and set view
 	map = L.map('container').setView([37.09024, -95.712891], 4);

  // Create a tile layer variable using the appropriate url
  	var layer = L.tileLayer('https://api.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FraXV3YSIsImEiOiJjaWZ4MjZqcTQzbHJtdTNtMjJzdm5lcG9tIn0.Bo6KigV9UiQoLiKA5_j22Q');
  // Add the layer to your map
 	layer.addTo(map);

  // Execute your function to get data
	getData();
}


// Function for getting data
var getData = function() {

  // Execute an AJAX request to get the data in data/response.js
	var data = $.get( "data/response.json").then(function(data) {
  		customBuild(data);
	});

  // When your request is successful, call your customBuild function
}

// Loop through your data and add the appropriate layers and points
var customBuild = function(data) {
	//Layer Control
	L.control.layers(null, overlays).addTo(map);

	//Loop through data
	for (i = 0; i < data.length; i++) {
		//Necessary variables
		var lat = data[i]['lat'];
		var lng = data[i]['lng'];
		var race = data[i]['Race'];
		var gender = data[i]["Victim's Gender"];
		var circle;
		var date = data[i]['Date of Incident'];
		var killed = data[i]['Hit or Killed?'];
		var armed = data[i]['Armed or Unarmed?'];

		//Count Armed or Unarmed vs. Killed or Hit
		if (armed == "Armed") {
			killed == "Killed" ? armedKilled++ : armedHit++;
			console.log(armedKilled);
		} else {
			killed == "Killed" ? unarmedKilled++ : unarmedHit++;
		}

		//Make circleMarker, colors corresponding to gender of victim
		if (gender == 'Male') {
			circle = new L.circleMarker([lat, lng], {
				color: '#1AC2F0',
				radius: 5
			});
		} else if (gender == 'Female') {
			circle = new L.circleMarker([lat, lng], {
				color: '#F01A97',
				radius: 5
			});
		} else {
			circle = new L.circleMarker([lat, lng], {
				color: '#F0DB1A',
				radius: 5
			});
		}

		//Add Pop-up
		circle.bindPopup("Date of Incident: " + date + ", Hit or Killed?: " + killed);

		//Sort circle into corresponding layer group
		if (race == 'American Indian or Alaska Native') {
			circle.addTo(indian);
		} else if (race == 'Asian') {
			circle.addTo(asian);
		} else if (race == 'Black or African American') {
			circle.addTo(black);
		} else if (race == 'Native Hawaiian or Other Pacific Islander') {
			circle.addTo(hawaiian);
		} else if (race == 'White') {
			circle.addTo(white);
		} else {
			circle.addTo(unknown);
		}
	}
	// Be sure to add each layer to the map
	//Add all layers to map
	indian.addTo(map);
	asian.addTo(map);
	black.addTo(map);
	hawaiian.addTo(map);
	white.addTo(map);
	unknown.addTo(map);

	//Transfer numbers to table
	$("#armed-killed").html(armedKilled);
	$("#armed-hit").html(armedHit);
	$("#unarmed-killed").html(unarmedKilled);
	$("#unarmed-hit").html(unarmedHit);
}




