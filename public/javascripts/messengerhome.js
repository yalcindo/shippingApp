$(function(){

  function getPrice(distance){
       
      var str2 = distance.replace(/\,/g,"");
      var distance1=str2.split(" ");
      console.log("distance",distance1[0]);
      var price= 20 + (0.02 * parseInt(distance1[0]));
    return parseInt(price);
  };
// map calculations start here
  var directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  var map = new google.maps.Map(document.getElementById('map-canvas'), 
    {
      center: new google.maps.LatLng(40.0176, -105.2797),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  // ----------------Calculating Distance Between Two cities
    var origin=$("#map-canvas").data("origin");
    var destination=$("#map-canvas").data("dest");
    var  service = new google.maps.DistanceMatrixService();

  service.getDistanceMatrix(
      {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          avoidHighways: false,
          avoidTolls: false
      }, 
      getDistance
  );

  function getDistance(response, status) {
      if(status==="OK") {
           var distance = response.rows[0].elements[0].distance.text;
           console.log("distance",distance);
         $(".distance").append("<h3>Distance Between two Cities: <span class='cities'>"+ distance+"</span></h3>")
         $(".estimate").html("<h3>shipDojo suggested price : $ <span class='cities'>"+getPrice(distance)+"</span></h3>")
      } else {
          alert("Error: " + status);
      }   
  }

  directionsDisplay.setMap(map);
   var start = origin;
    // document.getElementById('start').value;
    var end =destination;
    // document.getElementById('end').value;
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });

    // Compare UPS values
    if(origin==="Boulder" && destination==="Denver")
    {
      var source2 = $("#compare-template").html();
      var compareTemplate = Handlebars.compile(source2);
      $compareResult = $('.ups-compare');
      var compareUps={
          val1:"Ups Next Day  8 am --> $74.97",
          val2:"Ups Next Day 11 am -->  $41.82",
          val3:"Ups Next day 3 pm  --> $36.91",
          val4 :"Ups Ground 1 day -->12.52"
      };
      $compareResult.html(compareTemplate({ups:compareUps}))
  }
    // 



  // --- End of Map Calculations---------------------

  $(document).on("click",".send-button",function(){
      var price=$(".input-price").val();
      var textArea=$(".text-area").val();
      $.post("/smssend",{price:price,textArea:textArea},function(data){


      });
     
      
       $(".message-send").append("<div class='message alert alert-info'>Message Sent</div>");
   
    $(".input-price").val("");
    $(".text-area").val("");
  });
  $(document).on("click",".my-location",function(){
     // window.location.href="/clienttrack"
    // var name =$(".my-location").data("name");
    // var photo =$(".my-location").data("photo");

    //   var source3 = $("#messenger-template").html();
    //   var messengerTemplate = Handlebars.compile(source3);
    //   $messengerResult = $('#mes-info');
    //   var info={name:name,photo:photo};
    //   $messengerResult.html(messengerTemplate({info:info}));
      window.location.href="/clienttrack";
  });
});