(function(){
	
	function $( id ){
		return document.getElementById( id );
	}
	function getStyle( el, prop ){
		var s = window.getComputedStyle( el, null );
		return s.getPropertyValue( prop );
	}

	window.onload = function(){
		var modal = $('modal01');
		var w = parseInt( getStyle( modal, 'width') );
		var h = parseInt( getStyle( modal, 'height') );
		modal.style.marginLeft = -(w/2)+'px';
		modal.style.top = ~~((window.innerHeight-h)/2)+'px';





	}

})();