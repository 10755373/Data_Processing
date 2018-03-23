# Enrikos Iossifidis 10805672
# Converting csv to json

import csv
import json

csv_file = open("europa_2.csv", 'r')
json_file = open("oecd.json", 'w')

data = []

# skip first rows
counter = 0

# split at ';'
csv_reader = csv.reader(csv_file)
data_row = {}

# append data to the json file 
for row in csv_reader:
	data_row = {}
	if counter > 0 and counter < 19:
		data_row["Country"] = row[1]
		data_row["Support_network"] = row[14]
		data.append(data_row)

	if counter > 54 and counter < 73:
		data_row["Country"] = row[1]
		data_row["Education_att"] = row[14]
		data.append(data_row)

	counter += 1

# put two elements together in one key-value pair
for i in range(len(data)):
	if i > 17:
		data[i - 18].update(Education_att = data[i]["Education_att"])
			
for j in range(len(data)):
	if j > 18:
		data.pop()	

data.pop()
	
json.dump(data, json_file, indent = 4)

