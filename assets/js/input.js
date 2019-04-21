document.ontouchmove = function(event){
  event.preventDefault();
}
document.ontouchend = (e) => {
  e.preventDefault();
};


window.addEventListener('touchstart', function onFirstTouch(event) {
	var oc = document.getElementById("oc");
	var ocX = parseInt(oc.style.left,10);
	var firstTouchX = event.touches[0].screenX;
	var delta = firstTouchX - ocX - 150;
	if (delta < 0){
		moveLeft(oc);
	}
  else if(delta > 0){
  	moveRight(oc)
  }
  
  
  // document.getElementById("messages").innerHTML =  delta;
 
}, false);


window.addEventListener('touchend', function onFirstTouch(event) {
  document.getElementById("oc").classList.remove('walk-movement');
	dx = 0;
 
}, false);




document.addEventListener('keydown', function(event) {
    const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    
    switch (key) {
	    case "ArrowLeft":
	    	moveLeft(oc)
	    /*
        oc.classList.add('walk-movement');
        oc.classList.add('turn-around');
        dx = skip * -1;
*/
        
        break;
	    case "ArrowRight":
	    	moveRight(oc)
	    /*
        oc.classList.add('walk-movement');
        oc.classList.remove('turn-around');
        dx = skip;
        */
        
        break;

		}
});

document.addEventListener('keyup', function(event) {
	
	document.getElementById("oc").classList.remove('walk-movement');
	dx = 0;
});

