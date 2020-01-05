


var oc = document.getElementById("oc");
oc.style.left = '1200px';

function createAttribute(element, name, value){
  var a = document.createAttribute(name);
  a.value = value;
  element.setAttributeNode(a);
}
createAttribute(oc,"dx",0);
createAttribute(oc,"speed",3);
createAttribute(oc,"pulling",false);







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
  const armPosition = getPosition(arms);
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
  var held;
  holdables.map(o => {
    if(intersects(targetX,targetY,o)){
      console.log("held " + o.id);
      held = o;
    }
  })

  hardpoints.map(o => {
    if(intersects(targetX,targetY,o)){
      oc.pulling = true;
    }
  })
  function shrink(){

    

    dArmWidth = maxArmLength / 8;
    if(held){
      const radAngle = degToRad(armAngle);
      dl = Math.cos(radAngle) * dArmWidth * -1;
      dt = Math.sin(radAngle) * dArmWidth * -1;
      const newLeft = parseInt(held.style.left,10) + dl ;
      const newTop = parseInt(held.style.top,10) + dt ;
      console.log(held.id,  dl,  dt, newLeft, newTop);

      held.style.left = newLeft;
      held.style.top = newTop;
    }


    armWidth = (armWidth - dArmWidth)
    arms.style.width = armWidth;
    if(armWidth > 5){
      window.setTimeout(shrink,50);
    }

  }

  function grow(){

    arms.style.width = armWidth;
    armWidth = (armWidth + (maxArmLength / 16))

    if(armWidth <= maxArmLength){
      window.setTimeout(grow,50);
    }
    else {

      window.setTimeout(shrink,200);
    }

  }
  
  grow();
  window.setTimeout(reverseStretch, 800);

}


function ocMoveLeft(oc){
  // var left = parseInt(oc.style.left,10);

	oc.classList.add('walk-movement');
  oc.classList.add('turn-around');
  
  
  oc.setAttribute("dx", parseInt(oc.getAttribute("speed"),10) * -1);

}

function ocMoveRight(oc){
	oc.classList.add('walk-movement');
  oc.classList.remove('turn-around');
  oc.setAttribute("dx", parseInt(oc.getAttribute("speed"),10));
  // var left = parseInt(oc.style.left,10);
  
}



var timer = setInterval(function() {
	const dl = parseInt(oc.getAttribute("dx"),10);
  const l = parseInt(oc.style.left, 10);
  const newLeft = safeX( l + dl );
  oc.style.left = newLeft; //+ "px";
  
  // clear the timer at 400px to stop the animation
  // if ( oc.style.left > getWidth() ) {
  //   clearInterval( timer );
  // }
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