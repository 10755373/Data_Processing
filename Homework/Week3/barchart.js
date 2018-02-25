// Enrikos Iossifidis

function load() {
 	// get local file
	d3.json("convertCSV2JSON.json", function(data) {
        
	// set margins w/ d3
        var margin = {top: 15, right: 30, bottom: 30, left: 35},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;	
	
        // set canvas with margin w/ d3
	var canvas = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
	 	.attr("height", height + margin.top + margin.bottom)
	 	.append("g")
	 		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		 	
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
	
	for (var i = 0; i < data.length; i++) {
		data[i]["date"] = months[i];
	};
		
	// scale x and y-axis w/ d3
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], 0.4);

	x.domain(data.map(function(d) { return d.date; }));

	var y = d3.scale.linear()
		.range([height, 0]);
			
	y.domain([0, d3.max(data, function(d) { return d.temp; })]);	

	var x_axis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var g = d3.select("svg g")
	g.append("g")
		.attr("class", "x")
		.attr("transform", "translate(" + 0 + "," + height + ")")
		.call(x_axis);
	
	var y_axis = d3.svg.axis()
		.scale(y)
		.orient("left");
		
	g.append("g")
		.attr("class", "y")
	 	.call(y_axis);
	
	// create graphical bars for rain data
	g.selectAll("rect")
		.data(data)
		.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.date); })
			.attr("y", function(d) { return y(d.temp); })
			// y = 0 is the largest data point (most rainfall), height needs to be total height
			// that is why height - y(d.temp)
			.attr("height", function(d) { return height - y(d.temp); })
				.attr("width", 40)
			.style("fill", "steelblue")
				.on("mousemove", function(d, i) { 
				var this_bar = d3.select(this)
						.style("fill", "green");
		
			// HOW DO YOU ADD THE VALUE NUMBER IN TEXT???
			// why does the text element not take any x value?
			// instead it returns an empty text element
			//canvas.enter().append("text")
				//.attr("id", "t" + d.date + "-" + d.temp + "-" + i) 
				//.attr("x", parseInt(function() { return d3.this.attr("#x");}))
               			//.attr("y", parseInt(function() { return d3.this.attr("#y");}))
           	})
           
            	.on("mouseout", function(d, i) {
           		var this_bar = d3.select(this)
           			.style("fill", "steelblue");
			// HOW?
           		//d3.select("#t" + d.date + "-" + d.temp + "-" + i).remove();
           	});
       
	// set graphical communication
	d3.select("svg")
		.append("text")
		    .attr("transform", "translate(" + 0 + "," + margin.top + ")")
		    .attr("dy", "1em")
		    .text("mm");
		
	d3.select("svg")
		.append("text")
		.attr("transform", "translate(" + width / 2.5 + "," + margin.top + ")")
		.text("Average Monthly Rain De Bilt 2015");
	})
}
