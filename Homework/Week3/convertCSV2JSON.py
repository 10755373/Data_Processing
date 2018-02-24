import csv
import json

csv_file = open("KNMI_20151231_maandelijks.csv", 'r')
json_file = open("convertCSV2JSON.json", 'w')
print(csv_file)

data = []
csv_reader = csv.reader(csv_file)
for row in csv_reader:
	if row[0][0] is not "#" and len(row) > 1:
		data.append({"date": row[1], "temp": row[2]})

json.dump(data, json_file, indent = 4)

# jsonfile.write(json_output)

