//makes nav menu, category slides, entity details and populate with Google Spreadsheet
var viewEntities = (function() {
  var List = function() {
    return {
      create: function() {
        var self = this;
        var options = {
          key: this.spreadsheetId,
          callback: function(data) {
            self.data = data;
            self.makeHTML()
          },
          simpleSheet: true,
        }
        if (this.proxy) {
          options.proxy = this.proxy;
        }
        Tabletop.init(options); 
      },

      makeHTML: function() {

        var unique_categories = {};
        var scrollClick = function() {
          var target = $(this.hash);
                       target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                       if (target.length) {
                         $('html,body').animate({
                           scrollTop: target.offset().top
                         }, 1000);
                       }            };

        for (var i = 0; i < this.data.length; i++) {

          if (this.data[i].category) {
            unique_categories[this.data[i].category] = this.data[i].categoryblurb;
          }
        }
        //for top nav menu
        var categories = Object.keys(unique_categories);
        var top_ul = $('<ul></ul>');
        $('#catNav').append(top_ul);

        for (var i = 0; i < categories.length; i++) {

          var entitiesMenu = $('<ul class="entitiesMenu desktopOnly"></ul>'),
                sectionAnchor = $('<div id="' + categories[i].replace(/ /, '') + '" class="sectionAnchor"></div>'),
                featuredWrapper = $('<div class="featuredWrapper desktopOnly"><div id="' + categories[i].replace(/ /, '') + 'Featured" class="featuredDetails"><h1>' + categories[i] + '</h1><p>' + unique_categories[categories[i]] + '</p></div>'),
                backToTopButton = $('<a href="#top" class="topLink"><span class="backToTop desktopOnly">Back to Top</span></a>'),
                mobileCats = $('<div class="mobileOnly"><h1>' + categories[i] + '</h1><p>' + unique_categories[categories[i]] + '</p></div>'),
                details = this.details,
                listTemplate = this.listTemplate,
                detailsTemplate = this.detailsTemplate;

          backToTopButton.click(scrollClick);

          dust.render(this.categoryTemplate, {
            catLink: categories[i].replace(/ /, ''), //remove space from category names to create a href extension
            category: categories[i] // create category names
          },

            function(err, out) {
              var $catSquare = $(out);
              $catSquare.click(scrollClick);
              top_ul.append($catSquare);
            });
        
          for (var j=0; j < this.data.length; j++) {
             
            if (this.data[j].category === categories[i]) {               
              var data = this.data[j];
              
              (function(category) {
                dust.render(listTemplate, data, function(err, out) {
                  var $square = $(out);

                  dust.render(detailsTemplate, data, function(err2, out2){

                    $square.on("click",function(){
                      //Change this to replace the contents of some div with out2
                      $('#' + category.replace(/ /, '') + 'Featured').html(out2);
                    });

                    entitiesMenu.append($square);
                  });
                });
              })(categories[i]);
            }
          }
          
          this.element.append(sectionAnchor);
          sectionAnchor.prepend(featuredWrapper);
          featuredWrapper.before(mobileCats);
          sectionAnchor.append(entitiesMenu);
          featuredWrapper.append(backToTopButton);
        }
      }
    }
  };

  var compile = function(template) {

    var templateName = Math.floor(Math.random() * 1000000);
    var compiledTemplate = dust.compile(template, templateName);
    dust.loadSource(compiledTemplate);
    return templateName;

  }

  return function(spreadsheetId, listSelector, listTemplate, detailsSelector, detailsTemplate, proxy) {
    var list = new List;
    list.element = $(listSelector);
    list.details = $(detailsSelector);

    if (!list.element) {
      throw 'could not find your element';
    };

    list.spreadsheetId = spreadsheetId;

    list.listTemplate = compile(listTemplate);

    list.categoryTemplate = compile(categoryItemTemplate);

    list.detailsTemplate = compile(detailsTemplate);

    if (proxy) { list.proxy = proxy; }

    list.create();

    return list;
  };

})();
