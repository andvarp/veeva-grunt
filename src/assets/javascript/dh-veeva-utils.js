// This is a collection of utility functions and wrappers for the Veeva API.
;(function(){
	
	var DHVU = {
		
		slideMap: undefined,

		goToSlide: function(id) {
				if (this.slideMap.hasOwnProperty(id)) {
					console.log('GoToSlide =>', this.slideMap[id].km,this.slideMap[id].pres);
					com.veeva.clm.gotoSlideV2(this.slideMap[id].km, this.slideMap[id].pres);
				}
		},
	}
		
	window.DHVU = DHVU || {};
})();
