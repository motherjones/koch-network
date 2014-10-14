if (!window['YT']) {var YT = {};}if (!YT.Player) {(function(){var a = document.createElement('script');a.src = 'https:' + '//s.ytimg.com/yts/jsbin/www-widgetapi-vfljlXsRD.js';a.async = true;var b = document.getElementsByTagName('script')[0];b.parentNode.insertBefore(a, b);})();} 

// check for the special browser
var ieFix = "wmode=transparent&",
rv = -1;
if (navigator.appName == 'Microsoft Internet Explorer') {
	var ua = navigator.userAgent,
		re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	if (re.exec(ua) != null) {
		rv = parseFloat( RegExp.$1 );
	}
}
if ( rv > -1 ) { ieFix = ""; };

// Set the array to hold the player objects
var gm_lightbox_playerArray = [],

// define a blank var to hold the currently playing video
 gm_lightbox_currentVideo;

// the Youtube API will call this function when it finishes loading
function onYouTubeIframeAPIReady() {
	
	// loop through the elements and create the players
	gm_lightbox_initialize();
	
	// bind behavior for the lightbox open element
	jQuery(".gm_lightbox_open").on("click", function() {
		var id = jQuery(this).data("gm_lightbox_id");
		gm_lightbox_open(id);
	});
	
	// bind the behavior for the close and overlay element
	jQuery(".gm_lightbox_close, .gm_lightbox_overlay").on("click", function(e) {
		// make sure the click event doesn't bubble up
		e.stopPropagation();
		gm_lightbox_close();
	});
}

// Select all of the opener elements, append the needed HTML, and create the youtube players
function gm_lightbox_initialize( ) {
	
	// i is the position of the element in the selected array, used to give each player a unique numerical ID
	jQuery(".gm_lightbox_open").each( function ( i ) {
	
		// get video id
		var videoID = jQuery( this ).data( "gm_lightbox_video" );
		
		// determine video type
		var url = gm_lightbox_parseID(videoID);

		// apply the increment i as data-gm_lightbox_id
		jQuery( this ).attr( "data-gm_lightbox_id", i );
		
		var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="33.433px" height="33.433px" viewBox="0 0 33.433 33.433" enable-background="new 0 0 33.433 33.433" xml:space="preserve"><path fill="#FFFFFF" d="M31.508,32.844c-0.785,0.785-2.057,0.785-2.842,0L0.589,4.767c-0.785-0.785-0.785-2.057,0-2.842l1.337-1.337c0.785-0.785,2.057-0.785,2.842,0l28.078,28.078c0.785,0.785,0.785,2.057,0,2.842L31.508,32.844z"/><path fill="#FFFFFF" d="M32.844,1.925c0.785,0.785,0.785,2.057,0,2.842L4.767,32.844c-0.785,0.785-2.057,0.785-2.842,0l-1.337-1.337c-0.785-0.785-0.785-2.057,0-2.842L28.666,0.589c0.785-0.785,2.057-0.785,2.842,0L32.844,1.925z"/></svg>';		
		// append the player html to the overlay
		jQuery(".gm_lightbox_overlay").append("<div class='gm_lightbox_wrapper' id='gm_lightbox" + i + "' data-gm_lightbox_video='" + i + "'><div class='gm_lightbox_close'>" + closeIcon + "</div><iframe src='http://" + url + "/" + videoID + "?"  + ieFix + "api=1' width='100%' height='100%' frameborder='0' allowfullscreen></iframe></div>");
		
	});

}

// opens a lightbox. Accepts the numeric ID of the element
function gm_lightbox_open(id) { 

	// open the overlay and video wrapper
	jQuery(".gm_lightbox_overlay").fadeIn( 250 );
	jQuery("#gm_lightbox" + id).fadeIn( 250 );
	
	// set the public variable to whatever the currently playing video is
	gm_lightbox_currentVideo = id;

}

// closes the currently playing video lightbox
function gm_lightbox_close() { 
	
	// get the iframe player inside of the video wrapper by the numeric id
	var playerWrapper = document.getElementById("gm_lightbox" + gm_lightbox_currentVideo);
	var iframe = playerWrapper.getElementsByTagName("iframe")[0].contentWindow;
	
	// send a JSON command to the iframe to play or pause the video
	iframe.postMessage('{"event":"command","func":"pauseVideo", "method" : "pause"}', '*');
	
	// close the lightbox
	jQuery(".gm_lightbox_overlay").fadeOut( 500 );
	jQuery(".gm_lightbox_wrapper").hide();
}

// determine if the videoID is from Youtube or Vimeo
function gm_lightbox_parseID(videoID) {
	
	for (var i = 0; i < videoID.length; i++) {
		var c = videoID.charAt(i);
		if ( isNaN(parseFloat(c)) && !isFinite(c) ) { return "www.youtube.com/embed"; }
	}
	return "player.vimeo.com/video";
}


// we have to do this because Wordpress runs jQuery in noConflict mode and this disallows $
// http://codex.wordpress.org/Function_Reference/wp_enqueue_script#jQuery_noConflict_Wrappers
jQuery(document).ready(function($) {
	
	// fade in images on load. If already loaded, show anyway
	for (var i = 0; i <= $(".photo-bg").length; i++) {
		$("#preload" + i).one("load", function () { $(this).siblings(".photo-bg").css("opacity","1"); })
		.each(function(){if(this.complete) {$(this).siblings(".photo-bg").css("opacity","1");}});
	}

	// define a few selected elements to help with faster DOM access
	var mobileSize, offsetVal,
		mobileMenu = $(".mobileNavWrapper"),
		moveOnMenuOpen = $(".mobileNavWrapper, .wrapper, .header, .footer"),
		pageHeader = $(".header");

	// note whether the screen size is roughly a mobile device (tablet portrait and below), and set a global var accordingly
	function detectWindowSize() {
		if ($(window).width() <= 850) {
			mobileSize = true;
		} else {
			mobileSize = false;
			moveOnMenuOpen.removeClass("showNav");
		}
		
		if ($(window).width() < 985) {
			offsetVal = 122;
		} else {
			offsetVal = 115;
		}
	}

	// run this on page load
	detectWindowSize();

	// detect a browser window resize event and throttle the output slightly (limited to 10 times/second)
	// this keeps resize detection from being spastic on IE and Webkit ( http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/ )
	( function( $,sr ){
	// debouncing function from John Hann ( http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/ )
	var debounce = function ( func, threshold, execAsap ) {
		var timeout;
		return function debounced ( ) {
			var obj = this, args = arguments;
			function delayed ( ) {
				if ( !execAsap )
					func.apply( obj, args );
				timeout = null; 
			};

			if ( timeout )
				clearTimeout( timeout );
			else if ( execAsap )
				func.apply( obj, args );

			timeout = setTimeout( delayed, threshold || 100 ); 
		};
	}
		// smartresize 
		jQuery.fn[sr] = function( fn ){ return fn ? this.bind( 'resize', debounce( fn ) ) : this.trigger( sr ); };
	 
	} )( jQuery,'smartresize' );

	// detect the window size whenever the viewport changes
	$( window ).smartresize( function( ){ 
		detectWindowSize();
	});

	// show the main menu when you click the menu button
	$("#mobileMenuButton").on("click", function(e) {
		e.stopPropagation( );
		moveOnMenuOpen.toggleClass("showNav");
	});

	// hide the menu on page click/tap if mobile menu is showing
	$(".page, .footer").on("click", function() {
		if (mobileSize) {
			moveOnMenuOpen.removeClass("showNav");
		}
	});
		
	// autoclear any inputs on focus and swap the initial value depending on the input
	$( 'input:text, textarea' ).each( function ( ) {
		var initialValue = $( this ).val( );
		$(this).addClass('placeholder');
		$( this ).focus( function( ) {
			var currentValue = $( this ).val( );
			if ( initialValue == currentValue ) {
				$( this ).val( "" ).removeClass('placeholder');
			}
		} ).blur( function( ) {
			var currentValue = $( this ).val( );
			if ( currentValue == "" ) {
				$( this ).val( initialValue ).addClass('placeholder');
			}
		} );
	} );

	var disableChange = false;
	
	$(document).ready( function() {

		var anchors = $(".sectionAnchor");
		
		$( ".pageScroller" ).on("click", function( ) {
			disableChange=true;
			$('html,body').animate({scrollTop: ($("." + $(this).data("scrollto")).offset().top)-offsetVal},500);
			window.setTimeout(function(){disableChange=false;},480);
		});
		
		if ($('.gm_stickyNavWrapper').length > 0) {
		
			var subNav = $('.gm_stickyNavWrapper'),
				subNavSpacer = $(".gm_stickyNWSpacer, .gm_stickyNWSpacer2"),
				stickyNavTop = subNav.offset().top-60,
				activeTab, oldActiveTab;

			$(window).scroll(function() {
			
				if ( $(window).scrollTop() > 10) {
					$("#headerWrapper").addClass("darken");
				} else {
					$("#headerWrapper").removeClass("darken");
				}
				
				if ( $(window).scrollTop() >= stickyNavTop && $(window).width() >= 760) {
					subNav.addClass('sticky');
					subNavSpacer.show();
					
					anchors.each(function(index) {
						if ($(window).scrollTop() >= $(this).offset().top-offsetVal-40) {
							activeTab = index;
						}
					});
					
					if (activeTab != oldActiveTab && !disableChange) {
						$(".scrollElement").removeClass("active");
						$("#scrollE" + activeTab).addClass("active");
						oldActiveTab = activeTab;
					}
					
				} else {
					subNav.removeClass('sticky');
					subNavSpacer.hide();
					activeTab = 0;
					$(".scrollElement").removeClass("active");
				}
			});
		}
	});
	
	$(window).scroll(function() {
		if ( $(window).scrollTop() > 10) {
			$("#headerWrapper").addClass("darken");
		} else {
			$("#headerWrapper").removeClass("darken");
		}
		
	});
	
	function pinAllTheThings(type) {
		var thisURL = document.URL;
		switch(type) {
			case "manual":
				pinArray = $(".gm_pinit");
				$.each( pinArray, function( i, obj) {
					var media = $(obj).attr("src"),
					description = $(obj).attr("alt");
					$(obj).wrap("<span class='gm_pinit_wrapper'></span>");
					$(obj).after(getPin(media,description));
				});
				break;

			case "blog":
			case "gallery":
				pinArray = $(".gm_pinit .blog-content img");
				$.each( pinArray, function( i, obj) {
					if( !$(obj).hasClass("noPin") ) {
						var media = $(obj).attr("src"),
						description = $(obj).attr("alt");
						$(obj).wrap("<span class='gm_pinit_wrapper'></span>");
						$(obj).after(getPin(media,description));
					}
				});
				break;

			default:
				break;
		}
		function getPin(media,description) {return '<a href="//www.pinterest.com/pin/create/button/?url='+thisURL+'&media='+media+'&description='+description+'" data-pin-do="buttonPin" data-pin-config="none" data-pin-color="white" class="gm_pinit_button" target="_blank"><img src="//assets.pinterest.com/images/pidgets/pinit_fg_en_rect_white_20.png"></a>';}
	}

	if (typeof gm_pinType !== "undefined") {
		pinAllTheThings(gm_pinType);
	}
	});