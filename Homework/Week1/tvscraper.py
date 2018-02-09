#!/usr/bin/env python
# Name: Enrikos Iossifidis
# Student number: 10805672
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from bs4 import SoupStrainer

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
    
    # initiliaze for each required field a list
    names = []
    rating = []
    genres = []
    actors = []
    runtime = []

    # divide the dom in a div for each serie
    raw_data = dom.find_all("div", {"class": "lister-item mode-advanced"})

    # collect serie names (method is identical to names', rating', genres', runtime' method )
    for serienames in raw_data:

        # first search the relevant class
        namesraw = serienames.find("h3", {"class": "lister-item-header"})

        # from there, pick the right <a href> for the text
        names.append(namesraw.find("a").get_text(strip=True))
                  
    for serierating in raw_data:
        ratingraw = serierating.find("div", {"class": "inline-block ratings-imdb-rating"})
        rating.append(ratingraw.find("strong").get_text(strip=True))

    for seriegenre in raw_data:

        # because there is only 1 'span' tag, only 1 step is enough to 
        # obtain the relevant genres (idem for series)
        genres.append(seriegenre.find("span", {"class": "genre"}).get_text(strip=True))

    for serieruntime in raw_data:
        runtime.append(serieruntime.find("span", {"class": "runtime"}).get_text(strip=True))

    # collect actors     
    for serieactors in raw_data:

        # first: find relevant div where actors names are located
        actorsrawraw = serieactors.find("div", {"class": "lister-item-content"})
        
        # choose the right p tag
        p = actorsrawraw.find_all("p")[2].find_all("a")
        
        # create a list for the actors of each serie and add the names to it
        seriesactors = []
        for actorsraw in p:
            seriesactors.append(actorsraw.text)
        actors.append(seriesactors)    
    
    # convert all seperate lists into one dict and return that
    series = {'Title': names, 'Rating': rating, 'Genre': genres, 'Actors': actors, 'Runtime': runtime}

    return series

def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # convert the dict back into seperate lists
    tvseriesvalues = list(tvseries.values())
    names = tvseriesvalues[0]
    rating = tvseriesvalues[1]
    genres = tvseriesvalues[2]
    actors = tvseriesvalues[3]
    runtime = tvseriesvalues[4]

    # repeat the writing for each series
    for serie in range(len(names)):

        # convert the list of actors into a string 
        # and delete the "[", "]". "'" , for esthetic purposes 
        actorsstring = str(actors[serie])
        actorsstring = actorsstring.replace("[", "")
        actorsstring = actorsstring.replace("]", "")
        actorsstring = actorsstring.replace("'", "")

        # write the relevant fields into the csv file
        writer.writerow([names[serie], rating[serie], genres[serie], actorsstring, runtime[serie]])
    

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
