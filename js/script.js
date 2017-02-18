function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    /* load Google streetview */
    var street = $( "#street" ).val();
    var city = $("#city").val();
    var address = street + ", " + city;
    var key = "AIzaSyC5DTeCGA1dhDobWegR-EpbdM0PWG1O_Xc"; 
    var url_google= "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + address + "&key=" + key ; 

    $greeting.text("Address: " + address); 
    $body.append('<img class="bgimg" id="myUrl" src="' + url_google + '">');

    /* NYTimes AJAX request */
    var url_nyt = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url_nyt += '?' + $.param({
        'api-key': "72efd1a3e40a417d9e2c33fd3ed410d2",
        'sort': "newest",
        'q': address
    });

    $.getJSON( url_nyt, function( data ) {
        var articles = data.response.docs; 
        $nytHeaderElem.text("New York Times Articles About: " + address); 

        for ( var i = 0; i < articles.length; i++ ){
            //            console.log(articles[i].headline.main); 
            //            console.log(articles[i].web_url);
            //            console.log(articles[i].keywords.lead_paragraph);
            var headline = articles[i].headline.main
            var web_url = articles[i].web_url
            var snippet = articles[i].snippet; 

            $nytElem.append('<li class="article">' +
                            '<a href="' + web_url+ '">' + headline + '</a>'+
                            '<p>' + snippet + '</p>'+            
                            '</li>'); 
            //console.log(data);
        }
    }).error(function(e) { 
        $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");  
    });

    /* Wikipedia AJAX request */
    var url_wiki = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + address + "&format=json&callback=wikiCallback"; 

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("Failed to get Wikipedia resources"); 
    }, 5000); 
    
    $.ajax({
        url: url_wiki,
        type: 'GET',
        dataType: 'jsonp',
        success: function( response ) {
            //console.log(response); 
            var articleList = response[1]; 
            
            for (var i = 0; i < articleList.length; i ++) {
                var url = "https://en.wikipedia.org/wiki/" + articleList[i]; 
                $wikiElem.append('<li><a href="' + url + '">' +                                                articleList[i] + '</a></li>');   
            }; 
            
            clearTimeout(wikiRequestTimeout); 
        }
    });

    return false;
};

$('#form-container').submit(loadData);

