$(function(){

    /**
    	* when an user clicks 
    */
	$(".container").on("click",".div-btn",function(e){
        var locOrigin= $(".loc-origin").val();
        var locDest= $(".loc-dest").val();
            
		$.get("/",{locOrigin:locOrigin,locDest:locDest},function(data){
           console.log("Client data",data);
		});

	});
	$(".container").on("click",".btn-messenger",function(e){
        var messengerName= $(".input-name").val();
        var dest= $(".input-dest").val();
        var origin= $(".input-origin").val();
          
		$.get("/messenger",{name:messengerName,dest:dest,origin:origin},function(data){
           console.log("Client data",data);
		});
       
	});





});