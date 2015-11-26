/*  The McDonoughEats function acts as the ViewModel for this application.
It also holds the model but maintains seperation of concerns using the MVVM design patter.
*/

var McDonoughEats = function ()
{

  /* initialPlaces is an array of local restaurant names and phone numbers. */
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
      name: 'Seasons Bistro',
      tel: '6788144995',
      visible:'TRUE'
    },
    {
      name: "Truett's Grill",
      tel: '6784322221',
      visible:'TRUE'
    },
    {
      name: 'Deep South Deli',
      tel: '7703208999',
      visible:'TRUE'
    },
    {
      name: "Mikie's Big Burger",
      tel: '7709544306',
      visible:'TRUE'
    }
  ];
  //model variables
  var map;
  var workArray = ko.observableArray();
  var markerArray ;
  var yelpAttrib= ko.observable('http://www.yelp.com') ;
  var yelpImgAttrib= ko.observable('https://s3-media1.fl.yelpcdn.com/assets/srv0/developer_pages/dc8ff90d5d7d/assets/img/Powered_By_Yelp_Black.png');
  var userInput = ko.observable("");
  var lenInitialPlaces = initialPlaces.length;
  var bound = new google.maps.LatLngBounds();

  var initMap = (function()
  {

    map = new google.maps.Map(document.getElementById('mapBox'),
    {
      center: {lat: 33.4469617, lng: -84.1419653},
      scrollwheel: false,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });
  }());



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
            map: map
          });
        bound.extend(markerArray[j].marker.getPosition());
      }
      if (markerArray.length > 1)
        {
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







  var updateModel = function(k,data)
  {
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

  ////////////////////////////////
  var i=0;


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


    parameters = [];
    parameters.push(['phone', initialPlaces[i].tel]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);


    var message =
    {

      'action': 'http://api.yelp.com/v2/phone_search?',
      'method': 'GET',
      'parameters': parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);


    $.ajax(
      {
        url: message.action,
        data: parameterMap,
        cache: true,
        dataType: 'jsonp',
        success: function(data)
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
        }
      });

    };  //closes yelpInfo
    yelpInfo();


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
      updateWorkArray();
    };



    var init = function () {
      /* add code to initialize this module */
      ko.applyBindings(McDonoughEats);
    };

    $(init);

    return{

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
