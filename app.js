
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
var mongoose = require('mongoose');
var Messenger = require('./models/messenger.js').Messenger;
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//--------------------------------DataBase Start here

mongoose.connect('mongodb://localhost/shippingData');

 Messenger.find({},function(err,data){
  console.log("databaseData: ",data);
});

 // Messenger.remove({},function(err,data){

 // });
//-----------------------------------Data ends in here------------------
// development only

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

 app.get('/', routes.index);
 // later render with Routes
app.get("/messenger",function(req,res){
  res.render("messenger");
});

app.get("/searchresult",function(req,res){
   Messenger.find({origin:req.query.locOrigin,dest:req.query.locDest},function(err,data){
      console.log("database narrow: ",data);
      res.send(data);
  });

});

app.get("/messengerinfo",function(req,res){
	var messengerInfo = req.query;
  var messenger = new Messenger({
		name:messengerInfo.name,
		origin:messengerInfo.origin,
		dest:messengerInfo.dest,
    photo:messengerInfo.photo
	}); 
	messenger.save();
	res.send(messengerInfo);
});
app.get('/:id', function(req, res) {
  var messengerId = req.params.id;
  console.log("id",messengerId);
   Messenger.findOne({_id:messengerId},function(err,data){
      console.log("database narrow: ",data);
      res.render("messengerInfo",data);
  });

 
});





http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
