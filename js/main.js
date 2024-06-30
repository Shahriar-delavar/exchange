(function ($) {
	"use strict";

	/*--------------------------
	preloader
	---------------------------- */

	$(window).on('load', function () {
		var pre_loader = $('#preloader')
		pre_loader.fadeOut('slow', function () { $(this).remove(); });
	});


	// persian numbers 

	function convertEnglishToPersian(numberString) {
		const englishToPersianDigits = {
			"0": "۰",
			"1": "۱",
			"2": "۲",
			"3": "۳",
			"4": "۴",
			"5": "۵",
			"6": "۶",
			"7": "۷",
			"8": "۸",
			"9": "۹",
		};
		const chars = numberString.split("");
		const persianChars = chars.map((char) => englishToPersianDigits[char] || char); // Handle non-numeric characters
		return persianChars.join("");
	}



	// update display rates 


	fetch("https://portal.artaaustralia.com.au/api/sam/rates")
		.then(r => r.json())
		.then(j => {

			console.log(j);

			const ratesMin = j.reduce(
				(minObj, currentObj) => {
					if (currentObj.symbol === "IRT-AUD") {
						// Check for lower rate
						return currentObj._rate < minObj._rate ? currentObj : minObj;
					}
					return minObj;
				}, { group: "IRT-AUD", _rate: Infinity }); // Initial object with highest possible rate


			const ratesMax = j.reduce((maxObj, currentObj) => {
				if (currentObj.symbol === "AUD-IRT") {
					// Check for higher rate
					return currentObj._rate > maxObj._rate ? currentObj : maxObj;
				}
				return maxObj;
			}, { symbol: "AUD-IRT", _rate: -Infinity }); // Initial object with lowest possible rate

			$("#display_sell_rate").html(`<span class="dolar">تومان
				</span>${convertEnglishToPersian(ratesMin._rate.toLocaleString())}`
			);
			$("#display_buy_rate").html(
				`<span class="dolar">تومان
				</span>${convertEnglishToPersian(ratesMax._rate.toLocaleString())}`);
		})
		.catch(e => console.error(e))



	// calculate 

	$("#calculate-btn").on("click", () => {
		// check form 
		// fetch rates 
		const send_amount = getInputValueByIDasInteger("send-amount-input");
		const send_currency = $("#send-currency").val();
		const receive_currency = $("#receive-currency").val();
		const pair = `${send_currency}-${receive_currency}`;

		if (send_amount && send_amount > 0) {
			fetch("https://portal.artaaustralia.com.au/api/sam/rates")
				.then(r => r.json())
				.then(j => {
					console.log(j);
					console.log(send_amount.toLocaleString())
					const rate_detial = j.find(
						(obj) => (obj.symbol == pair && obj._from <= send_amount));
					if (rate_detial) return rate_detial
					else return false
				})
				.then(d => {
					console.log(d);
					$("#rate").text(`parseInt(d._rate).toLocaleString() نرخ`);				
					if (d._rate && !isNaN(d?._rate)) {
						let receive_amount = 0;
						if (d.is_based_on_dest || d.symbol.startsWith('IRT')) {
							receive_amount = Math.ceil((send_amount - d._commission) * (1 / d._rate));
						} else {
							receive_amount = Math.ceil(((send_amount - d._commission) * d._rate));
						}
						$("#receive-amount-display").val(parseInt(receive_amount.toFixed(0)).toLocaleString());
					} else {
						$("#receive-amount-display").val("خطا در محاسبه .");
					}
				})
				.catch(e => console.error(e))
		}


	});

	function getInputValueByIDasInteger(id) {
		const pre_num = $(`#${id}`).val();
		const no_comma = pre_num.replaceAll(",", "");
		return parseInt(no_comma); // Remove any existing commas

	}



	//  keep input formatted with commas
	$("#send-amount-input")
		.on("keyup", () => {
			const number = getInputValueByIDasInteger("send-amount-input");
			if (!isNaN(number)) {
				const formattedNumber = number.toLocaleString();
				$("#send-amount-input").val(formattedNumber) // Format and remove decimals
				$("#receive-amount-display").val("");
			}
		});


	//  handel input currency select change 

	$("#send-currency")
		.on("change",
			() => {
				$("#receive-amount-display").val("");
				if ($("#send-currency").val() == "AUD") {
					$("#receive-currency").val("IRT").trigger("change");
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






})(jQuery); 