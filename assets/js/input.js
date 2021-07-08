var isMouseDown = false;
	directionKeyCodes = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'a', 's', 'd', 'w'],
	pressedDirectionalKeys = []; // handling multiple simultaneous direction keys

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
	oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');
	oc.classList.add('oc-left');
	transformDefaults.scaleX = -1;
	
  }else if(x > getPosition(oc).left + oc.clientWidth){
	oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');
	oc.classList.add('oc-right');
	transformDefaults.scaleX = 1;
  }
  setPosition(oc);
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
	oc.setAttribute("dx", 0);
	oc.setAttribute("dz", 0);
 
}, false);




document.addEventListener('keydown', function(event) {
	
	if(event.repeat) return;// preventing keydown from triggering multiple events

	if(directionKeyCodes.includes(event.key)){
		pressedDirectionalKeys.push(event.key);
	}
	
	const plate = document.querySelector('.plate'); // Plate's classList tells us the world state (.shifting, .above or .below classes)
	
	switch (event.key) {
		case "ArrowLeft":
		case "a":
			ocMoveLeft(event);
		break;
		case "ArrowRight":
		case "d":
			ocMoveRight(event);
		break;
		case "ArrowDown":
		case "s":
			ocMoveIn(event);
		break;
		case "ArrowUp":
		case 'w':
			ocMoveOut(event);
		break;
		case "Esc":
		case "Escape":
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

	if( directionKeyCodes.includes(event.key) && 
		pressedDirectionalKeys.includes(event.key) ){
		
		// Preventing an animation stop, if multiple movement keys are pressed
		var keycodeIndex = pressedDirectionalKeys.indexOf(event.key);

		if(keycodeIndex !== -1){
			pressedDirectionalKeys.splice(keycodeIndex, 1);

			// If we're not moving in multiple directions, the animation .moving class is removed
			if(pressedDirectionalKeys.length > 0){
				
				let lastMovementAnimation = pressedDirectionalKeys[ pressedDirectionalKeys.length - 1 ];
				oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');

				switch (lastMovementAnimation) {
					case "ArrowLeft":
					case "a":
						oc.classList.add('oc-left');
					break;
					case "ArrowRight":
					case "d":
						oc.classList.add('oc-right');
					break;
					case "ArrowDown":
					case "s":
						oc.classList.add('oc-forward');
					break;
					case "ArrowUp":
					case 'w':
						oc.classList.add('oc-back');
					break;
				}
			}else{
				document.getElementById("oc").classList.remove('moving');
			}
		}

		// Stopping X or Z-axis movement depending on which set of keys were released
		if( ['ArrowRight', 'ArrowLeft', 'a', 'd'].includes(event.key)  ){
			oc.setAttribute("dx", 0);
		}else if( ['ArrowUp', 'ArrowDown', 'w', 's'].includes(event.key)){
			oc.setAttribute("dz", 0);
		}
	}
});

