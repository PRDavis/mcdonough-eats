var mapAPILoadFailed = function(){
  alert("Sorry, something went wrong when trying to reach google.com, please try again.");
};


//This function is called after the google maps script returns.
var mapReady = function(){

  // The McDonoughEats function acts as the ViewModel for this application.
  //  It also holds the model but maintains seperation of concerns using the MVVM design pattern.


  var McDonoughEats = function (){

    // The array allPlaces is the observableArray that holds all of the place objects.
    allPlaces=ko.observableArray();

    // This is the place constructor.
    function Place(tel,data){
      this.tel=tel;
      this.visible= ko.observable(true);
      this.name= data.businesses[0].name;
      this.review_count= data.businesses[0].review_count;
      this.postal_code=data.businesses[0].location.postal_code;
      this.state_code=data.businesses[0].location.state_code;
      this.city=data.businesses[0].location.city;
      this.address=data.businesses[0].location.address;
      this.snippet_text=data.businesses[0].snippet_text;
      this.snippet_image_url=data.businesses[0].snippet_image_url;
      this.image_url=data.businesses[0].image_url;
      this.rating_img_url=data.businesses[0].rating_img_url;
      this.review_count=data.businesses[0].review_count;
      this.url=data.businesses[0].url;
      this.latitude=data.businesses[0].location.coordinate.latitude;
      this.makeViz = makeViz;
      this.currentlySelected = ko.observable(false);
      this.marker={};
      this.markerBounce=markerBounce;
      this.stopBounce = stopBounce;
      this.setMarker = setMarker;
      this.makeMarker = makeMarker;
      this.clearMarker = clearMarker;
      this.longitude=data.businesses[0].location.coordinate.longitude;
      this.latlng ={
        lat: this.latitude,
        lng: this.longitude
      };
      this.contentString = '<div id="infoWindowContainer">'+
      '<h2 class="infoWindowHeader">'+this.name+'</h2>'+
      '<div class ="row" id="imageRow">'+
      '<div class = "col-md-2 col-sm-2 col-xs-5" id = "restPic">'+
      '<img src='+this.image_url+'>'+
      '</div>'+
      '<div class = "col-md-2 col-sm-2 col-xs-5" id = "snippetPic">'+
      '<img class= "snippetPic" src='+this.snippet_image_url+'>'+
      '</div>'+
      '<div class =  "col-lg-8 hidden-md hidden-sm hidden-xs">'+
      '<p id="introText"> Click the telephone number to call this restaurant, or click the link below for more information:</p>'+
      '<p class = "snippetText">'+this.snippet_text+'</p>'+
      '</div>'+

      '</div>'+
      '<div class = "row" id ="addressRow">'+
      '<div class="col-lg-12 hidden-md hidden-sm hidden-xs">'+
      '<p id="addressP"><b> Address: '+ this.address+', '+this.city+', '+this.state_code+' '+this.postal_code + '</b></p>'+
      '</div>'+
      '</div>'+
      '<div class = "row" id = "phoneRow">'+
      '<div class="col-md-12 col-sm-12 col-xs-12">'+
      '<span id="phoneP"><b> Phone: '+'<a href=tel:'+ this.tel+'>'+ '('+this.tel.slice(0,3)+') '+this.tel.slice(3,6)+'-'+this.tel.slice(6,10)+'</a></b></span>'+
      '</div>'+
      '</div>'+
      '<img src='+this.rating_img_url+'>'+
      this.review_count+' reviews  '+
      '<img id='+'"infoWinYelpImg"' + 'src='+yelpImgAttrib()+'>'+

      '<p> <a href='+this.url+' target="_blank">Click here to visit this page on Yelp.com'+
      '</p></a>'+
      '</div>'+
      '</div>';
      return;
    }


    //  The initialPlaces array holds local restaurant phone numbers.
    //  It acts as the initial data model.

    var initialPlaces = [

      {tel: '7709544306'}, //name: "Mikie's Big Burger"
      {tel: '6785838777'}, //name: "Kirby G's"
      {tel: '6787592690'}, //name: 'South Side Diner'
      {tel: '7703209311'}, //name: 'Pasta Max'
      {tel: '7709140448'}, //name: 'Gritz'
      {tel: '6784322221'}, //name: "Truett's Grill",
      {tel: '6788832233'}  //name: 'Queen Bee Coffee'
    ];


    // Model variables:
    var map,
    yelpAttrib= ko.observable('http://www.yelp.com'),
    yelpImgAttrib= ko.observable('https://s3-media2.fl.yelpcdn.com/assets/srv0/developer_pages/9bfe343c35cc/assets/img/yelp_powered_btn_light@2x.png'),
    userInput = ko.observable(""),
    lenInitialPlaces = initialPlaces.length,
    bound = new google.maps.LatLngBounds(),
    selectedRestaurant = ko.observable(""),
    infowindow = new google.maps.InfoWindow({
      content: ''
    });


    //Initiate the google map.
    var initMap = (function(){
      //Put the map in the mapbox element and center it on the target city.
      map = new google.maps.Map(document.getElementById('mapBox'),{
        center: {lat: 33.4469617, lng: -84.1419653},
        scrollwheel: false,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.TERRAIN
      });
    }());

    window.onresize = function() {
      map.fitBounds(bound);
    };
    //Add marker click listener.

    var addMarkerListener = function(data){
      google.maps.event.addListener(data.marker, 'click', function(event){
        markerClicked(data.name);
      });
    };

    //Instantiate markers.
    var makeMarker = function(){
      this.marker = new google.maps.Marker({
        position: this.latlng,
        title: this.name,
        map: map,
        icon: 'http://maps.google.com/mapfiles/kml/pal2/icon36.png',
        size: new google.maps.Size(120, 32)
      });
      return;
    };
    // Populates the markerArray and makes map boundries from the current marker set.
    var setBounds = function(){
      markerArray=[];
      bound = new google.maps.LatLngBounds();

      var populateMarkerArray=function(){
        for (var counter3 = 0; counter3<allPlaces().length;counter3++){
          if(allPlaces()[counter3].visible() === true){
            markerArray.push(allPlaces()[counter3]);
          }
        }
        for (var counter6 = 0; counter6 < markerArray.length; counter6++){
          bound.extend(markerArray[counter6].marker.getPosition());
        }
      };

      populateMarkerArray();
      if (markerArray.length > 1){
        // Change the map zoom to the remaining locations.
        map.fitBounds(bound);
      }
      if (markerArray.length === 1){
        map.setZoom(19);
        var singleLocation = markerArray[0].marker.getPosition();
        map.setCenter(singleLocation);
      }
      zoomListener = google.maps.event.addListenerOnce(map, 'change zoom', function(event){
        map.setCenter(bound.getCenter());
      });
      setTimeout(function(){
        google.maps.event.removeListener(zoomListener);
      }, 2000);

      // Add a click listener for each marker.
      for(var counter4 = 0; counter4 < markerArray.length; counter4++){
        addMarkerListener(markerArray[counter4]);
      }
    };

    // Remove !visible markers from map.
    var clearMarker = function(){
      if(this.visible() === false ){
        this.marker.setMap(null);
      }
    };
    // Place visible markers on map.
    var setMarker = function(){
      if(this.visible() === true ){
        this.marker.setMap(map);
      }
    };






    // Function updateModel instantiates the place objects with the data returned from the ajax request to the yelp api and places them in the allPlaces array.
    var updateModel = function(tel,data){
      allPlaces.push(new Place(tel,data));
      // Done? Make the markers.
      if(allPlaces().length==initialPlaces.length){
        markerInit();
      }
    };


    var i=0;

    // The yelpInfo function uses the keys needed to utilize the OAuth authentication process for the Yelp API - the keys are in the data.js file.
    var yelpInfo = function(){

      //Configure the oauth parameters array.
      parameters = [];
      parameters.push(['phone', initialPlaces[i].tel]);
      parameters.push(['callback', 'cb']);
      parameters.push(['oauth_consumer_key', auth.consumerKey]);
      parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
      parameters.push(['oauth_token', auth.accessToken]);
      parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

      // Configure the getter for oauth.
      var message = {
        'action': 'http://api.yelp.com/v2/phone_search?',
        'method': 'GET',
        'parameters': parameters
      };

      //Make the authentication call.
      OAuth.setTimestampAndNonce(message);
      OAuth.SignatureMethod.sign(message, accessor);
      var parameterMap = OAuth.getParameterMap(message.parameters);
      parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

      // Once authenticated, make the ajax requests for the entries in the data model.
      // An ajax failure returns an alert advising the user to retry.

      var yelpTimer = setTimeout(function(){
        alert("Sorry, something went wrong when trying to reach Yelp.com, please try again.");
      },8000);


      var yelpRequest = $.ajax({
        url: message.action,
        data: parameterMap,
        cache: true,
        dataType: 'jsonp',
        timeout: 5000
      });

      yelpRequest.fail(function(xhr, statusText){
        alert("Sorry, something went wrong when trying to reach Yelp.com, please try again.");
      });

      yelpRequest.done(function(data){
        if ( i < lenInitialPlaces){
          updateModel(parameters[0][1],data);
          i++;
          if (i<lenInitialPlaces){
            yelpInfo();
          }
        }
        clearTimeout(yelpTimer);
      });

      // clear timeout
    };  //End of yelpInfo.

    yelpInfo();


    var markerInit = function(){
      for (var counter=0;counter < allPlaces().length; counter++){
        allPlaces()[counter].makeMarker();
      }
      setBounds();
      return;
    };

    //A list item was clicked. Pass the object name to markerClicked.
    var placeClicked = function(){
      markerClicked(this.name);
    };


    //Match the clicked item to the marker, then bounce the marker and show the infowindow.
    var markerClicked = function(data, event){
      selectedRestaurant  = null;
      //This is the name of the restaurant for the clicked marker.
      selectedRestaurant  = data;
      //Match the marker to the correct object
      for (var j=0; j < allPlaces().length; j++){
        if (allPlaces()[j].name == selectedRestaurant){
          //Bounce the marker.
          allPlaces()[j].markerBounce();
          //Stop the marker bounce.
          allPlaces()[j].stopBounce(allPlaces()[j]);
          //Populate and display the infowindow.
          infowindow.setContent(allPlaces()[j].contentString);
          infowindow.open(map, allPlaces()[j].marker);
          //Set the map boundaries on infowindow close.
          google.maps.event.addListener(infowindow, 'closeclick', function () {
            map.fitBounds(bound);
          });
        }
      }

      return;
    };

    var checkViz = function(){
      for (var counter1=0;counter1<allPlaces().length;counter1++){
        allPlaces()[counter1].makeViz();
        allPlaces()[counter1].clearMarker();
        allPlaces()[counter1].setMarker();
      }
      setBounds();
    };

    // Sets the visible property based on searchbox state.
    var makeViz = function(){
      // If the searchbox is empty, mark all items visible.
      if (userInput() === ''){
        this.visible(true);
      }


      //If something is in the search box, compare it to the names of the places.
      //If there is not a match, mark visible as false,
      //else mark true.


      var rex = new RegExp(userInput(), "i");
      if (!rex.test(this.name)){
        this.visible(false);
      }
      else{
        this.visible(true);
      }
    };

    var markerBounce = function(){
      this.marker.setAnimation(google.maps.Animation.BOUNCE);

    };
    //
    var stopBounce= function (elem){
      setTimeout(function (){elem.marker.setAnimation(null);  }, 1400);
    };




    //Function returns:
    return{
      userInput: userInput,
      makeViz: makeViz,
      yelpAttrib: yelpAttrib,
      yelpImgAttrib: yelpImgAttrib,
      makeMarker: makeMarker,
      initMap: initMap,
      addMarkerListener:addMarkerListener,
      map: map,
      placeClicked: placeClicked,
      markerInit: markerInit,
      checkViz: checkViz,
      updateModel: allPlaces()
    };
  };
  ko.applyBindings(new McDonoughEats());
};
