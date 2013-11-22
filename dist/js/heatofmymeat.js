$(document).ready(function () {
	var stopButton = $('#stopLog').parent();
	var startButton = $('#startLog').parent();
	var updateButton = $('#updateThreshold');
	var minThresh = $('#minThreshold');
	var maxThresh = $('#maxThreshold');
	stopButton.hide();
	var temp_history = [];
	var log, tempGraph, min, max;
	
	
	var dial = $('.dial').knob({
		'min': 0,
		'max': 500,
		'readOnly': true
	});
	
	startButton.click(function() {
		startButton.hide();
		stopButton.show();
		startLogging();
	});
	
	stopButton.click(function() {
		stopButton.hide();
		startButton.show();
		clearInterval(log);
	});
	
	updateButton.click(function() {
		min = minThresh.val();
		max = maxThresh.val();
	});
		
	initialLoad();	
	
	function renderGraph() {
		if(tempGraph) {
			tempGraph.destroy();	
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
						formatString: '%.2f'
					},
					numberTicks: 15
				}	
			}	
		}); 	
	}
	
	function startLogging() {
		log = window.setInterval(function() {
			$.ajax({
				async: true,
				cache: false,
				url: "query_db.php",
				data: {limit: 1},
				type: "POST",
				success: function(response) {
					var temp = response[0].temp;
					temp_history.push(temp);
					renderGraph();
					if(parseInt(temp) > parseInt(max)) {
						dial.trigger('configure', {'fgColor': "#e55b00"});
					} else if(parseInt(temp) < parseInt(min)) {
						dial.trigger('configure', {'fgColor': "#86a6b2"});
					} else {
						dial.trigger('configure', {'fgColor': "#4ea922"});					
					}
					$('.dial').val(temp).trigger('change');   
				},
				error: function(response) {
					console.log(response);
				}
			});
		}, 3000);
	}
	
	function initialLoad() {
		$.ajax({
			async: true,
			cache: false,
			data: { limit: 600 },
			url: "query_db.php",
			type: "POST",
			success: function(response) {
				for(var i = response.length - 1; i >= 0; i--) {
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