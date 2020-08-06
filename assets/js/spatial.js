const Direction = {
	left: -1,
	right: 1,
	up: -1,
	down: 1
}
const scaleDownFactor = 0.3, // At maximum Z-distance, objects shrink to this much
	  maxFilter = 20,	// The maximum desaturation / fade applied to Oc, when they're at a distance
	  scaleDifferential = 1 - scaleDownFactor, // The scaling difference Oc undergoes
	  maxZ = 9; //Z values range from 0 - maxZ

// storing Oc's CSS transforms (so they can be overridden in JS)
var ocTransform = {
	rotateX: "-15deg",
	translateY: "-15px",
	scaleX: 1,
	scale: 1,
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

// Sets an object's position in a 3D cartesian plane, reading it's z attribute
function setPosition(element){
	let z = Number(element.getAttribute('z')),
		percentage = z / maxZ;
		scale = ((1 - percentage) * scaleDifferential) + scaleDownFactor;	// Current scaling to apply to Oc. Example: (1 - (0 / 9)) * 0.4 + 0.6 [for foreground]

	// Having Oc face the right way
	if(element.classList.contains('oc-left')){
		ocTransform.scaleX = -1;
	}else{
		ocTransform.scaleX = 1;
	}
	ocTransform.scale = scale;
	oc.style.transform = `scale(${ocTransform.scale}) scaleX(${ocTransform.scaleX}) rotateX(${ocTransform.rotateX}) translateY(${ocTransform.translateY})`;

	oc.style.top = 'auto';
	oc.style.bottom = (percentage * (document.querySelector('#land').clientHeight * 0.9));

	oc.style.filter = `invert(${maxFilter * percentage}%)`;
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