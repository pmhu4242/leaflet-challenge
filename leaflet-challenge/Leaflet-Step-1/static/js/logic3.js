
function markerSize(mag) {
    return mag * 5
    };

var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL


var geojson;

d3.json(geoData, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function getColor(d) {
    return d > 90 ? '#900C3F' :
            d > 70  ? '#C70039' :
            d > 50  ? '#FF5733' :
            d > 30  ? '#FFC300' :
            d > 10   ? '#D2FF33' :
            d > -10   ? '#33FF44':
                        '#B0FF97';
                        
};




function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'black',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.geometry.coordinates[2])
    };
};





// create function to pull data from GeoJSON data for each earthquake entry

function createFeatures(earthquakeData) {
   
    console.log(earthquakeData)
    
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + 'Magnitude: ' + feature.properties.mag + '<br></br>' + 'Depth (km): ' + feature.geometry.coordinates[2] +  "</p><p>" + new Date(feature.properties.time) + "</p><p>" + 'Latitude: ' + feature.geometry.coordinates[0] + "</p><p>" + 'Longitude: ' + feature.geometry.coordinates[1] + "</p>");
    };

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {

        style: style,

        onEachFeature: onEachFeature,

        pointToLayer: function (feature, latlng) {
            return new L.circleMarker(latlng, {
                // fillColor: getColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.75,
                radius: markerSize(feature.properties.mag)
            })

       
        }
    });
    
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
    
    };

function createMap(earthquakes) {

//   var earthquakes = L.layerGroup(earthquakes).addLayer(earthquakes);  
  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    // Legend: legend,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });



  var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (myMap) {

		var div = L.DomUtil.create('div', 'info legend'),
			depth = [-10, 10, 30, 50, 70, 90];
            var colors = geojson,
			labels = [],
			from, to;

		for (var i = 0; i < depth.length; i++) {
			from = depth[i];
			to = depth[i + 1];

			labels.push(
				'<li style="background-color:' + getColor(from + 1) + '"></li> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(myMap);


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}





