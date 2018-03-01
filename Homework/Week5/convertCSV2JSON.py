# Enrikos Iossifidis

import csv
import json

csv_file = open("data_line.csv", 'r')
json_file = open("convertCSV2JSON.json", 'w')

data = []

# skip first rows
counter = 3

# split at ';'
csv_reader = csv.reader(csv_file, delimiter=';')

# append data to the json file 
for row in csv_reader:
	if counter > 6 and counter < 42:
		data.append({"Jaar": row[1], "Energiesector": row[5], "Nijverheid": row[6], 
			"Particulier": row[7], "Onderwerp": row[0]})
		counter += 1
	counter += 1	
		
json.dump(data, json_file, indent = 4)

