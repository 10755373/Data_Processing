// Enrikos Iossifidis

function load() {

	//load file
	d3.json("convertCSV2JSON.json", function(error, data) {

		if (error) throw error;

		// create svg and set margins
		var svg = d3.select("body").append("svg"),
			margin = {top: 20, right: 200, bottom: 130, left: 40},
			width = 1100 - margin.right - margin.left,
			height = 680 - margin.top - margin.bottom;

		svg	
			.attr("width", width + margin.right + margin.left)
			.attr("height", height + margin.top + margin.bottom);

		// create menu list with click function
		var topics = ["CO2", "SO2", "NOx"];
		var emission_menu = svg.append("g")
			.attr("class", "emmision_menu")
				.selectAll("text")
				.data(topics)
				.enter().append("text")
				.attr("class", "topic")
				.attr("x", width + 120)
				.attr("y", function(d, i) {
					return margin.bottom + (40 * i);
				})
				.text(function(d, i) { return topics[i]; })
				.on("click", function() {
					d3.selectAll(".lines").remove();
					d3.selectAll(".axis").remove();
					topic = d3.select(this).text();
					draw(topic, data);
				});
		
		// add chart information
		svg.append("text")
			.attr("x", width + margin.left)
			.attr("y", margin.bottom / 1.5)
			.text("Choose your Emission!");

		var g = svg.append("g")
	 		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	 		.attr("class", "canvas");
		  	
		g.append("text")
		   	.attr("x", width / 3)
		  	.attr("y", -10)
		  	.text("CO2 emission of the Energy Market, Households and Industry (NL)");

		 g.append("g")
		 	.attr("transform", "translate(0," + height + ")")
		 	.append("text")
		  		.attr("x", width / 2.05)
		  		.attr("y", margin.top * 3)
		  		.text("Enrikos Iossifidis");
	
		function draw(topic, data) {

			var nijverheid = [];
			var particulier = [];
			var industry = [];
			var parseYear = d3.time.format("%Y").parse;

			// get relevant data for each sort emission
			if (topic == "CO2") {

				for (var i = 0; i < 6; i++) { 
			
					industry.push({"Jaar": parseYear(data[i].Jaar), 
									"Emission": data[i].Energiesector / 1000})			

					nijverheid.push({"Jaar": parseYear(data[i].Jaar), 
									"Emission": data[i].Nijverheid / 1000})

					particulier.push({"Jaar": parseYear(data[i].Jaar), 
									"Emission": data[i].Particulier / 1000})
		
				} 
			}

			var listbgn = 0;
			var listend = 0;

			if (topic == "SO2") {
					listbgn = 6;
					listend= 12;
					for (listbgn; listbgn < listend; listbgn++) {

						industry.push({"Jaar": parseYear(data[listbgn].Jaar), 
										"Emission": parseInt(data[listbgn].Energiesector)})			

						nijverheid.push({"Jaar": parseYear(data[listbgn].Jaar), 
										"Emission": parseInt(data[listbgn].Nijverheid)})

						particulier.push({"Jaar": parseYear(data[listbgn].Jaar), 
										"Emission": parseInt(data[listbgn].Particulier)})
					}
			}	else if (topic == "NOx") {
					listbgn= 12;
					listend = 18;
					for (listbgn; listbgn < listend; 
						listbgn++) {
						industry.push({"Jaar": parseYear(data[listbgn].Jaar), 
										"Emission": parseInt(data[listbgn].Energiesector)})			

						nijverheid.push({"Jaar": parseYear(data[listbgn].Jaar), 
										"Emission": parseInt(data[listbgn].Nijverheid)})

						particulier.push({"Jaar": parseYear(data[listbgn].Jaar), 
										"Emission": parseInt(data[listbgn].Particulier)})
					}
				}				

			data_c = [nijverheid, industry, particulier];
			colors = ["green", "black", "steelblue"];
			names = ["Industry", "Energy Market", "Households"];

			//make axes for each kind of emission
			var x = d3.time.scale()
				.range([0, width])
				.domain(d3.extent(industry, function(d) {
					return d.Jaar;
				}));
			console.log(d3.max(data_c));
			var y = d3.scale.linear()
				.range([height, 0])
				.domain([d3.min(particulier, function(d) {
					return d.Emission;
				}), d3.max(industry, function(d) {
					return d.Emission;})]);
				
			var x_axis = d3.svg.axis()
				.scale(x)
			 	.orient("bottom");

			var y_axis = d3.svg.axis()
			 	.scale(y)
			 	.orient("left");

			g.append("g")
				.attr("class", "x axis")
		 		.attr("transform", "translate(0," + height + ")")
		 		.call(x_axis)
		 		.append("text")
		  			.attr("class", "label_x")
		  			.attr("x", width)
		  			.attr("y", 2 * margin.top)
		  			.text("Year");

		 	g.append("g")
				.attr("class", "y axis")
		 		.call(y_axis)
		 		.append("text")
		  			.attr("x", -margin.left)
		  			.attr("y", -10)
		  			.text("Emission (CO2 x1000, SO2, NOx) in kt");

		  	// create lines
			var line = d3.svg.line()
				.x(function(d) { return x(d.Jaar); })
				.y(function(d) { return y(d.Emission); })
				.interpolate("linear");

			var lines = g.selectAll(".lines")
				.data(data_c)
				.enter().append("g")
				.attr("class", "lines");

			lines.append("path")
				.style("fill", "none")
				.style("stroke", function(d, i) {
					return colors[i]; 
				})
				.style("stroke-width", 2)
				.attr("d", function(d, i) { return line(data_c[i]); });

			lines.append("text")
				.attr("transform", function(d, i) {
					return "translate(" + x(data_c[i][5].Jaar) +
						"," + y(data_c[i][5].Emission) + ")"; })
				.attr("x", 3)
				.attr("dy", "0.35em")
				.style("font", "10px sans-serif")
				.text(function(d, i) { return names[i];	});		

			// create vertical crosshair with text
			var crosshairs = g.append("g")
				.attr("transform", "translate(" + 0 + "," + 0 + ")")
				.attr("class", "interactive_map");

			var rect = crosshairs.append("rect")
				.attr("x", 0)
	  		    .attr("y", 0)
	    		.attr("width", width)
	    		.attr("height", height)
	    		.attr("fill", "white")
	    		.attr("opacity", 0);

			var vertical_line = crosshairs.append("g")
				.attr("class", "vert-wrap")
				.attr("opacity", 0)
				.attr("transform", "translate(" +  + "," + 0 + ")");

			var v_line = vertical_line.append("line")
				.attr("y1", 0)
				.attr("y2", height)
				.attr("stroke", "black")
				.attr("stroke-width", 1)
				.attr("pointer-events", "none");

			var v_rects = vertical_line.selectAll("rect")
				.data(data_c)
				.enter().append("rect")
				.attr("class", "rect")
				.attr("x", 2)
				.attr("y", function(d, i){
					return 300 + (15*i);
				})
				.attr("width", 50)
				.attr("height", 16)
				.attr("fill", "#fff");

			var v_text = vertical_line.selectAll("text")
				.data(data_c)
				.enter().append("text")
			   	.attr("x", 4)
			  	.attr("y", function(d, i) {
			  		return (i*20) + 100;
			  	})
			  	.text(function(d, i) { return names[i]; });

			rect.on("mousemove", mousemove)
				.on("mouseout", function() {
					vertical_line.attr("opacity", 0);
				});	

			function mousemove() {
				coordinates = d3.mouse(this);
				var mouseYear = x.invert(coordinates[0]);
				var bisectDateleft = d3.bisector(function(d) {
					return d['Jaar'];
				}).left;
				var j = bisectDateleft(data_c[0], mouseYear);
			
				var d0 = data_c[0][j - 1].Jaar;
				var d1 = data_c[0][j].Jaar;
				var d2 = (x(d1) - x(d0)) / 2;
				var d = (x(mouseYear) - x(d0) < d2) ? d0 : d1;
				var k = bisectDateleft(data_c[0], d);
			
				vertical_line.attr("opacity", 0.5)
								.attr("transform", "translate(" + x(d) + "," + 0 + ")");
				v_text.text(function(d, i) { return names[i] + " " + data_c[i][k].Emission + " kt"; });

			}
		}		
	})	
		
}