(function ($) {
	"use strict";

	const base_url = "https://portal.artaaustralia.com.au";


	function parseHTML(htmlString) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlString, 'text/html');
		return doc.body.innerHTML; // Access parsed HTML content
	}

	function parseEscapedHtml(text) {
		// Create a temporary element to parse the HTML
		const tempEl = document.createElement('div');

		// Set the innerHTML of the temporary element with the escaped text
		tempEl.innerHTML = text;

		// Return the parsed HTML content (innerHTML of the temporary element)
		return tempEl.textContent;
	}

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


	loadBlogPosts();


	// update display rates 


	fetch(`${base_url}/api/sam/rates`)
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
					const rate_detial = j.find(
						(obj) => (obj.symbol == pair && obj._from <= send_amount && obj._to >= send_amount));
					if (rate_detial) return rate_detial
					else return false
				})
				.then(d => {
					if (d._rate && !isNaN(d?._rate)) {
						console.log(d);
						let receive_amount = 0;
						if (d.is_based_on_dest || d.symbol.startsWith('IRT')) {
							receive_amount = Math.ceil((send_amount - d._commission) * (1 / d._rate));
						} else {
							receive_amount = Math.ceil(((send_amount - d._commission) * d._rate));
						}
						if (isNaN(receive_amount)) {
							$("#rate").text(` خطا در محاسبه .`);
						} else {
							$("#receive-amount-display")
								.val(parseInt(receive_amount.toFixed(0)).toLocaleString());
							$("#rate").html(`${convertEnglishToPersian(parseInt(d._rate).toLocaleString())} <span class="float-right persian">نرخ</span>`);
						}
					} else {
						$("#receive-amount-display")
							.val("نرخ در محدوده مورد نظر پیدا نشد");
						$("#rate").html("");
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


	function loadBlogPosts() {
		console.log("loading blog posts");
		fetch(`${base_url}/api/sam/posts/`)
			.then(r => r.json())
			.then(posts => {
				$("#blog_posts_container").html("");
				console.log(posts[0]);
				posts.forEach(post => $("#blog_posts_container").append(generateBlogPostDisplay(post)))
			})
	}

	function getRandomImage() {
		return `img/blog/b${Math.floor(Math.random() * 6) + 1}.jpg`;
	}

	function generateBlogPostDisplay(p) {
		let post = {
			id: p.id,
			post_lang: p.post_lang,
			content: parseEscapedHtml(p.content)
		};
		if (!p.featured_image || p.featured_image == null) {
			post.featured_image = getRandomImage();
		} else {
			post.featured_image = `${base_url}/sam/gallery/${p.featured_image}`;
		}
		return ` <div class="col-md-4 col-sm-6 col-xs-12">
                        <div class="single-blog">
                            <div class="blog-image">
                                <a class="image-scale" href="#">
                                    <img crossorigin="anonymous" 
									src="${post.featured_image}"
									alt="">
                                </a>
                                <div class="blog-content">
                                    <div class="blog-meta">
                                        <span class="admin-type">
                                            <i class="fa fa-user"></i>
                                            Admin
                                        </span>
                                        <span class="date-type">
                                            <i class="fa fa-calendar"></i>
                                            ${post.published_at}
                                        </span>                                     
                                    </div>
                                    <a href="">
                                        <h4 class="persian">${post.title || ""}</h4>
                                    </a>
									<div ${post?.post_lang == "FA" ? 'class="persian"' : ""}>
									${post.content}
									</div>                                  
                                     <a class="blog-btn anti-bttn"
									  href="blog-fa.html?post_id=${post.id}" > خواندن مطلب </a> 
                                </div>
                            </div>
                        </div>
                    </div> `
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