// Enrikos Iossifidis

function load() {

	//load file
	d3.json("convertCSV2JSON.json", function(error, data) {

		if (error) throw error;

		for (object in data) {
			
			console.log(data[object]);
		}	
	})	
}