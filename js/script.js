// Globals
var SPREADSHEET_ID = '0AiK02J6OppqxdFhkVl9ONHJTZHZSVjBEamZRdzJFMkE';

// Cached jQuery selectors
var $categoryNav = null;
var $categories = null;

// Compiled templates
var categoryNavTemplate = null;
var categoriesTemplate = null;
var entityDetailsTemplate = null;
var donorsTemplate = null;

// State
var spreadsheetData = null;
var pymChild = null;

var onDocumentReady = function() {
    $categoryNav = $('#category-nav');
    $categories = $('#categories');

    categoryNavTemplate = _.template($('#category-nav-template').html());  
    categoriesTemplate = _.template($('#categories-template').html());
    entityDetailsTemplate = _.template($('#entity-details-template').html());
    
    Tabletop.init({
        key: SPREADSHEET_ID,
        callback: onDataLoaded,
        simpleSheet: true,
    });
}

/*
 * When data is loaded, generate page HTML.
 */
var onDataLoaded = function(data) {
    spreadsheetData = data;

    var rowsByCategory = _.groupBy(spreadsheetData, 'category');
    var categories = _.keys(rowsByCategory);

    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];
        var rows = rowsByCategory[category];

        $categoryNav.append(categoryNavTemplate({
            'category': category
        }));

        $categories.append(categoriesTemplate({ 
            'category': category,
            'categoryBlurb': rows[0]['categoryblurb'],
            'entities': rows
        }));
    }
    $('.category-link').on('click', onScrollTargetClick);
    $('.show-entity').on('click', onShowEntityClick);

    pymChild = new pym.Child();
}

/*
 * Scroll to target using data attributes.
 */
var onScrollTargetClick = function(e) {
    e.preventDefault();

    // read the target name off the element, read the target's y-coordinate
    var $target = $('[data-name="' + $(this).data('target') + '"]');
    var offset = $target.offset().top;

    $target.click()

    pymChild.sendMessage('scroll', offset.toString())  
}

/*
 * Show entity details.
 */
var onShowEntityClick = function(e) {
    e.preventDefault();

    var $this = $(this);

    // read the index off the element
    var entityIndex = $this.data('entity-index');

    // lookup the entity with that index
    var entity = _.find(spreadsheetData, function(row) {
        return row['index'] == entityIndex;
    });

    var entityDetails = entityDetailsTemplate(entity);

    $('.entity-details').slideUp(400)

    $this.next('.entity-details').html(entityDetails).slideDown(400, function(){ 
        $('.donor-link').on('click', onScrollTargetClick);
        pymChild.sendHeight();
    });

}

$(onDocumentReady);
