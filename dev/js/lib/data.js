var auth = {
  //
  // Yelp OAuth data
  //
  consumerKey: "sB9MQlZkUAFlQR5P8iRwCw",
  consumerSecret: "HQb8up0L05VUZVjMEzAAxm_XIx4",
  accessToken: "7dsLP8pY0a17kCRjPlFlSIplD4l1J77c",
  accessTokenSecret: "sL9Hj1nFYN3HvRMKI4_ph8bvQdE",
  serviceProvider:{
    signatureMethod: "HMAC-SHA1"
  }
};

var accessor = {
  consumerSecret: auth.consumerSecret,
  tokenSecret: auth.accessTokenSecret
};
