// Enrikos Iossifidis

function load() {

	// set colors
	var data = [{arg: "0", col:"#ffffb2"}, 
				{arg: "1", col:"#fecc5c"},
				{arg: "2", col:"#fd8d3c"}, 
				{arg: "3", col:"#f03b20"},
				{arg: "4", col:"#bd0026"},
				{arg: "5", col:"#000"}];

	// set margins, svg and g element
	var margin = {top: 30, right: 40, bottom: 10, left: 10},
			width = 96 - margin.left - margin.right,
			height = 250 - margin.top - margin.bottom;	

	var rect_width = 10;

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
	 	.attr("height", height + margin.top + margin.bottom);
	
	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// create rectangles with corresponding color
	g.selectAll("rect")
		.data(data)
		.enter().append("rect")
			.attr("class", "legend_rect_box")
			.attr("width", rect_width)
			.attr("height", rect_width)
			.attr("x", 0)
			.attr("y", function(d, i) {
				return i*20;
			} )
			.attr("fill", function(d, i) {
				return d["col"];
			});

	// create text box with corresponding text
	g.selectAll("text")
		.data(data)
		.enter().append("text")
			.attr("class", "legend_text_box")
			.text(function(d, i) {
				return d["arg"] + " < " + (+d["arg"] + 1);
			})
			.attr("x", function() {return width / 2;})	
			.attr("y", function(d, i) {
				return (i*20 + height) - height - 6;
			})
			.attr("dy", "1em");

	var text_stdev = svg.append("text")
		.attr("transform", "translate(" + (width / 2) + "," + margin.top / 2 + ")")
		.text("std. dev."); 
}