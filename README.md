# mcdonough-eats
McDonough Eats Version 1.02 04/10/2016

General information:
-------------------------

McDonough Eats is an application that produces a neighborhood Map of
Restaurants in my home town of McDonough, GA.

```To run the application, open the index.html file in your browser.```

The application begins with a data model of phone numbers for a few
restaurants. Using OAuth, it authenticates against the Yelp.com API. Then using
ajax it queries Yelp, and for each restaurant receives a JSON reply that
includes location coordinates, URLs, review snippets, images, customer ratings,
and location address.
Selected parts of this JSON data are added to the data model.
Also, a Google Map is loaded via the Google Maps API and centered initially
in the center of the city.
Using the coordinates returned from Yelp, map markers are added to the map for
each location.
The map changes the zoom factor of the displayed map to include all of the
map markers.  
The user is able to filter locations using the search box on the page. The
search string that is entered is compared to the location array and filtered
to include only those locations which have that string as part of the name
property. This updates the displayed list, the map markers, and causes the
map to adjust to be bound by the new markers.

Clicking on either the restaurant name in the list or on the map marker will
animate the marker and open an infoWindow on the map.
The infoWindow is populated with styled data, images and a review snippet
from the updated data model. Also the location address and phone number are
displayed.
Note in small and extra-small viewports, some elements are hidden for
better responsive design and user experience.
Clicking the phone number will initiate a phone call on enabled
devices.

A rating image is displayed in the infoWindow and there is a link to the
Yelp.com page for this location.

------------------------
Contact information:

Paul Davis
paulandcindy@gmail.com

Copyright 2015-2016 Paul Davis
------------------------
#Gulp
A gulp build file is included in this package.
The files are arranged in 3 main categories:
- Main folder contains support files for gulp including gulpfile.js and
package.json.
- /dev folder includes the human readable development files
- /dist folder contains minified, optimized code

----------------------

##Gulp build instructions:

In order to use gulp.js to build these files, you will need to have nodeJS
and gulpJS installed. Also you must set the the NodeJS environment variable.

This can be done on a Mac in the terminal using the following command:

`export NODE_ENV=production`

This will output a production build with minified code in the /dist folder.

You can also set it to build a development build by using this command:

`export NODE_ENV=development`

This will output un-minified code for javascript, html and css.

To check the node environment variable, you can use this command:

`echo $NODE_ENV`

After setting the environment variable as described above, you can run the
gulp default task by simply typing:  

`gulp`

in the terminal to build the application.

If you are making changes, you can type

`gulp clean`

to remove the contents of the /dev folder fist, and then run the default task.

Note: This gulpfile has a watch function. Updates to some /dist files are made
upon saving the file. When you run gulp it will continue to run until you stop
it manually. Wait until you see Finished 'default' in the build output,
and then stop gulp by using Ctrl-C key combination.

##Documentation
Please load the mcdonough-eats.html file in the /docs folder into your browsers
to see the javascript code documentation.  
