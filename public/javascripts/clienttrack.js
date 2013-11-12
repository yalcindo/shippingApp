$(function(){
var socket = io.connect();

  socket.on("connect",function(){
     console.log("connected nto client");
     
    });

 var map = new google.maps.Map(document.getElementById('map-canvas'), 
  {
    center: new google.maps.LatLng(40.0176, -105.2797),
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
   
   var marker = null;
  socket.on("loadcoords",function(data){

    console.log("data in loadcoords",data)
      var image="javascripts/shipping2.png";
      var newPoint = new google.maps.LatLng(data.lat,data.lng);
      console.log("new point:",newPoint)
      if (marker) {
        // Marker already created - Move it
        marker.setPosition(newPoint);
      }
      else {
        // Marker does not exist - Create it
        marker = new google.maps.Marker({
        position: newPoint,
        map: map,
        icon:image
        });
      }

      // Center the map on the new position
      map.setCenter(newPoint);
   

    // ========Future test below==
      // navigator.geolocation.watchPosition(autoUpdate);
  
  });

});