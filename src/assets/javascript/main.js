$(function() {
	//DHVU.init();

	//Move to the next slide in the list
	//This functionality is currently not in use.
	$('.go-to-next-slide').click(function () {
		com.veeva.clm.nextSlide();
	});

	//Move to the previous slide in the list
	$('.go-to-prev-slide').click(function(event) {
		com.veeva.clm.prevSlide();
	});

	$('a[data-gotoslide]').on('click', function() {
		DHVU.goToSlide(this.dataset.gotoslide, this.dataset.targetpresentation);
	});


	// ---------------------------------------------------------------
	// use FastClick to remove the 300ms delay on tapping links
	FastClick.attach(document.body);

	// fix the issue where the whole page will scroll and bounce when you scroll past the end of a scrollable element
	bouncefix.add('scrollable');

	// Prevent slides from scrolling vertically if you swipe up or down. Allow vertical scrolling only on elements that
	// have the "scrollable" class.
	$('body').on('touchmove', function (e) {
		if (!$('.scrollable').has($(e.target)).length) {
			e.preventDefault();
		}
	});

	//SWIPE FUNCTIONALITY
	var myElement = document.body;
	var mc = new Hammer(myElement);
	var swipeTriggered = false;
	var noSwipe = $('.noSwipe');
	var noRight = $('.noSwipe-prev');
	var noLeft = $('.noSwipe-next');

	// listen to events...
	mc.on("swipeleft swiperight", function (ev) {
	if(!swipeTriggered && noSwipe.length == 0){
		switch (ev.type) {
			case "swipeleft":
				swipeTriggered = noLeft.length === 0;
				// console.log(1,swipeTriggered)
				if (swipeTriggered) com.veeva.clm.nextSlide();
			break;
			case "swiperight":
				swipeTriggered = noRight.length === 0;
				// console.log(2,swipeTriggered)
				if (swipeTriggered) com.veeva.clm.prevSlide();
			break;
		}
	}
	});
});