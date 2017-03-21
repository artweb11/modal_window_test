(function(){

	function load_json(file, callback) {   
	    var xobj = new XMLHttpRequest();
	        xobj.overrideMimeType("application/json");
	    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
	    xobj.onreadystatechange = function () {
	          if (xobj.readyState == 4 && xobj.status == "200") {
	            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
	            callback(xobj.responseText);
	          }
	    };
	    xobj.send(null);  
	 }
	
	function $( id ){
		return document.getElementById( id );
	}
	function getStyle( el, prop ){
		var s = window.getComputedStyle( el, null );
		return s.getPropertyValue( prop );
	}

	

	ModalControl = {
		init: function(){
			var w = parseInt( getStyle( ModalControl.modal, 'width') );
			var h = parseInt( getStyle( ModalControl.modal, 'height') );
			ModalControl.modal.style.marginLeft = -(w/2)+'px';
			ModalControl.modal.style.top = ~~((window.innerHeight-h)/2)+'px';

			$('cancel-btn').addEventListener('click', function( e ){
				e.preventDefault();

				ModalControl.close();
			}, false );
		},

		open: function( id ){
			ModalControl.modal = $(id);
			ModalControl.modal.style.display = 'block';
			ModalControl.init();
			ModalControl.modal.classList.add('opened');
			FormControl.init('modal_form');
		},
		close: function(){
			ModalControl.modal.classList.remove('opened');
			setTimeout(function(){
				ModalControl.modal.style.display = 'none';
				FormControl.reset();
			}, 500 );
		}
	}
	FormControl = {
		loaded: false,
		valid: false,
		fields: [],
		init: function( form_id ){
			FormControl.form = $(form_id);
			load_json('brands.json', function( res ){
				FormControl.brands = JSON.parse( res );
				FormControl.addBrandFunction();

				load_json('colors.json', function( res ){
					FormControl.colors = JSON.parse( res );
					FormControl.addColorsFunction();

					FormControl.loaded = true;
				});
			});
			FormControl.add_events();
		},

		addBrandFunction: function(){
			var buff = '<option value="">Select</option>';
			for( var i in FormControl.brands){
				buff += '<option value="'+i+'">'+FormControl.brands[i].title+'</option>';
			}
			$('input-make-brand').innerHTML = buff;
			$('input-make-brand').addEventListener('change', function(){
				if( this.value != '' ){
					$('brand-image').innerHTML = '<img src="'+FormControl.brands[this.value].img+'" width="40">';	
				} else {
					$('brand-image').innerHTML = '';
				}					
			},false );
		},
		addColorsFunction: function(){
			var buff = '<option value="">Select</option>';
			for( var i in FormControl.colors){
				buff += '<option value="'+i+'">'+FormControl.colors[i].colorName+'</option>';
			}
			$('input-color').innerHTML = buff;
			$('input-color').addEventListener('change', function(){
				if( this.value != '' ){
					$('color-visual').style.backgroundColor = FormControl.colors[this.value].hexValue;
				} else {
					$('color-visual').style.backgroundColor = 'transparent';	
				}
			},false );
		},

		add_events: function(){
			FormControl.form.querySelectorAll('.valid-required input, .valid-required select').forEach( function( el ){
				FormControl.fields[ el.name ] = false;
				el.addEventListener('keyup', FormControl.validators.valid_required, false );
				el.addEventListener('change', FormControl.validators.valid_required, false );
			});
			FormControl.form.querySelectorAll('.valid-number input').forEach( function( el ){
				FormControl.fields[ el.name ] = false;
				el.addEventListener('keyup', FormControl.validators.valid_numeric, false );
				el.addEventListener('change', FormControl.validators.valid_numeric, false );
			});
			FormControl.form.querySelectorAll('.valid-year input').forEach( function( el ){
				FormControl.fields[ el.name ] = false;
				el.addEventListener('keyup', FormControl.validators.valid_year, false );
				el.addEventListener('change', FormControl.validators.valid_year, false );
			});

			FormControl.form.addEventListener('submit', FormControl.submit, false );
		},

		remove_events: function(){
			FormControl.form.querySelectorAll('.valid-required input, .valid-required select').forEach( function( el ){
				el.removeEventListener('keyup', FormControl.validators.valid_required, false );
				el.removeEventListener('change', FormControl.validators.valid_required, false );
			});
			FormControl.form.querySelectorAll('.valid-number input').forEach( function( el ){
				el.removeEventListener('keyup', FormControl.validators.valid_numeric, false );
				el.removeEventListener('change', FormControl.validators.valid_numeric, false );
			});
			FormControl.form.querySelectorAll('.valid-year input').forEach( function( el ){
				el.removeEventListener('keyup', FormControl.validators.valid_year, false );
				el.removeEventListener('change', FormControl.validators.valid_year, false );
			});

			FormControl.form.removeEventListener('submit', FormControl.submit, false );
		},

		reset: function(){
			FormControl.remove_events();
			FormControl.form.reset();
			FormControl.form.querySelectorAll('.valid-required, .valid-number, .valid-year').forEach( function( el ){
				el.classList.remove('error');
				el.classList.remove('success');
			});
		},

		validate: function(){
			FormControl.valid = true;
			for( var i in FormControl.fields ){
				if( !FormControl.fields[i] ){
					FormControl.valid = false;
				}
			}
			if( FormControl.valid ){
				console.log('enable!');
				FormControl.form.querySelector('.btn.submit').disabled = false;
			} else {
				console.log('disable!');
				FormControl.form.querySelector('.btn.submit').disabled = true;
			}
		},
		submit: function( e ){
			e.preventDefault();
			if( FormControl.loaded ){
				FormControl.validate();
				if( FormControl.valid ){
					console.log('submitting');
					FormControl.reset();

					alert("Ajax form functionality here");
				}
			}			
		},
		validators: {
			valid_required: function(){
				var el = this;
				if( el.value.trim() != '' ){
					el.parentNode.classList.remove('error');
					el.parentNode.classList.add('success');
					FormControl.fields[ el.name ] = true;
				} else {					
					el.parentNode.classList.add('error');
					el.parentNode.classList.remove('success');
					FormControl.fields[ el.name ] = false;
				}
				FormControl.validate();
			},
			valid_numeric: function(){
				var el = this;
				if( /^\d+$/g.test( el.value ) ){
					el.parentNode.classList.remove('error');
					el.parentNode.classList.add('success');
					FormControl.fields[ el.name ] = true;
				} else {
					el.parentNode.classList.add('error');
					el.parentNode.classList.remove('success');
					FormControl.fields[ el.name ] = false;
				}
				FormControl.validate();
			},
			valid_year: function(){
				var el = this;
				if( /^\d{4,4}$/g.test( el.value ) ){
					el.parentNode.classList.remove('error');
					el.parentNode.classList.add('success');
					FormControl.fields[ el.name ] = true;
				} else {
					el.parentNode.classList.add('error');
					el.parentNode.classList.remove('success');
					FormControl.fields[ el.name ] = false;
				}
				FormControl.validate();
			}
		}
	}

	window.onload = function(){
		$('modal_open').addEventListener('click', function( e ){
			e.preventDefault();

			ModalControl.open('modal01');
		}, false );
	}

})();