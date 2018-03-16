// Druk op een land v/d scatterplot voor toevoegen
// Druk op de bars van een land om ze te verwijderen


function load() {

	margin = {top: 20, right: 40, bottom: 45, left: 40}
	margin_scat = {top: 20, right: 440, bottom: 45, left: 40}
	var total_width = 1500;
	var total_height = 540;
	var height = total_height - margin.top - margin.right;
	var width = total_width - margin.right - margin.left;

 	svg_stack_bar = d3.select("body").append("svg")
 		.attr("class", "svg_stack")
		.attr("width", total_width + margin_scat.right)
		.attr("height" , total_height);
	
	var g_stack_bar = svg_stack_bar.append("g")
			.attr("class", "stacks_g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var g_slice = g_stack_bar.append("g")
		.attr("class", "country_wrap");

	var x_countries = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var x_bars = d3.scale.ordinal();

	var xAxis = d3.svg.axis()
		.scale(x_countries)
		.orient("bottom");

	var y_left = d3.scale.linear()
		.range([height, 0]);

	var y_ax_left = d3.svg.axis()
		.scale(y_left)
		.orient("left");

	var color = d3.scale.category10();

	var width_scat = total_width - margin_scat.right;
	svg_scat = d3.select("body").append("svg")
		.attr("class", "svg_scat")
		.attr("width", total_width + margin_scat.right)
		.attr("height" , total_height - margin.top)
		.attr("transform", "translate(" + 0 + "," + margin.top + ")");

	var g_scat = svg_scat.append("g")
		.attr("class", "g_scat")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// queue(x): x bepaalt hoeveel requests er tegelijk worden uitgevoerd. 
	// Anders worden de requests binnen de queue asynch uitgevoerd (concurrency).
 	var q = d3.queue();

	q.defer(d3.json, "oecd.json");
	q.defer(d3.json, "hpi-index.json");
	q.await(function(error, data1, data2) {	

		if (error) throw error;

		y_left.domain([margin.bottom, d3.max(data1, function(d) {
				return d.Years_education;
			})]);

		d3.select(".stacks_g").append("g")
			.attr("class", "y_ax_left")
			.call(y_ax_left);	

		d3.select(".stacks_g").append("text")
	        .attr("y", 0)
	        .attr("x", -margin.right / 1.3)
	        .attr("dy", ".1em")
	        .text("(%)");

		d3.select(".stacks_g").append("g")
			.attr("class", "xAxis")
			.attr("transform", "translate(" + 0 + "," + height + ")")
			.call(xAxis);	

		function draw_group_bar(dataset) {
			
			var category_names = d3.keys(dataset[0]).filter(function(key) {
				return key !== "Country"; 
			})

			function reorganize(d) {
				d.roomsyears = category_names.map(function(name) { 
					return {name: name, value: +d[name]}; });
			};

			dataset.forEach(function(d) {
				return reorganize(d);
			});

			x_countries.domain(dataset.map(function(d) { return d.Country; }));

			x_bars.domain(category_names).rangeRoundBands([0, x_countries.rangeBand()]);

			d3.select(".xAxis").call(xAxis);

			var country = g_slice.selectAll(".country")
				.data(dataset)
			.enter().append("g")
				.attr("transform", (function(d) { 
					return "translate(" + x_countries(d.Country) + ",0)";	
				}))
				.attr("class", "g")
				.on("click", function(d, i) {
      					var click_country = d.Country;
      					dataset.splice(i, 1);
      					update();
      					// del_bar(click_country);
      			});
				
			country.selectAll("rect")
				.data(function(d) { return d.roomsyears; })
			.enter().append("rect")
				.transition().duration(300).delay(1300).style('opacity','1')
				.attr("width", x_bars.rangeBand())
				.attr("height", function(d) { return height - y_left(d.value)})
				.attr("x", function(d) { return x_bars(d.name) + 55; })
				.attr("y", function(d) { return y_left(d.value); })
				.style("fill", function(d) { return color(d.name)})
				
		}

		function update(clicked_country) {

      		d3.selectAll(".g")
				.remove()
				.data(data1);

      		for (var e = 0; e < data1.length; e++) {

      			if (data1[e].Country == clicked_country) {

          			if (!(data1[e] in selection)) {
      					selection.push(data1[e]);
      				}
      			}
      		}

      		draw_group_bar(selection);
      	}
		//SCATTERPLOT
		
		// set scalers and scales
		var x = d3.scale.linear()
		 	.range([0, total_width - margin_scat.right / 7]);

		var y = d3.scale.linear()
		 	.range([height, 0]);

		x.domain([d3.min(data2, function(d) { return d.HPI; }), d3.max(data2, function(d) { return d.HPI; })]);
		y.domain([75, 90]);

		var selection = [];

		var x_axis = d3.svg.axis()
		 	.scale(x)
		 	.orient("bottom");

		var y_axis = d3.svg.axis()
		 	.scale(y)
			.orient("left");

		g_scat.append("g")
			.attr("class", "x axis")
		 	.attr("transform", "translate(0," + height + ")")
		 	.call(x_axis);

		 g_scat.append("text")
		  		.attr("class", "label_x")
		  		.transition().duration(300).delay(1300).style('opacity','1')
		  		.attr("x", width - margin.left)
		  		.attr("y", height + margin.top)
		  		.text("Happy Planet Index");

		d3.select(".svg_scat").append("g")
			.attr("class", "y axis")
			.call(y_axis)
			.attr("transform", "translate(" + margin.left + "," + margin.top+ ")")
			.append("text")
				.attr("class", "label_y")
				.attr("x", -5)
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
		
		// set circle attribute
		var circle_attr = {
			cx: function(d) { return x(d.HPI) + (margin.top * 1.8); },
			cy: function(d) { return y(d.Life); },
			r: function(d) { return r(d.Wellbeing); }
		};

		// create text box for mouseover event
		var tip = d3.select('body')
      		.data(data2)
      		.append('div')
      		.attr('class', 'tip')
      		.text("")
      		.style('position', 'absolute')
      		.style('display', 'none')
      		.on('mouseover', function(d, i) {
      		  tip.transition().duration(0);
      		})
      		.on('mouseout', function(d, i) {
        		tip.style('display', 'none');
      		});	

		// create 'country'-dots
 		 svg_scat.selectAll(".dot")
		 	.data(data2)
		 	.enter().append("circle")
		 		.attr("class", "dot")
		 		.attr(circle_attr)
		 		.style("fill", function(d) { return coloring(d.Region, region_colors); })
		 		.on('mouseover', function(d, i) {
        				tip.transition().duration(0);
        				tip.style('top', y(d.Life) + total_height + 'px');
       					tip.style('left', x(d.HPI) + 15 + 'px');
        				tip.style('display', 'block');
        				tip.text(d.Country);      			
      				})
      				.on('mouseout', function(d, i) {
        				tip.transition()
        				.delay(150)
        				.style('display', 'none');
      				})
      				.on('click', function(d, i) {
      					var click_country = d.Country;
      					update(click_country);
      				})
	
		// create rectangles, circles and text for the legend
		var rect_width = 10;
	 	
		svg_scat.append("g")
			.selectAll("rect")
			.data(region_colors)
			.enter().append("rect")
				.attr("class", "legend_rect_box")
				.attr("width", rect_width)
				.attr("height", rect_width)
				.attr("x", total_width - margin_scat.right / 7)
				.attr("y", function(d, i) {
					return i*20 + 27;
				})
				.style("fill", function(d, i) { 
					return region_colors[i]["Region"][Object.keys(region_colors[i]["Region"])]; 
		
				});		
		
		svg_scat.append("g")
			.selectAll("text")
			.data(region_colors)
			.enter().append("text")
				.attr("class", "legend_text_box")
				.text(function(d, i) {
			  		return Object.keys(d.Region);
				})
				.attr("x", total_width - margin_scat.left)	
				.attr("y", function(d, i) {
					return i*20 + margin.top;
				})
				.attr("dy", "1em"); 
	
		svg_scat.append("g").append("text")
			.attr("class", "legend_text_box")	
			.attr("x", width + margin.left)
			.attr("y", margin.top / 1.5)
			.text("Regions");


		var legend_circle_data = [3, 6, 7.25];
		svg_scat.append("g")
			.selectAll(".dot")
			.data(legend_circle_data)
			.enter().append("circle")
				.attr("class", "dot")
				.attr("cx", total_width - (margin_scat.left * 1.5))
				.attr("cy", function(d, i) {
					return i*20 + 203;
				})
				.attr("r", function(d) {
					return d;
				})
				.style("fill", "#ffffff");

		var legend_circle_texts = ["Poor Wellbeing", "Middling Wellbeing", "Good Wellbeing"];

		svg_scat.append("g")
			.selectAll("text")
			.data(legend_circle_texts)
			.enter().append("text")
				.attr("class", "legend_text_box")
				.attr("x", total_width - margin_scat.left)
				.attr("y", function(d, i) {
					return i*20 + 203;
				})
				.text(function(d, i) {
					return d;
				});

	});

}
	
