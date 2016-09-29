/*
@package godofredoninja

========================================================================
Mapache Javascript Functions
========================================================================
*/

/* Imports and libraris and modules */
import prism            from "./lib/prism.js";
import search           from './lib/jquery.ghostHunter.js';
import mapacheShare     from './app/app.share';
import shareCount       from './app/app.share-count';
import pagination       from './app/app.pagination';
import mapacheRelated   from './app/app.related.post';

(function() {

	/* variables globals */
	const $gd_header        = $('#header'),
		$gd_cover           = $('#cover'),
		$gd_search_input    = $('.search-field'),
		$gd_comments        = $('#post-comments'),
		$gd_related         = $('#post-related'),
		$gd_share_count     = $('.share-count'),
		$gd_video           = $('#video-format'),
		$gd_social_box		= $('.social_box'),
		$gd_sidebar_fixed   = $('#sidebar').find('.fixed'),
		$gd_scroll_top		= $('.scroll_top'),
		$gd_page_url		= $('body').attr('mapache-page-url'),

		url_regexp 			= /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/;

	var $document   = $(document),
		$window     = $(window);

	/* Share article Social media */
	$('.share').bind('click', function (e) {
		e.preventDefault();
		let share = new mapacheShare((this$));
		share.godoShare();
	});

	/* Menu open and close for mobile */
	$('#nav-mob-toggle').on('click', function(e) {
		e.preventDefault();
		$('body').toggleClass('is-showNavMob');
	});

	/* Seach open and close for Mobile */
	$('#search-mob-toggle').on('click', function(e) {
		e.preventDefault();
		$gd_header.toggleClass('is-showSearchMob');
		$gd_search_input.focus();
	});

	/* Change title home */
	if (typeof  title_home !== 'undefined') {
		$('#title-home').html(title_home);
	}

	/**
	 * Search open an close desktop.
	 * Api ghost for search
	 */
	$document.on('ready', () => {

		$gd_search_input.focus( () => {
			$gd_header.addClass('is-showSearch');
			$('.search-popout').removeClass('closed');
		});

		$gd_search_input.blur( () => {
			setTimeout( () => {
				$gd_header.removeClass('is-showSearch');
				$('.search-popout').addClass('closed');
			}, 200);
		});

		$gd_search_input.keyup( () =>  {
			$('.search-suggest-results').css('display','block');
		});

		$gd_search_input.ghostHunter({
			results             : "#search-results",
			zeroResultsInfo     : false,
			displaySearchInfo   : false,
			result_template     : '<a href="'+$gd_page_url+'{{link}}">{{title}}</a>',
			onKeyUp             : true,
		});

	});

	/**
	 * Header box shadow and transparent
	 */
	$document.on('ready', () => {

	   if( $gd_cover.length > 0 ) {
			$window.on('scroll', coverScroll);
		}

		function coverScroll(){
			let scrollTop         = $window.scrollTop(),
				gd_cover_height   = $gd_cover.height() - $gd_header.height(),
				gd_cover_wrap     = ( gd_cover_height - scrollTop ) / gd_cover_height;

			if ( scrollTop >= gd_cover_height ) {
				$gd_header.addClass('toolbar-shadow').removeAttr('style');
			} else {
				$gd_header.removeClass('toolbar-shadow').css({'background':'transparent'});
			}
			$('.cover-wrap').css('opacity', gd_cover_wrap);
		}
	});

	/* Video Full for Video post Format */
	function videoPostFormat() {
		$('.post-image').css('display', 'none');
		let video = $('iframe[src*="youtube.com"]')[0];
		$gd_video.find('.video-featured').prepend(video);

		if( typeof youtube != 'undefined' ){
			$gd_video.find('.video-content').removeAttr('style');

			$.each( youtube, ( channelName, channelId ) => {
				$gd_video.find('.channel-name').html(`Subscribe to <strong>${channelName}</strong>`);
				$('.g-ytsubscribe').attr('data-channelid', channelId);
			});

			let s = document.createElement("script");
			s.src='https://apis.google.com/js/platform.js';
			document.body.appendChild(s);
		}
	}

	 /* search all video in <post-body>  for Responsive*/
	function videoResponsive() {
		$('.post-body').each( function() {
			var selectors = [
				'iframe[src*="player.vimeo.com"]',
				'iframe[src*="youtube.com"]',
				'iframe[src*="youtube-nocookie.com"]',
				'iframe[src*="kickstarter.com"][src*="video.html"]',
			];

			var $allVideos = $(this).find(selectors.join(','));

			$allVideos.each( function () {
				$(this).wrap('<aside class="video-responsive"></aside>');
			});
		});
	}

	/* Share Social Count */
	function shareConter() {
		if ($gd_share_count.length > 0) {
			let share_count = new shareCount($gd_share_count);
			share_count.godoCount();
		}
	}

	/* add social follow  */
	function socialBox(links) {
		$.each( links, ( type, url ) => {
			if( typeof url === 'string' && url_regexp.test(url) ){
				let template = `<a title="${type}" href="${url}" target="_blank" class="i-${type}"></a>`;
				$gd_social_box.append(template);
			}
		});
	}

	/* Disqus Comment */
	function disqusComments () {
		if(typeof disqus_shortname !== 'undefined'){
			$gd_comments.removeAttr('style');
			let d = document, s = d.createElement('script');
			s.src = `//${disqus_shortname}.disqus.com/embed.js` ;
			s.setAttribute('data-timestamp', +new Date());
			(d.head || d.body).appendChild(s);
		}
	}


	/* scrolltop link width click (ID)*/
	$('.scrolltop').on('click', function(e) {
		e.preventDefault();
		$('html, body').animate({scrollTop: $($(this).attr('href')).offset().top - 50}, 500, 'linear');
	});

	/*Scroll Top Page */
	$window.on('scroll', function(){
		if ($(this).scrollTop() > 100) {
			$gd_scroll_top.addClass('visible');
		} else {
			$gd_scroll_top.removeClass('visible');
		}
	});

	$gd_scroll_top.on('click', function(e){
		e.preventDefault();
		$('html, body').animate({ scrollTop: 0 }, 500);
	});


	// sidebar hidden aside
	function sidebarFixed() {
		let mela  = $gd_sidebar_fixed.offset().top;
		$window.on('scroll', () => {
			let scrollTop = $window.scrollTop();
			if ( scrollTop > mela - 78) {
				$gd_sidebar_fixed.addClass('active');
			}else{
				$gd_sidebar_fixed.removeClass('active');
			}
		});
	}

	/**
	 * when the document starts
	 */
	$document.on('ready', () => {
		shareConter();
		if( typeof social_link != 'undefined' ) socialBox(social_link);
		if( $gd_comments.length > 0 ) disqusComments();
		if( typeof disqus_shortname != 'undefined' && typeof disqusPublicKey != 'undefined' ){ commentsCount();}
		if( $gd_video.length > 0 ) videoPostFormat();
		videoResponsive();
		if ($gd_sidebar_fixed.length > 0) sidebarFixed();

		/**
		 * Post related
		 */
		if ($gd_related.length > 0) {
			let related = new mapacheRelated($gd_related, $gd_page_url);
			related.mapacheGet();
		}

		/* Prism autoloader */
		Prism.plugins.autoloader.languages_path = '../assets/js/prism-components/';

	});

})();