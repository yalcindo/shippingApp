
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var twilio = require('twilio');

var socketio = require('socket.io')
var passport= require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var app = express();
var mongoose = require('mongoose');
var Messenger = require('./models/messenger.js').Messenger;
var User = require('./models/login.js').User;
// all environments
app.set('port', process.env.PORT || 3006);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: '12345' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


//Create the server
var server = http.createServer(app)
//Start the web socket server
var io = socketio.listen(server);

//--------------------------------DataBase Start here

  MongoURI = (_ref = process.env.MONGOLAB_URI) != null ? _ref : 'mongodb://localhost/shippingData';

  mongoose.connect(MongoURI);



// mongoose.connect('mongodb://localhost/shippingData');

//  Messenger.find({},function(err,data){
//   console.log("total data",data);
// });

 // Messenger.remove({},function(err,data){

 // });
//-----------------------------------Data ends in here------------------
// development only

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var isAuthenticated = function(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/');
    }
};
passport.use(new FacebookStrategy({
    clientID: '752682668094444',
    clientSecret: 'a0bd660dcf0b72ac4760ffd54adf4803',
    callbackURL: "http://www.yalcindo.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
     console.log('profile', profile);
    User.findOne({ facebookId: profile.id }, function(err, user) {
        if(err) { return done(err); }

        // if the user exists
        if(User) { 
            done(null, user);
        }
        // otherwise create a new user
        else {
            var user = new User({
                facebookId: profile.id,
                name: profile.displayName
            });
            user.save(function(err) {
                if(err) { return done(err); }
                done(null, user);
            });
        }
    })
  }
));
passport.serializeUser(function(User, done) {
  done(null, User.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
    done(err, User);
  });
});

 // app.get('/', routes.index);
// app.get('/users', user.list);
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/',session:true,
                                      failureRedirect: '/' }));
app.get('/', function(req, res) {
  res.render('index', { isAuthenticated: req.isAuthenticated() });
});
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/user', isAuthenticated, function(req, res) {
  User.findById(req.session.passport.user, function(err, user) {
    if(err) { 
      console.log(err); 
      res.send(500, 'Error finding logged in user: ' + req.session.passport.user)
    }
    else {
      console.log("user",user);
      res.render('user', { 
        user: user
      });
    }
  })
   
});

 // app.get('/', routes.index);


 // @TODO later render with Routes
app.get("/messengerregister",function(req,res){
  res.render("mesregister");
});
app.get("/header",function(req,res){
  res.render("header");
});
/**
 @ 


*/

app.get("/searchresult",function(req,res){
  Messenger.find({origin:req.query.locOrigin,dest:req.query.locDest},function(err,data){
    res.send(data);
  });
});

app.get("/mesregister",function(req,res){
  var messengerInfo = req.query;
  var messenger = new Messenger({
		name:messengerInfo.name,
		origin:messengerInfo.origin,
		dest:messengerInfo.dest,
    photo:messengerInfo.photo,
    price:messengerInfo.price
	}); 

	messenger.save();
	res.send(messengerInfo);
});

// twilio account
var client = new twilio.RestClient('ACd4ad7b1d116e503101ae10746ba8d11a', '6c4f274ecf41373c603e857e2cc45def');
app.post("/smssend",function(req,res){
  
  console.log("area",req.body);
  client.sms.messages.create({
      to:'+12026153077',
      from:'+14109211887',
      body:"package: "+req.body.textArea +" price: "+req.body.price
      }, 
      function(error, message) {

      if (!error) {
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
         
        console.log('Message sent on:');
        console.log(message.dateCreated);
      }
      else {
        console.log('Oops! There was an error.');
      }
  });
});

// socket.io Messenger Track
io.sockets.on('connection', function (socketObj) {
  socketObj.on("sendcoords",function (data){
   
    // socketObj.broadcast.emit("loadcoords",data);
    io.sockets.emit("loadcoords",data);
  });
});
app.get("/messengertrack",function(req,res){
 res.render("messengertrack");
});

app.get("/clienttrack",function(req,res){
  var data=req.query;
  res.render("clienttrack",data);
});
app.get('/:id', function(req, res) {
  var messengerId = req.params.id;
  Messenger.findOne({_id:messengerId},function(err,data){

     console.log("error",err);
    if(err){
       res.status(404).send();
    }else{
      res.render("messengerInfo",data);
    }
  });
});
// configuration for Heroku
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

// Listen server

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });
