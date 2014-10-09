var public_spreadsheet_url = "https://docs.google.com/spreadsheet/pub?key=0AiK02J6OppqxdFhkVl9ONHJTZHZSVjBEamZRdzJFMkE&output=html";

//make table cells with laws
var makeSlide = function(data) {

    //write a Dust.js template for data table
    var featuredSlide = '{#allEntities}\
                        <div id="entityDetails pt-page-{index}" class="pt-perspective">\
                            <h1>{entity}</h1>\
                            <p>{blurb}<p>\
                        </div>\
                        {/allEntities}\
                        ';

    //compile above Dust template
    var compiledSlide = dust.compile(featuredSlide, "slide");
    dust.loadSource(compiledSlide);

    //grab Data
    var renderableData = {
        //load state law data
        allEntities: data,
    };

    //render dust template as HTML
    dust.render("slide", renderableData, function(err, out) {
      //add dust template output into table as jQuery html
      $('#featuredEntity').append($(out));
    });
}

//REQUIRE A CALL BEFORE TABLETOP INIT STARTS
Tabletop.init( { 
//    proxy : 'https://s3.amazonaws.com/mj-tabletop-proxy',
    key: public_spreadsheet_url, callback: makeSlide, simpleSheet: true,
} )
