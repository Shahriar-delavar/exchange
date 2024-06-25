(function ($) {
	"use strict";

	/*--------------------------
	preloader
	---------------------------- */

	$(window).on('load', function () {
		var pre_loader = $('#preloader')
		pre_loader.fadeOut('slow', function () { $(this).remove(); });
	});


	// calculate 

	$("#calculate-btn").on("click", () => {


		// check form 
		// fetch rates 

		console.log("clicked");
		const send_currency = $("#send-currency").val();
		const receive_currency = $("#receive-currency").val();
		const pair = `${send_currency}-${receive_currency}`;
		console.log(pair);


		fetch("https://portal.artaaustralia.com.au/api/sam/rates")
			.then(r => r.json())
			.then(j => j[pair])
			.then(rate => {
				$("#buy-rate").text(rate?.BUY || "No rate");
				$("#sell-rate").text(rate?.SELL || "No rate");
				console.log(rate);
			})
			.catch(e => console.error(e))
	});


	//  keep input formatted with commas
	$("#send-amount-input")
		.on("keyup", () => {
			const pre_num = $("#send-amount-input").val();
			const no_comma = pre_num.replaceAll(",", "");
			let number = parseInt(no_comma); // Remove any existing commas
			if (!isNaN(number)) {
				const formattedNumber = number.toLocaleString();
				console.log(formattedNumber);
				$("#send-amount-input").val(formattedNumber) // Format and remove decimals
			}
		});


	//  handel input currency select change 

	$("#send-currency")
		.on("change",
			() => {
				console.log($("#send-currency").val(), $("#receive-currency").val());
				if ($("#send-currency").val() == "AUD") {
					$("#receive-currency").val("TOMAN").trigger("change");
					$("#receive-currency").niceSelect("update");
				}
				else {
					$("#receive-currency").val("AUD").trigger("change");
					$("#receive-currency").niceSelect("update");

				}


			});





	/*---------------------
	 TOP Menu Stick
	--------------------- */

	var windows = $(window);
	var sticky = $('#sticker');

	windows.on('scroll', function () {
		var scroll = windows.scrollTop();
		if (scroll < 300) {
			sticky.removeClass('stick');
		} else {
			sticky.addClass('stick');
		}
	});

	/*----------------------------
	 jQuery MeanMenu
	------------------------------ */

	var mean_menu = $('nav#dropdown');
	mean_menu.meanmenu();

	// Nice Select JS
	$('select').niceSelect();

	/*---------------------
	 wow .js
	--------------------- */
	function wowAnimation() {
		new WOW({
			offset: 100,
			mobile: true
		}).init()
	}
	wowAnimation()

	/*--------------------------
	 scrollUp
	---------------------------- */

	$.scrollUp({
		scrollText: '<i class="ti-angle-up"></i>',
		easingType: 'linear',
		scrollSpeed: 900,
		animation: 'fade'
	});


	/*--------------------------
	 collapse
	---------------------------- */

	var panel_test = $('.panel-heading a');
	panel_test.on('click', function () {
		panel_test.removeClass('active');
		$(this).addClass('active');
	});


	/*--------------------------
	 Parallax
	---------------------------- */
	var parallaxeffect = $(window);
	parallaxeffect.stellar({
		responsive: true,
		positionProperty: 'position',
		horizontalScrolling: false
	});

	/*---------------------
	 Testimonial carousel
	---------------------*/

	var review = $('.testimonial-carousel');
	review.owlCarousel({
		loop: true,
		nav: true,
		margin: 20,
		dots: false,
		navText: ["<i class='ti-angle-left'></i>", "<i class='ti-angle-right'></i>"],
		autoplay: false,
		responsive: {
			0: {
				items: 1
			},
			768: {
				items: 2
			},
			1000: {
				items: 4
			}
		}
	});
	/*--------------------------
		 Payments carousel
	---------------------------- */
	var payment_carousel = $('.payment-carousel');
	payment_carousel.owlCarousel({
		loop: true,
		nav: false,
		autoplay: false,
		margin: 30,
		dots: false,
		responsive: {
			0: {
				items: 2
			},
			700: {
				items: 4
			},
			1000: {
				items: 6
			}
		}
	});


})(jQuery); 