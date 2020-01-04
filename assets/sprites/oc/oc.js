

var oc = document.getElementById("oc"),
	d = {},
  dx = 0,
  skip = 3;



oc.style.left = '1200px';



function safeX(x) {  
		var w = window.width - 10000; //2800
    var leftEdge = 950

    return x < leftEdge ? leftEdge : x > w ? w : x;
}

function offset(el) {
  var rect = el.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: Math.floor(rect.top + scrollTop), left: Math.floor(rect.left + scrollLeft) }
}

function angle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}



function ocReach(targetX, targetY){
  oc.classList.add("oc-stretch");

 
  
  
  



  let arms = document.createElement("DIV");

  arms.classList.add("oc-arms-grow");

  //arms.classList.add("triangle-right");
  oc.appendChild(arms);

  function endTransition(){
    oc.classList.remove("oc-reverse-stretch");
    oc.removeChild(arms);

  }
  function reverseStretch(){
    oc.classList.remove("oc-stretch");
    oc.classList.add("oc-reverse-stretch");
    window.setTimeout(endTransition, 400);

  }
  var armWidth = 5;
  const armPosition = offset(arms);
  armLeft = armPosition.left;
  armTop = armPosition.top;
  
  
  reachDx = targetX - armLeft;
  reachDy = targetY - armTop;
  adx = Math.abs(reachDx);
  ady = Math.abs(reachDy);
  maxArmLength = Math.sqrt(Math.pow(adx,2) + Math.pow(ady,2));
  const armAngle = angle(armLeft,armTop, targetX, targetY);
  const rotation = "rotate(" + armAngle + "deg)";
  arms.style.transform = rotation;
  arms.style.zIndex = 3000;

  function shrink(){

    arms.style.width = armWidth;
    armWidth = armWidth - Math.floor(maxArmLength / 8)

    if(armWidth > 5){
      window.setTimeout(shrink,50);
    }

  }

  function grow(){

    arms.style.width = armWidth;
    armWidth = armWidth + Math.floor(maxArmLength / 16)

    if(armWidth < maxArmLength){
      window.setTimeout(grow,50);
    }
    else {
      shrink();
    }

  }
  
  grow();
  window.setTimeout(reverseStretch, 800);

}


function ocMoveLeft(oc){
  var left = parseInt(oc.style.left,10);

	oc.classList.add('walk-movement');
  oc.classList.add('turn-around');
  dx = skip * -1;

}

function ocMoveRight(oc){
	oc.classList.add('walk-movement');
  oc.classList.remove('turn-around');
  dx = skip;
  var left = parseInt(oc.style.left,10);
  
}



var timer = setInterval(function() {
	
  oc.style.left = safeX(parseInt(oc.style.left, 10) + dx) //+ "px";
  
  // clear the timer at 400px to stop the animation
  if ( oc.style.left > getWidth() ) {
    clearInterval( timer );
  }
}, 20);


function ocSink(){
  
  
  oc.classList.remove("oc-above");
  oc.classList.add("oc-sink");
  

  function endTransition(){
    
    oc.classList.remove("oc-sink");
    oc.classList.add("oc-below");
    
  }
  window.setTimeout(endTransition, 800);
}

function ocRise(){
  
  
  oc.classList.remove("oc-sink");
  oc.classList.remove("oc-below");
  oc.classList.add("oc-rise");
  

  function endTransition(){
    
    oc.classList.remove("oc-rise");
    oc.classList.add("oc-above");
  }
  window.setTimeout(endTransition, 800);
}


function ocStretch(){
  oc.classList.add("oc-stretch");
  
  function endTransition(){
    oc.classList.remove("oc-reverse-stretch");
  }

  function reverseStretch(){
    oc.classList.remove("oc-stretch");
    oc.classList.add("oc-reverse-stretch");
    window.setTimeout(endTransition, 400);

  }
  window.setTimeout(reverseStretch, 800);
}