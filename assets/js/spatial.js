function intersects(x,y,element){
	pos = getPosition(element);
	l = pos.left;
	r = pos.left + element.clientWidth;
	t = pos.top;
	b = pos.top + element.clientHeight;

	return l < x 
		&& x < r 
		&& t < y 
		&& y < b;
}

function getPosition(element) {
  var rect = element && element.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return rect && { 
  	top: rect.top + scrollTop, 
  	left: rect.left + scrollLeft 
  }
}



function safeX(x) {  
		var w = window.width - 10000; //2800
    var leftEdge = 950

    return x < leftEdge ? leftEdge : x > w ? w : x;
}


function angle(cx, cy, ex, ey) {
  const dy = ey - cy;
  const dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

function degToRad(angle){
	return angle / (108 /Math.PI);
}

var holdables = [];
var hardpoints = [];
