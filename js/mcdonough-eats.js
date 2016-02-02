var McDonoughEats=function(){function e(e){setTimeout(function(){e.setAnimation(null)},1400)}var t,s,i=[{name:"Kirby G's",tel:"6785838777",visible:"TRUE"},{name:"Queen Bee Coffee",tel:"6788832233",visible:"TRUE"},{name:"Pasta Max",tel:"7703209311",visible:"TRUE"},{name:"South Side Diner",tel:"6787592690",visible:"TRUE"},{name:"Gritz",tel:"7709140448",visible:"TRUE"},{name:"Truett's Grill",tel:"6784322221",visible:"TRUE"},{name:"Deep South Deli",tel:"6783008999",visible:"TRUE"},{name:"Mikie's Big Burger",tel:"7709544306",visible:"TRUE"}],n=ko.observableArray(),o=ko.observable("http://www.yelp.com"),a=ko.observable("https://s3-media1.fl.yelpcdn.com/assets/srv0/developer_pages/dc8ff90d5d7d/assets/img/Powered_By_Yelp_Black.png"),r=ko.observable(""),l=i.length,c=(new google.maps.LatLngBounds,ko.observable("")),u=new google.maps.InfoWindow({content:""}),m=function(){t=new google.maps.Map(document.getElementById("mapBox"),{center:{lat:33.4469617,lng:-84.1419653},scrollwheel:!1,zoom:13,mapTypeId:google.maps.MapTypeId.TERRAIN})}(),d=function(){if(s)for(var e=0;e<s.length;e++)s[e].marker.setMap(null);s=[];var i=new google.maps.LatLngBounds;s=n.slice();for(var o=0;o<s.length;o++)s[o].marker=new google.maps.Marker({position:s[o].latlng,title:s[o].name,map:t}),i.extend(s[o].marker.getPosition()),p(s[o].marker,s[o]);if(s.length>1&&t.fitBounds(i),1===s.length){t.setZoom(19);var a=s[0].marker.getPosition();t.setCenter(a)}zoomListener=google.maps.event.addListenerOnce(t,"change zoom",function(e){t.setCenter(i.getCenter())}),setTimeout(function(){google.maps.event.removeListener(zoomListener)},2e3)},p=function(e,t){var s;e.addListener("click",function(){f(t,s)})},g=function(){n([]);for(var e=0;l>e;e++)"TRUE"==i[e].visible&&n.push(i[e]);n().length>=1&&n()[n().length-1].latitude&&d(),0===n().length&&d()},v=function(e,t){i[e].review_count=t.businesses[0].review_count,i[e].postal_code=t.businesses[0].location.postal_code,i[e].state_code=t.businesses[0].location.state_code,i[e].city=t.businesses[0].location.city,i[e].address=t.businesses[0].location.address,i[e].snippet_text=t.businesses[0].snippet_text,i[e].snippet_image_url=t.businesses[0].snippet_image_url,i[e].image_url=t.businesses[0].image_url,i[e].rating_img_url=t.businesses[0].rating_img_url,i[e].review_count=t.businesses[0].review_count,i[e].url=t.businesses[0].url,i[e].latitude=t.businesses[0].location.coordinate.latitude,i[e].longitude=t.businesses[0].location.coordinate.longitude,i[e].latlng={lat:i[e].latitude,lng:i[e].longitude},g()},h=0,b=function(){var e={consumerKey:"sB9MQlZkUAFlQR5P8iRwCw",consumerSecret:"HQb8up0L05VUZVjMEzAAxm_XIx4",accessToken:"7dsLP8pY0a17kCRjPlFlSIplD4l1J77c",accessTokenSecret:"sL9Hj1nFYN3HvRMKI4_ph8bvQdE",serviceProvider:{signatureMethod:"HMAC-SHA1"}},t={consumerSecret:e.consumerSecret,tokenSecret:e.accessTokenSecret};parameters=[],parameters.push(["phone",i[h].tel]),parameters.push(["callback","cb"]),parameters.push(["oauth_consumer_key",e.consumerKey]),parameters.push(["oauth_consumer_secret",e.consumerSecret]),parameters.push(["oauth_token",e.accessToken]),parameters.push(["oauth_signature_method","HMAC-SHA1"]);var s={action:"http://api.yelp.com/v2/phone_search?",method:"GET",parameters:parameters};OAuth.setTimestampAndNonce(s),OAuth.SignatureMethod.sign(s,t);var n=OAuth.getParameterMap(s.parameters);n.oauth_signature=OAuth.percentEncode(n.oauth_signature);var o=$.ajax({url:s.action,data:n,cache:!0,dataType:"jsonp",timeout:5e3});o.error(function(e,t){}),o.success(function(e){l>h&&(v(h,e),h++,l>h&&b())})};b();var _=function(){if(""===r.toLowerCase)for(var e=0;l>e;e++)i[e].visible="TRUE";for(var t=new RegExp($("#searchBox").val(),"i"),s=0;l>s;s++)t.test(i[s].name)?i[s].visible="TRUE":i[s].visible="FALSE";g()},f=function(i,n){c=null;var o;c=i.name;for(var r=0;r<s.length;r++)if(s[r].marker.setAnimation(null),s[r].name==c){var l=s[r].marker;l.setAnimation(google.maps.Animation.BOUNCE),e(l);var m=s[r].address+", "+s[r].city+", "+s[r].state_code+" "+s[r].postal_code,d="("+s[r].tel.slice(0,3)+") "+s[r].tel.slice(3,6)+"-"+s[r].tel.slice(6,10),p=s[r].snippet_text;o='<div id="infoWindowContainer"><h2 class="infoWindowHeader">'+c+'</h2><div class ="row" id="imageRow"><div class = "col-md-2 col-sm-2 col-xs-2" id = "restPic"><img src='+s[r].image_url+'></div><div class = "col-md-2 col-sm-2 col-xs-2" id = "snippetPic"><img class= "snippetPic" src='+s[r].snippet_image_url+'></div><div class =  "col-md-8 col-sm-8 hidden-tablet hidden-phone"><p id="introText"> Click the telephone number to call this restaurant, or click the link below for more information:</p><p class = "snippetText">'+p+'</p></div></div><div class = "row" id ="addressRow"><div class="col-md-12 col-sm-12 hidden-tablet hidden-phone"><p id="addressP"><b> Address: '+m+'</b></p></div></div><div class = "row" id = "phoneRow"><div class="col-md-12 col-sm-12 col-xs-12"><p id="phoneP"><b> Phone: <a href=tel:'+s[r].tel+">"+d+"</a></b></p></div></div><img src="+s[r].rating_img_url+">"+s[r].review_count+" reviews  <img src="+a()+"><p> <a href="+s[r].url+' target="_blank">Click here to visit this page on Yelp.com</p></a></div></div>',u.setContent(o),u.open(t,l)}},k=function(){ko.applyBindings(McDonoughEats)};return $(k),{mrkerActivate:f,userInput:r,makeViz:_,yelpAttrib:o,yelpImgAttrib:a,workArray:n,makeMarker:d,initMap:m,map:t,updateWorkArray:g}}();