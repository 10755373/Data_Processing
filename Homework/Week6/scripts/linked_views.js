/*
*	Enrikos Iossifidis
*	10806782
*	Linked views
*/

function load() {

	// GENERAL STUFF
	// set standard numbers
	margin = {top: 20, right: 40, bottom: 45, left: 40}
	margin_scat = {right: 100}
	var total_width = 900;
	var total_height = 320;
	var height = total_height - margin.top - margin.right;
	var width = total_width - margin.right - margin.left;

	// create tip
	var tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0]);

	// append row, columns and headers
	var container = d3.select("body").append("div")
		.attr("class", "container-fluid");

	var row = d3.select(".container-fluid").append("row")
		.attr("class", "row");

	var col_ex = row.append("div")
		.attr("class", "col-md-3");

	var col = row.append("div")
			.attr("class", "col-md-6");

	var col_post = row.append("div")
		.attr("class", "col-md-3");

	var col_post_1 = col_post.append("div")
		.attr("class", "col-md-9");

	var col_post_2 = col_post.append("div")
		.attr("class", "col-md-3");

	col.append("h2")
		.text("Linked maps");

	col.append("h3")
		.text("Enrikos Iossifidis 10805672")
		.append("h3")
			.text("");

	var gen_description = col_post_1.append("g")
		.attr("class", "gen_description");

	col.append("h5")
		.text(" 1. Click on a country-dot to add a grouped bar. 2. You can delete a grouped bar by clicking on it. 3. Enjoy:)");


	// GROUPED BAR ELEMENTS
	// create axis and elements for stack bar
	var stack_container	= col.append("div")
			.attr("class", "svg-container");

 	svg_stack_bar = stack_container.append("svg")
 		.attr("class", "svg_stack")
		.attr("viewBox", [0, 0, (total_width),
                        (total_height + margin.bottom)].join(' '));

	var g_stack_bar = svg_stack_bar.append("g")
			.attr("class", "stacks_g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var g_slice = g_stack_bar.append("g")
		.attr("class", "country_wrap");

	svg_stack_bar.call(tip2);

	var x_countries = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var x_bars = d3.scale.ordinal();

	var xAxis = d3.svg.axis()
		.scale(x_countries)
		.orient("bottom");

	var y_left = d3.scale.linear()
		.range([height, 0])
		.nice();

	var y_ax_left = d3.svg.axis()
		.scale(y_left)
		.orient("left");

	var color = d3.scale.category10();


	// SCAT ELEMENTS
	// create elements and the axes (partly) for scatterplot
	var width_scat = total_width - margin_scat.right;
	var scat_container = col.append("div")
			.attr("class", "svg-container");

	svg_scat = scat_container.append("svg")
		.attr("class", "svg_scat")
		.attr("viewBox", [0, 0, (total_width + (2 * margin_scat.right)),
                        (total_height + (margin.bottom * 2))].join(' '));	

	var g_scat = svg_scat.append("g")
		.attr("class", "g_scat")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scale.linear()
	 	.range([0, total_width]);

	var y = d3.scale.linear()
	 	.range([total_height, 0]);

	// QUEUE DATA
 	var q = d3.queue();
 	
	q.defer(d3.json, "https://github.com/EnrikosIossifidis/Data_Processing/blob/master/Homework/Week6/data/oecd.json");
	q.defer(d3.json, "https://github.com/EnrikosIossifidis/Data_Processing/blob/master/Homework/Week6/data/hpi-index.json");
	q.defer(d3.text, "https://github.com/EnrikosIossifidis/Data_Processing/blob/master/Homework/Week6/scripts/data_description.txt");
	q.defer(d3.text, "https://github.com/EnrikosIossifidis/Data_Processing/blob/master/Homework/Week6/scripts/bar_descr.txt");
	q.defer(d3.text, "https://github.com/EnrikosIossifidis/Data_Processing/blob/master/Homework/Week6/scripts/scat_descr.txt");
	q.defer(d3.text, "https://github.com/EnrikosIossifidis/Data_Processing/blob/master/Homework/Week6/scripts/goal_descr.txt");
	q.await(function(error, data1, data2, data_description, bar_descr, scat_descr, goal_descr) {	

		if (error) throw error;

		// GENERAL STUFF
		// add text to right column
		gen_description.append("h4")
			.text("Data description");

		gen_description.append("text")
	        .attr("y", 0)
	        .attr("x", -margin.right / 1.3)
	        .attr("dy", ".1em")		
			.text(data_description);

		gen_description.append("h4")
			.text("Grouped bars");

		gen_description.append("text")
	        .attr("y", 0)
	        .attr("x", -margin.right / 1.3)
	        .attr("dy", ".1em")		
			.text(bar_descr);

		gen_description.append("h4")
			.text("Scatterplot");

		gen_description.append("text")
	        .attr("y", 0)
	        .attr("x", -margin.right / 1.3)
	        .attr("dy", ".1em")		
			.text(scat_descr);

		gen_description.append("h4")
			.text("Goal");

		gen_description.append("text")
	        .attr("y", 0)
	        .attr("x", -margin.right / 1.3)
	        .attr("dy", ".1em")		
			.text(goal_descr);

		// create button group on left column
		var buttongroup = col_ex.append("div")
			.attr("class", "btn-group");

		var select_all_button = buttongroup.append("button")
			.attr("type", "button")
			.attr("class", "btn btn-primary")
			.text("Select All")
			.on("click", function() {
				d3.selectAll(".g").remove();
				draw_group_bar(data1);
			});

		var select_button_div = buttongroup.append("div")
			.attr("class", "btn-group")
			.append("button")
				.attr("type", "button")
				.attr("class", "btn btn-primary dropdown-toggle")
				.attr("data-toggle", "dropdown")
				.text("Select ");

		select_button_div.append("span")
			.attr("class", "caret");

		d3.select(".btn-group").select(".btn-group").append("ul")
			.attr("class", "dropdown-menu")
			.attr("role", "menu")

		d3.select(".dropdown-menu").selectAll("li")
			.data(data1)
			.enter().append("li")
				.append("a")
					.text(function(d) { return d.Country; })
					.on("click", function(d, i) {
      					var click_country = d.Country;
      					update(click_country);
      				});

		var remove_all_button = buttongroup.append("button")
			.attr("type", "button")
			.attr("class", "btn btn-primary")
			.text("Remove Selection")
			.on("click", function() {
				selection = [];
				delete_update(selection);
			});


		// GROUPED BARS
		// remember current country selection
		var selection = [];

		// draw y and x axis
		y_left.domain([margin.bottom, d3.max(data1, function(d) {
				return d.Education_att;
			})]);

		d3.select(".stacks_g").append("g")
			.attr("class", "y_ax_left")
			.call(y_ax_left);	

		d3.select(".stacks_g").append("text")
	        .attr("y", -margin.top)
	        .attr("x", -margin.right / 1.3)
	        .attr("dy", "1em")
	        .text("(%)");

		d3.select(".stacks_g").append("g")
			.attr("class", "xAxis")
			.attr("transform", "translate(" + 0 + "," + height + ")")
			.call(xAxis);	

		// is called by update function
		function draw_group_bar(dataset) {	

			// reorganize dataset
			var category_names = d3.keys(dataset[0]).filter(function(key) {
				return key !== "Country"; 
			})

			function reorganize(d) {
				d.social_edu = category_names.map(function(name) { 
					return {name: name, value: +d[name]}; });
			};

			dataset.forEach(function(d) {
				return reorganize(d);
			});

			// draw x axis with selected data
			x_countries.domain(dataset.map(function(d) { return d.Country; }));

			x_bars.domain(category_names).rangeRoundBands([0, x_countries.rangeBand()]);

			d3.select(".xAxis").call(xAxis);
			d3.select(".xAxis").selectAll(".tick").selectAll("text")
				.attr("transform", "rotate(45)")
				.style("text-anchor", "start");

			// create g for selected data and add delete function
			var country = g_slice.selectAll(".country")
				.data(dataset)
			.enter().append("g")
				.attr("transform", (function(d) { 
					return "translate(" + x_countries(d.Country) + ",0)";	
				}))
				.attr("class", "g")
				.on("click", function(d, i) {
      					click_country = d.Country;
      					delete_update(dataset, click_country);
      			});

			// create bars (with tooltip!!)
			country.selectAll("rect")
				.data(function(d) { return d.social_edu; })
			.enter().append("rect")
				.transition().duration(200).delay(1000).style('opacity','1')
				.attr("width", x_bars.rangeBand())
				.attr("height", function(d) { return height - y_left(d.value)})
				.attr("x", function(d) { return x_bars(d.name) - 5; })
				.attr("y", function(d) { return y_left(d.value); })
				.style("fill", function(d) { return color(d.name)})

			d3.select(".country_wrap").selectAll("g").selectAll("rect")
			.data(function(d) { return d.social_edu; })
			.on('mouseover', function(d) {
				tip2.html(function() {
	    		return "<strong>" + d.name + ": " + "</strong> <span style='color:red'>" + d.value + "%" + "</span>";
	  			})
				tip2.show();
			})
      		.on('mouseout', tip2.hide());
      	
		}

		// function is called by "select all button"
		// and scatterplot
		function update(click_country) {

      		d3.selectAll(".g")
				.remove()
				.data(data1);

      		for (var e = 0; e < data1.length; e++) {

      			if (data1[e].Country == click_country) {

          			if (!(data1[e] in selection)) {
      					selection.push(data1[e]);
      				}
      			}
      		}

      		draw_group_bar(selection);
      	}
		
		// called when grouped bar is clicked
		function delete_update(new_bar_group, clicked_country) {
			d3.selectAll(".g")
				.remove()
				.data(new_bar_group);

			var data_temp = []
			for (var e = 0; e < new_bar_group.length; e++) {

				if (click_country != null) {
		      		if (new_bar_group[e].Country == clicked_country) {
		      				console.log(new_bar_group[e]);
		      		}	else {
		      			data_temp.push(new_bar_group[e]);
		      		}
		      	}		
	      	}
	 
			draw_group_bar(data_temp);
		}


		// SCATTER
		// set scalers and draw scales
		x.domain(d3.extent(data2, function(d) { return d.HPI; }));
		y.domain([75, 90]);

		draw_scat_axes(data2);

		// set scale and attributes of circles
		var r = d3.scale.linear()
				.range([0.1, 9.9])
				.domain([2.5, 7.8]);
		
		// set circle attribute
		var circle_attr = {
			cx: function(d) { return x(d.HPI) + (margin.top * 1.8); },
			cy: function(d) { return y(d.Life); },
			r: function(d) { return r(d.Wellbeing); }
		};

		draw_scat_dots(data2);

		function draw_scat_axes(data2) {

			var x_axis = d3.svg.axis()
			 	.scale(x)
			 	.orient("bottom");

			var y_axis = d3.svg.axis()
			 	.scale(y)
				.orient("left");

			g_scat.append("g")
				.attr("class", "x axis")
			 	.attr("transform", "translate(0," + total_height + ")")
			 	.call(x_axis);

			 g_scat.append("text")
			  		.attr("class", "label_x")
			  		.attr("x", width - margin.left)
			  		.attr("y", total_height + margin.bottom)
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
		}

		function draw_scat_dots(elements) {

			// create 'country'-dots
	 		 svg_scat.append("g")
	 		 	.attr("class", "g_circles")
	 		 	.selectAll(".dot")
			 	.data(elements)
			 	.enter().append("circle")
			 		.attr("class", "dot")
			 		.attr(circle_attr)
			 		.style("fill", "#31a354")
			 		.on("click", function(d) {
			 			var click_country = d.Country;
			 			update(click_country);
			 		})		 		
					.on('mouseover', function(d) { tip2.html(function() {
			    		return "<strong>" + d.Country + "</strong>";
			  			})
						tip2.show();
					})
		      		.on('mouseout', function() {
		      			tip2.hide();
					});

			// create legend circles and text for the legend
			var legend_circle_data = [4.5, 6.5, 8.5];
			svg_scat.append("g")
				.selectAll(".dot")
				.data(legend_circle_data)
				.enter().append("circle")
					.attr("class", "dot")
					.attr("cx", total_width + margin.left)
					.attr("cy", function(d, i) {
						return i*20 + margin.top;
					})
					.attr("r", function(d) {
						return d;
					});

			var legend_circle_texts = ["Poor Wellbeing", "Middling Wellbeing", "Good Wellbeing"];

			svg_scat.append("g")
				.selectAll("text")
				.data(legend_circle_texts)
				.enter().append("text")
					.attr("class", "legend_text_box")
					.attr("x", total_width + (margin.right * 1.5))
					.attr("y", function(d, i) {
						return i*23 + margin.top;
					})
					.text(function(d, i) {
						return d;
					});
		}
	});

}
	
