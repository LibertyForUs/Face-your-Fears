function getWidth() {
	  return Math.max(
	  
	    document.body.scrollWidth,
	    document.documentElement.scrollWidth,
	    document.body.offsetWidth,
	    document.documentElement.offsetWidth,
	    document.documentElement.clientWidth
	  );

	}

	function getHeight(){
		return Math.max( 
			document.body.scrollHeight, 
			document.body.offsetHeight, 
      document.documentElement.clientHeight, 
      document.documentElement.scrollHeight, 
      document.documentElement.offsetHeight );
	}

	document.addEventListener('DOMContentLoaded', (event) => {
		
		if( window.location.search.indexOf('testing') !== -1 ){
			let button = document.createElement('div');
			button.classList.add('testBtn');
			button.style.height = 100;
			button.style.width = 100;
			button.style.position = 'fixed';
			button.style.left = 1400;
			button.style.bottom = 200;
			button.style.backgroundColor = 'blue';
			button.style.zIndex = 9999;
			
			button.style.width = button.style.height = 100;

			document.querySelector('#above-ground').appendChild(button);
		}
	})
