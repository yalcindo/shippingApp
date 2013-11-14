$(function(){

    $(".container").on("click",".div-btn",function(e){
        window.location.href= "/results";
        var locOrigin= $(".loc-origin").val();
        var locDest= $(".loc-dest").val();
            
		$.get("/searchresult",{locOrigin:locOrigin,locDest:locDest},function(data){
            console.log("Client data",data);
            var source = $("#searchresult-template").html();
            var searchResultTemplate = Handlebars.compile(source);
            $searchResult = $('#search-results')
            $searchResult.html(searchResultTemplate({data:data}));
            if(data[0]["dest"][0]==="Denver" && data[0]["origin"][0]==="Boulder")
            {
                var source2 = $("#compare-template").html();
                var compareTemplate = Handlebars.compile(source2);
                $compareResult = $('#compare-div');
                var compareUps={
                    val1:"Ups Next Day  8 am --> $74.97",
                    val2:"Ups Next Day 11 am -->  $41.82",
                    val3:"Ups Next day 3 pm  --> $36.91",
                    val4 :"Ups Ground 1 day -->12.52"
                };
                $compareResult.html(compareTemplate({ups:compareUps}))
            }

		});
	});
});