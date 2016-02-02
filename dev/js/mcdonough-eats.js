/*  The McDonoughEats function acts as the ViewModel for this application.
It also holds the model but maintains seperation of concerns using the MVVM design patter.
*/

var McDonoughEats = function ()
{
  var self = this;

  /* initialPlaces is an array of local restaurant names and phone numbers.
  it acts as the initial data model */
  var initialPlaces =
  [
    {
      name: "Kirby G's",
      tel: '6785838777',
      visible:'TRUE'
    },
    {
      name: 'Queen Bee Coffee',
      tel: '6788832233',
      visible:'TRUE'
    },

    {
      name: 'Pasta Max',
      tel: '7703209311',
      visible:'TRUE'
    },
    {
      name: 'South Side Diner',
      tel: '6787592690',
      visible:'TRUE'
    },
    {
      name: 'Gritz',
      tel: '7709140448',
      visible:'TRUE'
    },
    {
      name: "Truett's Grill",
      tel: '6784322221',
      visible:'TRUE'
    },
    {
      name: 'Deep South Deli',
      tel: '6783008999',
      visible:'TRUE'
    },
    {
      name: "Mikie's Big Burger",
      tel: '7709544306',
      visible:'TRUE'
    }
  ];
  //additional model variables
  //since this app utilizes the knockoutjs framework there are knockout observables used here
  var map;
  var workArray = ko.observableArray();
  var markerArray ;
  var yelpAttrib= ko.observable('http://www.yelp.com') ;
  var yelpImgAttrib= ko.observable('https://s3-media1.fl.yelpcdn.com/assets/srv0/developer_pages/dc8ff90d5d7d/assets/img/Powered_By_Yelp_Black.png');
  var userInput = ko.observable("");
  var lenInitialPlaces = initialPlaces.length;
  var bound = new google.maps.LatLngBounds();
  var selectedRestaurant = ko.observable("");
  var infowindow = new google.maps.InfoWindow({
    content: ''
  });
  //initiate the google map
  var initMap = (function()
    {
      //put the map in the mapbox element and center it on the target city
      map = new google.maps.Map(document.getElementById('mapBox'),
        {
          center: {lat: 33.4469617, lng: -84.1419653},
          scrollwheel: false,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.TERRAIN
        });
    }());


  // makeMarker function deletes any existing markers, and then creates a marker for each element in the workArray
  var makeMarker = function()
    {
      if (markerArray)
        {
          for (var i=0; i < markerArray.length; i++)
            {
              markerArray[i].marker.setMap(null);
            }
        }
      markerArray=[];
      var bound = new google.maps.LatLngBounds();
      markerArray=workArray.slice();

      for (var j = 0; j<markerArray.length;j++)
        {
          markerArray[j].marker = new google.maps.Marker(
            {
              position: markerArray[j].latlng,
              title: markerArray[j].name,
              map: map
            });
          bound.extend(markerArray[j].marker.getPosition());

          // click listener for markers
          setClickListener(markerArray[j].marker, markerArray[j]);
        }
      if (markerArray.length > 1)
        {
          // change the map zoom to the remaining locations
          map.fitBounds(bound);
        }
      if (markerArray.length ===1)
        {
          map.setZoom(19);
          var singleLocation = markerArray[0].marker.getPosition();
          map.setCenter(singleLocation);
        }
      zoomListener = google.maps.event.addListenerOnce(map, 'change zoom', function(event)
        {
          map.setCenter(bound.getCenter());
        });
      setTimeout(function()
        {
          google.maps.event.removeListener(zoomListener)
        }, 2000);





    };


  // on marker click pass the clicked marker to the marker activate function
  var setClickListener = function(data, name)
    {
      var dummy;
      data.addListener('click', function ()
        {
          mrkerActivate(name  , dummy);
        });
      return;
    };

    // updateWorkArray changes the work array whenever the sort changes or the data model changes
  var updateWorkArray = function()
    {
      workArray([]);
      for (var k=0;k<lenInitialPlaces;k++)
        {
          if (initialPlaces[k].visible == 'TRUE')
            {
              workArray.push(initialPlaces[k]);
            }
        }
      if (workArray().length >= 1)
        {
          if (workArray()[workArray().length-1].latitude)
            {
              makeMarker();
            }
        }
      if (workArray().length === 0)
        {
          makeMarker();
        }
    };


  // updateModel takes the data returned by the ajax request and adds the desired parts to the initialPlaces
  // array elements


  var updateModel = function(k,data)
  {

    initialPlaces[k].review_count=data.businesses[0].review_count;
    initialPlaces[k].postal_code=data.businesses[0].location.postal_code;
    initialPlaces[k].state_code=data.businesses[0].location.state_code;
    initialPlaces[k].city=data.businesses[0].location.city;
    initialPlaces[k].address=data.businesses[0].location.address;
    initialPlaces[k].snippet_text=data.businesses[0].snippet_text;
    initialPlaces[k].snippet_image_url=data.businesses[0].snippet_image_url;
    initialPlaces[k].image_url=data.businesses[0].image_url;
    initialPlaces[k].rating_img_url=data.businesses[0].rating_img_url;
    initialPlaces[k].review_count=data.businesses[0].review_count;
    initialPlaces[k].url=data.businesses[0].url;
    initialPlaces[k].latitude=data.businesses[0].location.coordinate.latitude;
    initialPlaces[k].longitude=data.businesses[0].location.coordinate.longitude;
    initialPlaces[k].latlng =
      {
        lat: initialPlaces[k].latitude,
        lng: initialPlaces[k].longitude
      };
    updateWorkArray();
  };


  var i=0;

  // The yelpInfo function contains the keys needed to utilize the OAuth authentication process for the Yelp API
  var yelpInfo = function()
    {
      var auth =
        {
          //
          // Yelp OAuth data
          //
          consumerKey: "sB9MQlZkUAFlQR5P8iRwCw",
          consumerSecret: "HQb8up0L05VUZVjMEzAAxm_XIx4",
          accessToken: "7dsLP8pY0a17kCRjPlFlSIplD4l1J77c",
          accessTokenSecret: "sL9Hj1nFYN3HvRMKI4_ph8bvQdE",
          serviceProvider:
            {
              signatureMethod: "HMAC-SHA1"
            }
        };



      var accessor =
        {
          consumerSecret: auth.consumerSecret,
          tokenSecret: auth.accessTokenSecret
        };

      //configuration of the oauth parameters array
      parameters = [];
      parameters.push(['phone', initialPlaces[i].tel]);
      parameters.push(['callback', 'cb']);
      parameters.push(['oauth_consumer_key', auth.consumerKey]);
      parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
      parameters.push(['oauth_token', auth.accessToken]);
      parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

      // configures the getter for oauth
      var message =
        {
          'action': 'http://api.yelp.com/v2/phone_search?',
          'method': 'GET',
          'parameters': parameters
        };

      //makes the authentication call
      OAuth.setTimestampAndNonce(message);
      OAuth.SignatureMethod.sign(message, accessor);
      var parameterMap = OAuth.getParameterMap(message.parameters);
      parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

      // Once authenticated makes the ajax request for the entries in the data model.
      // An ajax failure returns an alert advising the user to retry.

      var yelpRequest = $.ajax(
        {
          url: message.action,
          data: parameterMap,
          cache: true,
          dataType: 'jsonp',
          timeout: 5000
        });

      yelpRequest.error(function(xhr, statusText)
        {
          alert("Sorry, something went wrong when trying to reach Yelp.com, please try again.");
        });

      yelpRequest.success(function(data)
        {
          if ( i < lenInitialPlaces)
            {
              updateModel(i,data);
              i++;
              if (i<lenInitialPlaces)
                {
                  yelpInfo();
                }
            }
        });
    };  //closes yelpInfo

  yelpInfo();

  // sets the visible property based on searchbox state
  var makeViz = function()
    {
      // if the searchbox is empty mark all items visible
      if (userInput.toLowerCase === "")
        {
          for (var n = 0; n < lenInitialPlaces; n++)
            {
              initialPlaces[n].visible='TRUE';
            }
        }
      //if something is in the search box compare it to the names of the places
      //if there is not a  match mark initialPlaces.visible as FALSE
      //else mark "TRUE"
      var rex = new RegExp($('#searchBox').val(), "i");
        for (var p = 0; p <lenInitialPlaces; p++)
          {
            if (!rex.test(initialPlaces[p].name))
              {
                initialPlaces[p].visible ='FALSE';
              }
            else
              {
                initialPlaces[p].visible ='TRUE';
              }
          }
        // since the data model changed, update the workArray
        updateWorkArray();
    };


  // mrkerActivate clears any existing selectedRestaurant, then updates the selectedRestaurant.
  // Once set, it iterates through the markerArray and when it finds a matching marker name it bounces the marker and then stops the bounces.
  // Next, it populates the contentString used to populate the infoWindow.
  // Finally, it places that content in the infoWindow and places it on the map.
  var mrkerActivate = function(data, event)
    {
      selectedRestaurant  = null;
      var contentString;
      selectedRestaurant  = data.name;
      for (var j=0; j < markerArray.length; j++)
        {
          markerArray[j].marker.setAnimation(null);
          if (markerArray[j].name == selectedRestaurant)
            {
              var selectedMarker = markerArray[j].marker;
              selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
              stopBounce(selectedMarker);
              var currentAddress = markerArray[j].address+', '+markerArray[j].city+', '+markerArray[j].state_code+' '+markerArray[j].postal_code;
              var currentPhone = '('+markerArray[j].tel.slice(0,3)+') '+markerArray[j].tel.slice(3,6)+'-'+markerArray[j].tel.slice(6,10);
              var currentSnippetText = markerArray[j].snippet_text;
              contentString =
              '<div id="infoWindowContainer">'+
                '<h2 class="infoWindowHeader">'+selectedRestaurant+'</h2>'+
                '<div class ="row" id="imageRow">'+
                  '<div class = "col-md-2 col-sm-2 col-xs-2" id = "restPic">'+
                    '<img src='+markerArray[j].image_url+'>'+
                  '</div>'+
                  '<div class = "col-md-2 col-sm-2 col-xs-2" id = "snippetPic">'+
                    '<img class= "snippetPic" src='+markerArray[j].snippet_image_url+'>'+
                  '</div>'+
                  '<div class =  "col-lg-8 hidden-md hidden-sm hidden-xs">'+
                    '<p id="introText"> Click the telephone number to call this restaurant, or click the link below for more information:</p>'+
                    '<p class = "snippetText">'+currentSnippetText+'</p>'+
                  '</div>'+
                '</div>'+
              '<div class = "row" id ="addressRow">'+
                '<div class="col-lg-12 hidden-md hidden-sm hidden-xs">'+
                  '<p id="addressP"><b> Address: '+ currentAddress + '</b></p>'+
                '</div>'+
              '</div>'+
              '<div class = "row" id = "phoneRow">'+
                '<div class="col-md-12 col-sm-12 col-xs-12">'+
                  '<p id="phoneP"><b> Phone: '+'<a href=tel:'+ markerArray[j].tel+'>'+ currentPhone+'</a></b></p>'+
                '</div>'+
              '</div>'+
              '<img src='+markerArray[j].rating_img_url+'>'+
              markerArray[j].review_count+' reviews  '+
              '<img src='+yelpImgAttrib()+'>'+

              '<p> <a href='+markerArray[j].url+' target="_blank">Click here to visit this page on Yelp.com'+
              '</p></a>'+
              '</div>'+
              '</div>';
              //var infoWindowOptions = { max-width: 75%};

              infowindow.setContent(contentString);
              infowindow.open(map, selectedMarker);
            }
        }
      return;
    };

  // stops the map marker bounce after approx 2 bounces
  function stopBounce(marker)
    {
      setTimeout(function ()
        {
          marker.setAnimation(null);
        }, 1400);
    }


  // required by knockoutjs to initiate the viewmodel
  var init = function ()
    {
      ko.applyBindings(McDonoughEats);
    };

  //jQuery starts this file on document ready
  $(init);

  //function returns
  return{
    mrkerActivate: mrkerActivate,
    userInput: userInput,
    makeViz: makeViz,
    yelpAttrib: yelpAttrib,
    yelpImgAttrib: yelpImgAttrib,
    workArray: workArray,
    makeMarker: makeMarker,
    initMap: initMap,
    map: map,
    updateWorkArray: updateWorkArray
    };
    }();
