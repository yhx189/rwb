/* jshint strict: false */
/* global $: false, google: false */
//
// Red, White, and Blue JavaScript 
// for EECS 339 Project A at Northwestern University
//
// Originally by Peter Dinda
// Sanitized and improved by Ben Rothman
//
//
// Global state
//
// html    - the document itself ($. or $(document).)
// map     - the map object
// usermark- marks the user's position on the map
// markers - list of markers on the current map (not including the user position)
//
//

//
// When the document has finished loading, the browser
// will invoke the function supplied here.  This
// is an anonymous function that simply requests that the 
// brower determine the current position, and when it's
// done, call the "Start" function  (which is at the end
// of this file)
// 
//
$(document).ready(function() {
	navigator.geolocation.getCurrentPosition(Start);
});

// Global variables
var map, usermark, markers = [],
dataString = "",
// UpdateMapById draws markers of a given category (id)
// onto the map using the data for that id stashed within 
// the document.
UpdateMapById = function(id, tag) {
// the document division that contains our data is #committees 
// if id=committees, and so on..
// We previously placed the data into that division as a string where
// each line is a separate data item (e.g., a committee) and
// tabs within a line separate fields (e.g., committee name, committee id, etc)
// 
// first, we slice the string into an array of strings, one per 
// line / data item

	if($("[id = "+id+"]")){
	$("[id = "+id+"]").each(function(){
	var rows  = $(this).html().split("\n");

// then, for each line / data item
	for (var i=0; i<rows.length; i++) {
// we slice it into tab-delimited chunks (the fields)
		var cols = rows[i].split("\t"),
// grab specific fields like lat and long
			lat = cols[0],
			long = cols[1];

// then add them to the map.   Here the "new google.maps.Marker"
// creates the marker and adds it to the map at the lat/long position
// and "markers.push" adds it to our list of markers so we can
// delete it later 
		markers.push(new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(lat,long),
			title: tag+"\n"+cols.join("\n")
		}));

	}
})
}
},


//
// ClearMarkers just removes the existing data markers from
// the map and from the list of markers.
//
ClearMarkers = function() {
	// clear the markers
	while (markers.length>0) {
		markers.pop().setMap(null);
	}
},

//
// UpdateMap takes data sitting in the hidden data division of 
// the document and it draws it appropriately on the map
//
UpdateMap = function() {
// We're consuming the data, so we'll reset the "color"
// division to white and to indicate that we are updating
	var color = $("#color");
	color.css("background-color", "white")
		.html("<b><blink>Updating Display...</blink></b>");

// Remove any existing data markers from the map
	ClearMarkers();

// Then we'll draw any new markers onto the map, by category
// Note that there additional categories here that are 
// commented out...  Those might help with the project...
//
	if(dataString.indexOf("committees") > -1){
		UpdateMapById("committee_data","COMMITTEE");
	}

	if(dataString.indexOf("candidates") > -1){
		UpdateMapById("candidate_data","CANDIDATE");
	}
	if(dataString.indexOf("individuals") > -1){
		UpdateMapById("individual_data", "INDIVIDUAL");
	}
	if(dataString.indexOf("opinions") > -1 ){
		UpdateMapById("opinion_data","OPINION");
	}
// When we're done with the map update, we mark the color division as
// Ready.
	color.html("Ready");
	/*
        var rep = 0;
	if($("#rep_trans_amnt_a")){
	for(var i =0; i<$("#rep_trans_amnt_a").length; i++){
		repAmnt  = $("#rep_trans_amnt_a").html().split("\n");
		
		var rep;
		if(isNaN(repAmnt[i].split("\t")[i])){
			rep += 0;
		} else{
		        rep += Number(repAmnt[i].split("\t")[i]);
	        }
	    }
	   for(var i =0; i<$("#rep_trans_amnt_b").length; i++){
		repAmnt  = $("#rep_trans_amnt_b").html().split("\n");
		if(isNaN(repAmnt[i].split("\t")[i])){
			rep = rep;
		} else{
			rep = rep + Number(repAmnt[i].split("\t")[i]);
	        }
	    }
    }
    var dem = 0;
    if($("#dem_trans_amnt_a")){
    for(var i =0; i<$("#dem_trans_amnt_a").length; i++){
		var demAmnt  = $("#dem_trans_amnt_a").html().split("\n");
		var dem;
		if(isNaN(demAmnt[i].split("\t")[i])){
		     dem += 0;
		} else{
		     dem += Number(demAmnt[i].split("\t")[i]);
	        }
	    }
	    for(var i =0; i<$("#dem_trans_amnt_b").length; i++){
	        demAmnt  = $("#dem_trans_amnt_b").html().split("\n");
		if(isNaN(demAmnt[i].split("\t")[i])){
		     dem = dem + 0;
		} else{
		     dem = dem + Number(demAmnt[i].split("\t")[i]);
	 	}
 	}
	}
	*/	
        if(dataString.indexOf("committees") > -1){ 
          var rep = 0, dem = 0;
          var trans = [];
          var comm_trans_amnt = $("#comm_trans_amnt").html().split("\n");
          if(isNaN(comm_trans_amnt[0].split("\t")[0])){
             trans[0] = 0;
          }else {
             trans[0] = Number(comm_trans_amnt[0].split("\t")[0]);
          }
           if(isNaN(comm_trans_amnt[0].split("\t")[1])){
             trans[1] = 0;
          }else {
             trans[1] = Number(comm_trans_amnt[0].split("\t")[1]);
          }
          if(isNaN(comm_trans_amnt[0].split("\t")[2])){
             trans[2] = 0;
          }else {
             trans[2] = Number(comm_trans_amnt[0].split("\t")[2]);
          }
          if(isNaN(comm_trans_amnt[0].split("\t")[3])){
             trans[3] = 0;
          }else {
             trans[3] = Number(comm_trans_amnt[0].split("\t")[3]);
          }
          rep = trans[0] + trans[1];
          dem = trans[2] + trans[3];
          $("#commSum").remove();
          $("#summary").append('<tr id="commSum"><td>Committee Spending</td><td>'+dem+'</td><td>'+rep+'</td></tr>');
		if (dem > rep) {
			$("#commSum").css("background-color", "blue");
		} else if (dem < rep){
			$("#commSum").css("background-color", "red");
		} else {
			$("#commSum").css("background-color", "white");
		}
	}

	if(dataString.indexOf("individuals") > -1){
                var indTransAmnt  = $("#ind_trans_amnt").html().split("\n"); 
		var rep = 0, dem = 0;
                var trans = [];
                if(isNaN(indTransAmnt[0].split("\t")[0])){
			trans[0] = 0;
		} else{
			trans[0] = Number(indTransAmnt[0].split("\t")[0]);
		}
		 if(isNaN(indTransAmnt[0].split("\t")[1])){
			trans[1] = 0;
		} else{
			trans[1] = Number(indTransAmnt[0].split("\t")[1]);
		}

                rep = trans[0];
                dem = trans[1];
                //alert("dem:" + demIndAmnt + " rep:" + repIndAmnt);
		$("#indSum").remove();
		$("#summary").append('<tr id="indSum"><td>Independant Spending</td><td>'+dem +'</td><td>'+rep + '</td></tr>');
		if(dem > rep){
			$("#indSum").css("background-color", "blue");
		} else if (dem < rep){
			$("#indSum").css("background-color", "red");  
		} else{
			$("#indSum").css("background-color", "white");  
		}
	}
	if(dataString.indexOf("opinions") > -1){ 
		var rows  = $("#opinion_data").html().split("\n");
		var mean_color = 0, cnt = 0;
		for (var i=0; i<rows.length; i++) {
			var cols = rows[i].split("\t"),
				lat = cols[0],
				long = cols[1],
				opinions = cols[2];
                        if(isNaN(Number(opinions))){
				continue;
			}
			mean_color = mean_color + Number(opinions);
		        cnt = cnt + 1;
                
                }
                mean_color = mean_color / cnt;
                var dev = 0;
                for (var i=0; i<rows.length; i++) {
			var cols = rows[i].split("\t"),
				lat = cols[0],
				long = cols[1],
				opinions = cols[2];
			if(isNaN(Number(opinions))){
				break;
			}
                        var tmp = mean_color -Number(opinions);
			dev = dev  + Math.pow(tmp,2);
		}
                dev = Math.sqrt(dev);
		$("#opiSum").remove();
		$("#summary").append('<tr id="opiSum"><td>Opinions given by users</td><td>'+mean_color+'</td><td>'+dev+'</td></tr>');
		if(mean_color > 0){
			$("#opiSum").css("background-color", "blue");
		} else if (mean_color < 0){
			$("#opiSum").css("background-color", "red");  
		} else{
			$("#opiSum").css("background-color", "white");  
		}
                /*
if(mean_color > 0){
			color.css("background-color", "blue");  
		} else if (mean_color < 0){
			color.css("background-color", "red");  
		} else{
			color.css("background-color", "white");  
		}
                */

	}
},

//
// NewData is called by the browser after any request
// for data we have initiated completes
//
NewData = function(data) {
// All it does is copy the data that came back from the server
// into the data division of the document.   This is a hidden 
// division we use to cache it locally
	$("#data").html(data);
// Now that the new data is in the document, we use it to
// update the map
	UpdateMap();
},

//
// The Google Map calls us back at ViewShift when some aspect
// of the map changes (for example its bounds, zoom, etc)
//
ViewShift = function() {
// We determine the new bounds of the map
	var bounds = map.getBounds(),
		ne = bounds.getNorthEast(),
		sw = bounds.getSouthWest();

// Now we need to update our data based on those bounds
// first step is to mark the color division as white and to say "Querying"
	$("#color").css("background-color","white")
		.html("<b><blink>Querying...("+ne.lat()+","+ne.lng()+") to ("+sw.lat()+","+sw.lng()+")</blink></b>");

// Now we make a web request.   Here we are invoking rwb.pl on the 
// server, passing it the act, latne, etc, parameters for the current
// map info, requested data, etc.
// the browser will also automatically send back the cookie so we keep
// any authentication state
// 
// This *initiates* the request back to the server.  When it is done,
// the browser will call us back at the function NewData (given above)

	//getting the relevant data from the html form (candidate, individual, committee)
	//var dataString = "";
	if(window.matchMedia("screen and (max-width: 40em)").matches){
    dataString = "";
    var electionData = document.getElementById('electionDataM');
    var dataSelected = electionData.getElementsByTagName('input');
    for (var i = 0; i < dataSelected.length; i++) {
    	if(dataSelected[i].checked){
    		dataString += dataSelected[i].value + ",";
    	}
	}
    dataString = dataString.substring(0,dataString.length-1);

    //getting the cycles
    
    var cyclesString ="";
    var cycleData = document.getElementById('cycleDataM');
    var cyclesSelected = cycleData.getElementsByTagName('input');
    for (var i = 0; i < cyclesSelected.length; i++) {
    	if(cyclesSelected[i].checked){
    		cyclesString += cyclesSelected[i].value + ",";
    	}
	}
	cyclesString = cyclesString.substring(0,cyclesString.length-1);
	}
	else{
		dataString = "";
    var electionData = document.getElementById('electionData');
    var dataSelected = electionData.getElementsByTagName('input');
    for (var i = 0; i < dataSelected.length; i++) {
    	if(dataSelected[i].checked){
    		dataString += dataSelected[i].value + ",";
    	}
	}
    dataString = dataString.substring(0,dataString.length-1);

    //getting the cycles
    
    var cyclesString ="";
    var cycleData = document.getElementById('cycleData');
    var cyclesSelected = cycleData.getElementsByTagName('input');
    for (var i = 0; i < cyclesSelected.length; i++) {
    	if(cyclesSelected[i].checked){
    		cyclesString += cyclesSelected[i].value + ",";
    	}
	}
	cyclesString = cyclesString.substring(0,cyclesString.length-1);
	}
	if(dataString != ""){
	$.get("rwb.pl",
		{
			act:	"near",
			latne:	ne.lat(),
			longne:	ne.lng(),
			latsw:	sw.lat(),
			longsw:	sw.lng(),
			format:	"raw",
			what:	dataString,
			cycle: cyclesString
		}, NewData);}
	else{
		$("#color").html("Ready");
	}
},


//
// If the browser determines the current location has changed, it 
// will call us back via this function, giving us the new location
//
Reposition = function(pos) {
// We parse the new location into latitude and longitude
Foundation.utils.throttle(function(e){ //Throttle reposition for location sensitive mobile browser
	var lat = pos.coords.latitude,
		long = pos.coords.longitude;

// ... and scroll the map to be centered at that position
// this should trigger the map to call us back at ViewShift()
	map.setCenter(new google.maps.LatLng(lat,long));
// ... and set our user's marker on the map to the new position
	usermark.setPosition(new google.maps.LatLng(lat,long));}, 60000);
},


//
// The start function is called back once the document has 
// been loaded and the browser has determined the current location
//
Start = function(location) {
// Parse the current location into latitude and longitude        
	var lat = location.coords.latitude,
	    long = location.coords.longitude,
	    acc = location.coords.accuracy,
// Get a pointer to the "map" division of the document
// We will put a google map into that division
	    mapc = $("#map");

// Create a new google map centered at the current location
// and place it into the map division of the document
	map = new google.maps.Map(mapc[0],
		{
			zoom: 16,
			center: new google.maps.LatLng(lat,long),
			mapTypeId: google.maps.MapTypeId.HYBRID
		});

// create a marker for the user's location and place it on the map
	usermark = new google.maps.Marker({ map:map,
		position: new google.maps.LatLng(lat,long),
		title: "You are here"});

// clear list of markers we added to map (none yet)
// these markers are committees, candidates, etc
	markers = [];

// set the color for "color" division of the document to white
// And change it to read "waiting for first position"
	$("#color").css("background-color", "white")
		.html("<b><blink>Waiting for first position</blink></b>");

//
// These lines register callbacks.   If the user scrolls the map, 
// zooms the map, etc, then our function "ViewShift" (defined above
// will be called after the map is redrawn
//
	google.maps.event.addListener(map,"bounds_changed", Foundation.utils.throttle(function(e){ ViewShift() }, 1000));
	google.maps.event.addListener(map,"center_changed", Foundation.utils.throttle(function(e){ ViewShift() }, 1000));
	google.maps.event.addListener(map,"zoom_changed", Foundation.utils.throttle(function(e){ ViewShift() }, 1000));


	//$("#map").after('<table id="summary" style="width:100%"><tr><th>Category</th><th>Democrats</th><th>Republicans</th></tr></table> ');

//
// Finally, tell the browser that if the current location changes, it
// should call back to our "Reposition" function (defined above)
//
	navigator.geolocation.watchPosition(Reposition);
};

function giveOpinion(){
	navigator.geolocation.getCurrentPosition(giveOpinionHelper);
};

function giveOpinionHelper(location){
	var latitude = location.coords.latitude;
	var longitude = location.coords.longitude;

	console.log(latitude);
	console.log(longitude);

	var opinion = 0;
	var radios = document.getElementsByName('opinion');
	for (var i = 0, length = radios.length; i < length; i++) {
	    if (radios[i].checked) {
	        opinion = radios[i].value;
	        break;
	    }
	};

	$.get("rwb.pl",
		{
			act:	"insert-opinion-data",
			latitude: latitude,
			longitude:	longitude,
			opinion: opinion
		}, callBackAfterGivingOpinion);
};

function callBackAfterGivingOpinion(data){
	$("#result").html(data);
	console.log(data);
	console.log("callback entered");
};

