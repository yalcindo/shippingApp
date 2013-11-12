$(function(){
var socket = io.connect('http://localhost');

socket.on("connect",function(){
     console.log("connected");
     
});

	function getUpdate(){
	    navigator.geolocation.getCurrentPosition(function(position){
	        var lat=position.coords.latitude;
	        var lng=position.coords.longitude;
	        console.log("lat: "+lat+ "lng:"+lng)
	        $(".message").append("<p> sending location info:"+lat+","+lng+"</p>")
	       socket.emit('sendcoords',{lat:lat,lng:lng});
	       setTimeout(getUpdate,1000);
	    }); 
	}
    getUpdate();
});