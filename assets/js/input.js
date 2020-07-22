var isMouseDown = false;

document.ontouchmove = function(event){
  event.preventDefault();
}
document.ontouchend = (e) => {
  e.preventDefault();
};
window.addEventListener('mousedown', e => {
  isMouseDown = true;
  const x = e.clientX;
  const y = e.clientY;
  
  if(x < getPosition(oc).left){
	  oc.classList.add('turn-around');
  }else if(x > getPosition(oc).left + oc.clientWidth){
	oc.classList.remove('turn-around');
  }
  ocReach(x,y);

});

window.addEventListener('mouseup', e => {
	isMouseDown = false;
})

window.addEventListener('touchstart', function onFirstTouch(event) {
	var oc = document.getElementById("oc");

	var ocStyle = window.getComputedStyle(oc, null);
	var ocX = parseInt(ocStyle.left,10);
	var ocY = parseInt(ocStyle.top,10);
	var ocH = parseInt(ocStyle.height,10);
	var firstTouchX = event.touches[0].screenX;
	var firstTouchY = event.touches[0].screenY;
	var deltaX = firstTouchX - ocX - 150;
	var deltaY = firstTouchY - ocY;
	var touchIsBelow = deltaY - ocH > 0;

	if (deltaX < 0){
		ocMoveLeft(oc);
	}
  else if(deltaX > 0){
  	ocMoveRight(oc)
  }

  if(touchIsBelow){
  	worldGoBelow();
  }
  else{
  	worldGoAbove();
  }


  
  
  // document.getElementById("messages").innerHTML =  delta;
 
}, false);


window.addEventListener('touchend', function onFirstTouch(event) {
  document.getElementById("oc").classList.remove('walk-movement');
	oc.setAttribute("dx",0);
 
}, false);




document.addEventListener('keydown', function(event) {
	const key = event.key, // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
		  plate = document.querySelector('.plate'); // Plate's classList tells us the world state (.shifting, .above or .below classes)
	
    switch (key) {
	    case "ArrowLeft":
		case "a":
	    	ocMoveLeft(oc)
        break;
	    case "ArrowRight":
		case "d":
	    	ocMoveRight(oc)
        break;
	  case "ArrowDown":
	  case "s":
      	worldGoBelow()
      	break;
      case "ArrowUp":
	  case 'w':
      	worldGoAbove()
      	break;
      case "Esc":
      case "Escape":
      	ocStretch()
		  break;
	  case " ":
		if(!plate.classList.contains('shifting')){
			if(plate.classList.contains('above')){
				worldGoBelow();
			}else{
				worldGoAbove();
			}
		}
	  break;
	}
});

document.addEventListener('keyup', function(event) {
	
	document.getElementById("oc").classList.remove('walk-movement');
	oc.setAttribute("dx", 0);
});

