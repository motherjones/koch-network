var SPREADSHEET_ID = '0AiK02J6OppqxdFhkVl9ONHJTZHZSVjBEamZRdzJFMkE';

var $categories = null;
var $categoryNav = null;

var categoryNavTemplate = null;
var categoriesTemplate = null;

var onDocumentReady = function() {
    $categories = $('#categories');
    $categoryNav = $('#category-nav ul');

    categoryNavTemplate = _.template($('#category-nav-template').html());  
    categoriesTemplate = _.template($('#categories-template').html());

    Tabletop.init( {
        key: SPREADSHEET_ID,
        callback: onDataLoaded,
        simpleSheet: true,
    });
}

$(onDocumentReady);

/*
 * When data is loaded, generate page HTML.
 */
var onDataLoaded = function(data) {
    var rowsByCategory = _.groupBy(data, 'category');
    var categories = _.keys(rowsByCategory);

    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];
        var rows = rowsByCategory[category];
        var categorySlug = category.replace(/ /, '');

        var $nav = $(categoryNavTemplate({
            categorySlug: categorySlug,
            category: category
        }));

        //$nav.click(scrollClick);
        $categoryNav.append($nav);

        $categories.append(categoriesTemplate({ 
            'category': category,
            'categorySlug': categorySlug,
            'blurb': rows[0]['blurb'],
            'entities': rows
        }));
    }

    $('.category-link').on('click', onCategoryClick);
}

var onCategoryClick = function(e) {
    e.preventDefault();

    var $target = $(this.hash);

    $('html,body').animate({
        scrollTop: $target.offset().top
    }, 1000);
}