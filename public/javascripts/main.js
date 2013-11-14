$(function(){

    /**
    	* when an user clicks 
    */
    var originTags=["Boulder","Boston","Boonsboro"];
    
    $( ".loc-origin" ).autocomplete({
        source: originTags
    });

	$(".container").on("click",".div-btn",function(e){ 
        var locOrigin= $(".loc-origin").val();
        var locDest= $(".loc-dest").val();
        // var pickDate=$("#datepicker").val();
        $(".info-box-div").hide();

		$.get("/searchresult",{locOrigin:locOrigin,locDest:locDest},function(data){

            var source = $("#searchresult-template").html();
            var searchResultTemplate = Handlebars.compile(source);
            $searchResult = $('#search-results')
            $searchResult.html(searchResultTemplate({data:data}));
		});
	});

    $(document).on("click",".reg-mes-btn",function(){
        window.location.href= "/messengerregister";
    });
    $("#search-results").on("mouseover",".result-div",function(){
        $(this).find(".ship-btn").removeClass("hidden");
    });
     $("#search-results").on("mouseout",".result-div",function(){
        $(this).find(".ship-btn").addClass("hidden");
    });
    $("#search-results").on("click",".ship-btn",function(){
        var messengerId=$(this).parents(".result-div").data("id");
        window.location.href= "/" + messengerId;
    });
    // 
    $( "#datepicker" ).datepicker();


});