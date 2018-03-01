// Enrikos Iossifidis

function load() {
	
	//load file
	d3.json("convertCSV2JSON.json", function(error, data) {

		if (error) throw error;

		// set basic variables
		var margin = {top: 15, right: 220, bottom: 45, left: 30},
			radius = 4.5,
			width = 980 - margin.left - margin.right,
			height = 520 - margin.top - margin.bottom;

		// set canvas
		var canvas = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
		 	.attr("height", height + margin.top + margin.bottom)
		 	.append("g")
		 		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		 data.forEach(function(d) {
		 	d["HPI"] = +d["HPI"];
		 	d["Life"] = +d["Life"];
		 });

		 // set scalers and scales
		 var x = d3.scale.linear()
		 	.range([0, width])
		 	.domain([d3.min(data, function(d) { return d.HPI; }), d3.max(data, function(d) { return d.HPI; })]);

		 var y = d3.scale.linear()
		 	.range([height, 0])
		 	.domain([d3.min(data, function(d) { return d.Life; }), d3.max(data, function(d) { return d.Life; })]);

		 var x_axis = d3.svg.axis()
		 	.scale(x)
		 	.orient("bottom");

		 var y_axis = d3.svg.axis()
		 	.scale(y)
		 	.orient("left");
		
		// add axes
		 canvas.append("g")
			.attr("class", "x axis")
		 	.attr("transform", "translate(0," + height + ")")
		 	.call(x_axis)
		 	.append("text")
		  		.attr("class", "label_x")
		  		.attr("x", width - margin.left)
		  		.attr("y", 30)
		  		.text("Happy Planet Index");

		 canvas.append("g")
		 	.attr("class", "y axis")
		 	.call(y_axis)
		 	.append("text")
		  		.attr("class", "label_y")
		  		.attr("x", -margin.left)
		  		.attr("y", -5)
		  		.text("Life Expectancy");
 
		 // create data for colors
 		var region_colors = [{"Region": {"Americas": "#b2182b"}}, {"Region": {"Asia Pacific": "#ef8a62"}},
		 						{"Region": {"Europe": "#762a83"}}, {"Region": {"Post-communist": "#d1e5f0"}},
		  						{"Region": {"Sub Saharan Africa": "#4d9221"}}, 
								{"Region": {"Middle East and North Africa": "#2166ac"}}];

		// find the right color
		function coloring(region, dataset) {

				for (var i = 0; i < 6; i++) {
					if (region == Object.keys(dataset[i]["Region"])) {

						return dataset[i]["Region"][region];
					}
				}
		}

		// set scale and attributes of circle
		var r = d3.scale.linear()
			.range([0.1, 9.9])
			.domain([2.5, 7.8]);

		var circle_attr = {
			cx: function(d) { return x(d.HPI); },
			cy: function(d) { return y(d.Life); },
			r: function(d) { return r(d.Wellbeing); }
		};

		// create 'country'-dots
 		 canvas.selectAll(".dot")
		 	.data(data)
		 	.enter().append("circle")
		 		.attr("class", "dot")
		 		.attr(circle_attr)
		 		.style("fill", function(d) { return coloring(d.Region, region_colors); });
	
		// create rectangles, circles and text for the legend
		var rect_width = 10;
	 	
		canvas.append("g")
			.selectAll("rect")
			.data(region_colors)
			.enter().append("rect")
				.attr("class", "legend_rect_box")
				.attr("width", rect_width)
				.attr("height", rect_width)
				.attr("x", width + margin.left)
				.attr("y", function(d, i) {
					return i*20;
				})
				.style("fill", function(d, i) { 
					return region_colors[i]["Region"][Object.keys(region_colors[i]["Region"])]; 
		
				});		
		
		canvas.append("g")
			.selectAll("text")
			.data(region_colors)
			.enter().append("text")
				.attr("class", "legend_text_box")
				.text(function(d, i) {
			  		return Object.keys(d.Region);
				})
				.attr("x", width + margin.left + rect_width*2)	
				.attr("y", function(d, i) {
					return i*20 - 3;
				})
				.attr("dy", "1em"); 
	
		canvas.append("g").append("text")
			.attr("class", "legend_text_box")	
			.attr("x", 845)
			.attr("y", -5)
			.text("Regions");

		var legend_circle_data = [3, 6, 7.25];
		canvas.append("g")
			.selectAll(".dot")
			.data(legend_circle_data)
			.enter().append("circle")
				.attr("class", "dot")
				.attr("cx", 780)
				.attr("cy", function(d, i) {
					return i*20 + 150;
				})
				.attr("r", function(d) {
					return d;
				})
				.style("fill", "#ffffff");

		var legend_circle_texts = ["Poor Wellbeing", "Middling Wellbeing", "Good Wellbeing"];
		console.log(legend_circle_texts[1]);
		canvas.append("g")
			.selectAll("text")
			.data(legend_circle_texts)
			.enter().append("text")
				.attr("class", "legend_text_box")
				.attr("x", 800)
				.attr("y", function(d, i) {
					return i*20 + 153;
				})
				.text(function(d, i) {
					return d;
				});
	})
}