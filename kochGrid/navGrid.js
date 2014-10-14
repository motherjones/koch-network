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

        for (var i = 0; i < this.data.length; i++) {

           if (this.data[i].category) {
              unique_categories[this.data[i].category] = true;
           }
        }
        
        var categories = Object.keys(unique_categories);
        var top_ul = $('<ul></ul>');
        $('#catNav').append(top_ul);

        for (var i = 0; i < categories.length; i++) {

          var ul = $('<ul class="entitiesMenu"></ul>'),
                div = $('<div id="' + categories[i] + '" class="sectionAnchor"><div id="' + categories[i] + 'Featured" class="featuredDetails"></div></div>'),
                details = this.details,
                listTemplate = this.listTemplate,
                detailsTemplate = this.detailsTemplate;

          dust.render(this.categoryTemplate, {category: categories[i]}, function(err, out) {
            var $catSquare = $(out);
            $catSquare.click(function() {
              //FIXME DO WHATEVER WE DO WHEN YOU CLICK ON A CATEGORY BUTTON
            });
            top_ul.append($catSquare);
          });
           
          for (var j=0; j < this.data.length; j++) {
             
            if (this.data[j].category === categories[i]) {               
              var data = this.data[j];
              
              dust.render(listTemplate, data, function(err, out) {
                var $square = $(out);

                dust.render(detailsTemplate, data, function(err2, out2){

                  $square.on("click",function(){
                    //Change this to replace the contents of some div with out2
                    details.html(out2);
                  });

                  ul.append($square);
                });
              });
            }
          }
          
          div.append(ul);
          this.element.append(div);
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
