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
      name: 'Deep South Deli',
      tel: '6783008999',
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
      name: "Mikie's Big Burger",
      tel: '7709544306',
      visible:'TRUE'
    }
  ];


  var workArray = ko.observableArray([]);
  var yelpAttrib= ko.observable('http://www.yelp.com') ;
  var yelpImgAttrib= ko.observable('https://s3-media1.fl.yelpcdn.com/assets/srv0/developer_pages/dc8ff90d5d7d/assets/img/Powered_By_Yelp_Black.png');
  var userInput = ko.observable("");




  // custom binding for the google map
  ko.bindingHandlers.mapBox =
  {
    init: function(element, valueAccessor)
    {
      map = new google.maps.Map(document.getElementById('mapBox'),
      {
        center: {lat: 33.4469617, lng: -84.1419653},
        scrollwheel: false,
        zoom: 13
      });
    }
  };








  var makeViz = function()
  {
    console.log('inside the makeViz function');
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
    workArray: workArray

  };
}();
