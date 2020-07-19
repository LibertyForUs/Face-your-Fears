const Direction = {
	left: -1,
	right: 1,
	up: -1,
	down: 1
}
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

function moveElement(element, angle, distance, directionX, directionY){
  if(element){
    const radAngle = degToRad(angle);
    const dl = Math.cos(radAngle) * distance * directionX;
    const dt = Math.sin(radAngle) * distance * directionY;
    const newLeft = parseInt(element.style.left,10) + dl ;
    const newTop = parseInt(element.style.top,10) + dt ;

    element.style.left = newLeft;
    element.style.top = newTop;
  }

}

function safeDegree(angle){
	if(angle < 0){
		angle += 360;
	}
	if(angle > 360){
		angle -= 360;
	}
	if (angle < 0 || angle > 360){
		angle = safeDegree(angle);
	}
	return angle;
}

function angle(cx, cy, ex, ey) {
  const dy = ey - cy;
  const dx = ex - cx;
  const atan = Math.atan2(dy, dx); // range (-PI, PI]
  const theta = radToDeg(atan); // rads to degs, range (-180, 180]
  return safeDegree(theta);
}
function radToDeg(angle){
	return angle * (180 / Math.PI);
}
function degToRad(angle){
	return angle / (180 /Math.PI);
}



var holdables = [];
var hardpoints = [];
var heldItem;