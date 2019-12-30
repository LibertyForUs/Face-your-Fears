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
