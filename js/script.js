// Globals
var SPREADSHEET_ID = '0AiK02J6OppqxdFhkVl9ONHJTZHZSVjBEamZRdzJFMkE';

// Cached jQuery selectors
var $categories = null;
var $categoryNav = null;

// Compiled templates
var categoryNavTemplate = null;
var categoriesTemplate = null;
var entityDetailsTemplate = null;

// State
var spreadsheetData = null;

var onDocumentReady = function() {
    $categories = $('#categories');
    $categoryNav = $('#category-nav');

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
        var categorySlug = category.replace(/ /, ''); // TKTK: should be a slug in teh spreadsheet
        // var categorySlug = rows[0]['categorySlug']; // PLACEHOLDER FOR WHEN WE HAVE SLUGS

        $categoryNav.append(categoryNavTemplate({
            'categorySlug': categorySlug,
            'category': category
        }));

        $categories.append(categoriesTemplate({ 
            'category': category,
            'categorySlug': categorySlug,
            'categoryBlurb': rows[0]['categoryblurb'],
            'entities': rows
        }));
    }

    $('.category-link').on('click', onCategoryClick);
    $('.show-entity').on('click', onShowEntityClick);
    $('.donor-link').on('click', onDonorClick);
}

/*
 * Scroll to category list.
 */
var onCategoryClick = function(e) {
    e.preventDefault();

    var $target = $(this.hash);
    console.log(this.category);

    $('html,body').animate({
        scrollTop: $target.offset().top
    }, 1000);
}

/*
 * Show entity details.
 */
var onShowEntityClick = function(e) {
    e.preventDefault();
    var $this = $(this);
    console.log(this)
    // read the index off the element
    var entityIndex = $this.data('entity-index');

    // lookup the entity with that index
    var entity = _.find(spreadsheetData, function(row) {
        return row['index'] == entityIndex;
    });

    var entityDetails = entityDetailsTemplate(entity);

    $('.entity-details').slideUp(400)

    $this.next('.entity-details').html(entityDetails).slideDown(400);

}

/*
 * Scroll to donor.
 */
var onDonorClick = function(e) {
    e.preventDefault();

    var $target = $(this.hash);
    console.log(this.category);

    $('html,body').animate({
        scrollTop: $target.offset().top
    }, 1000);
}

$(onDocumentReady);