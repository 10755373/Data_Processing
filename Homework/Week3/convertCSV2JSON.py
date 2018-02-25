# Enrikos Iossifidis

import csv
import json

# open csv en json file
csv_file = open("KNMI_20151231_maandelijks.csv", 'r')
json_file = open("convertCSV2JSON.json", 'w')

# read and write csv file in json file
data = []
csv_reader = csv.reader(csv_file)
for row in csv_reader:
	if row[0][0] is not "#" and len(row) > 1:
		data.append({"date": row[1], "temp": row[2]})

json.dump(data, json_file, indent = 4)


