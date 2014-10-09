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
        
        var ul = $('<ul></ul>'),
            details = this.details,
            listTemplate = this.listTemplate,
            detailsTemplate = this.detailsTemplate;

        for (var i = 0; i < this.data.length; i++) {

          var data = this.data[i];

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

        this.element.append(ul);

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

    list.detailsTemplate = compile(detailsTemplate);

    if (proxy) { list.proxy = proxy; }

    list.create();

    return list;
  };

})();
