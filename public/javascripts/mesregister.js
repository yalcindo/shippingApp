$(function(){
     console.log("date",$( ".input-date" ).datepicker())
    $(".container").on("click",".btn-messenger",function(e){
        var messengerName= $(".input-name").val();
        $(".input-name").val("");
        var dest= $(".input-dest").val();
        $(".input-dest").val("");
        var origin= $(".input-origin").val();
        $(".input-origin").val("");
        var photo=$(".input-photo").val();
        $(".input-photo").val("");
         var price=$(".input-price").val();
        $(".input-price").val("");
        
		$.get("/mesregister",{name:messengerName,dest:dest,origin:origin,photo:photo,price:price},function(data){
           console.log("Client data",data);
		});     
	});
    $(document).on("click",".btn-homepage",function(){
        window.location.href="/";
    });
});