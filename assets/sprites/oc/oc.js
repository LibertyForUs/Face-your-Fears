

var oc = document.getElementById("oc"),
	d = {},
  dx = 0,
  skip = 3;



oc.style.left = 200;



function safeX(x) {  
		var w = window.innerWidth - 100;
    return x < 0 ? 0 : x > w ? w : x;
}



function ocMoveLeft(oc){
  var left = parseInt(oc.style.left,10);

  getLawnPatchesAtPosition(left, walkLine - horizon, cellSize, columns, lawn, rustlePatch)

	
	oc.classList.add('walk-movement');
  oc.classList.add('turn-around');
  dx = skip * -1;

}

function ocMoveRight(oc){
	oc.classList.add('walk-movement');
  oc.classList.remove('turn-around');
  dx = skip;
  var left = parseInt(oc.style.left,10);
  getLawnPatchesAtPosition(left, walkLine - horizon, cellSize, columns, lawn, rustlePatch)
}



var timer = setInterval(function() {
	
  oc.style.left = safeX(parseInt(oc.style.left, 10) + dx) //+ "px";
  
  // clear the timer at 400px to stop the animation
  if ( oc.style.left > 400 ) {
    clearInterval( timer );
  }
}, 20);