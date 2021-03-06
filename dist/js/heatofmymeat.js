$(document).ready(function () {
	// Gather my elements here so I don't have to keep using the DOM
	// Initially setting the 'Stop' button to hidden, and initializing
	// global variables
	var stopButton = $('#stopLog').parent();
	var startButton = $('#startLog').parent();
	var updateButton = $('#updateThreshold');
	var minThresh = $('#minThreshold');
	var maxThresh = $('#maxThreshold');
	stopButton.hide();
	var temp_history = [];
	var log, tempGraph, min, max;
	
	// Creating the dial from jQuery knob
	var dial = $('.dial').knob({
		'min': 0,
		'max': 500,
		'readOnly': true
	});
	
	// Begin reading from the database
	startButton.click(function() {
		startButton.hide();
		stopButton.show();
		startLogging();
	});
	
	// Stop reading from the database
	stopButton.click(function() {
		stopButton.hide();
		startButton.show();
		clearInterval(log);
	});
	
	// Set the min/max temperature threshold
	updateButton.click(function() {
		min = minThresh.val();
		max = maxThresh.val();
	});
	
	// Get things rolling	
	initialLoad();	
	
	// Calls to this will redraw the graph using the temp_history array as temperatures
	function renderGraph() {
		if(tempGraph) {
			tempGraph.destroy();	// If it graph is up (hint: it is) take it down
		}
		tempGraph = $.jqplot('tempGraph', [temp_history], {
			title: 'Temperature History',
			series: [{
				yaxis: 'yaxis',
				color: '#e55b00',
				fillAndStroke: true,
				showMarker: false	
			}],
			axes: {
				xaxis: {
					min: 0,
					max: 600,
					numberTicks: 11
				},
				yaxis: {
					min: 0,
					max: 350,
					tickOptions: {
						formatString: '%.2f' // Format the string so it looks pretty
					},
					numberTicks: 15
				}	
			}	
		}); 	
	}
	
	// Make a call to the php function to get the next recorded temps
	function startLogging() {
		log = window.setInterval(function() {
			$.ajax({
				async: true,
				cache: false,
				url: "query_db.php",
				data: {limit: 1}, // Only 1 because we have already initialied the array
				type: "POST",
				success: function(response) {
					var temp = response[0].temp;
					temp_history.push(temp);
					renderGraph(); // Draw the graph after we get the temp
					if(parseInt(temp) > parseInt(max)) { // Logic for coloring the dial
						dial.trigger('configure', {'fgColor': "#e55b00"});
					} else if(parseInt(temp) < parseInt(min)) {
						dial.trigger('configure', {'fgColor': "#86a6b2"});
					} else {
						dial.trigger('configure', {'fgColor': "#4ea922"});					
					}
					$('.dial').val(temp).trigger('change'); // Update the dial with the current temp   
				},
				error: function(response) {
					console.log(response);
				}
			});
		}, 3000);
	}
	
	// Initialize the graph by getting the last 600 (30 minutes worth) of temps
	function initialLoad() {
		$.ajax({
			async: true,
			cache: false,
			data: { limit: 600 }, // 600 results @ 3 seconds each = 1800 total seconds = 30 minutes
			url: "query_db.php",
			type: "POST",
			success: function(response) {
				for(var i = response.length - 1; i >= 0; i--) { // They come in backwards
					temp_history.push(response[i].temp);
				}
				renderGraph();
			},
			error: function(response) {
				console.log(response);
			}
		});
	}
});