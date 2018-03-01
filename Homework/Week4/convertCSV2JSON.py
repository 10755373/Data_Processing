import csv
import json

csv_file = open("data_line.csv", 'r')
json_file = open("convertCSV2JSON.json", 'w')

data = []
counter = 0
csv_reader = csv.reader(csv_file)
for row in csv_reader:
	if counter > 5:
		print(row)
		data.append({"Country": row[1], "Region": row[2], "Life": row[3], "HPI": row[8], "Wellbeing": row[4]})
	counter = counter + 1

json.dump(data, json_file, indent = 4)

# jsonfile.write(json_output)
# row[0][1:].split(";", 2)[1] is not ";;;;" and
