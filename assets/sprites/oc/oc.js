const normalOCSpeed = 3;

// for future "shift mode" for running
//const fastOCSpeed = 9;


var oc = document.getElementById("oc");

oc.style.left = '1200px';

function createAttribute(element, name, value){
  var a = document.createAttribute(name);
  a.value = value;
  element.setAttributeNode(a);
}
createAttribute(oc,"dx",0);
createAttribute(oc,"speed",normalOCSpeed);
createAttribute(oc,"pulling",false);




function ocFacesLeft(){
  return oc.classList.contains("turn-around");
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
  const armPosition = getPosition(arms);
  armLeft = armPosition.left;
  armTop = armPosition.top;
  
  
  reachDx = targetX - armLeft;
  reachDy = targetY - armTop;
  adx = Math.abs(reachDx);
  ady = Math.abs(reachDy);
  maxArmLength = Math.sqrt(Math.pow(adx,2) + Math.pow(ady,2));

  
  const baseAngle = angle(armLeft,armTop, targetX, targetY);
  const armAngle = ocFacesLeft() ? safeDegree(180 - baseAngle) : baseAngle;


  const rotation = "rotate(" + armAngle + "deg)";
  arms.style.transform = rotation;
  arms.style.zIndex = 3000;
  var pickUp, putDown;
  holdables.map(e => {
    if (!!heldItem){
      putDown = e;
      oc.classList.remove('oc-carrying');
      heldItem = null;
    }else if(intersects(targetX,targetY,e)){
      pickUp = e;
    }

  })

  hardpoints.map(o => {
    if(intersects(targetX,targetY,o)){
      oc.pulling = true;
    }
  })

  
  const reachBackwards = Math.sign(baseAngle - 180);

  


  function shrink(){

    const dArmWidth = maxArmLength / 8;

    const pullDirection = reachBackwards * ocFacesLeft() ? Direction.right : Direction.left;
    moveElement(pickUp, armAngle, dArmWidth, pullDirection, Direction.up);

    

    armWidth = (armWidth - dArmWidth)
    arms.style.width = armWidth;
    if(armWidth > 5){
      window.setTimeout(shrink,50);
    }else{
      // Item has been pulled in, now we're carrying it around
      if(!!pickUp){
        heldItem = pickUp;
        oc.classList.add('oc-carrying');
      }
    }

  }

  function grow(){

    arms.style.width = armWidth;
    
    const dArmWidth = maxArmLength / 16;
    armWidth = armWidth + dArmWidth;


    const pushDirection = reachBackwards * ocFacesLeft() ? Direction.left : Direction.right;
    moveElement(putDown, armAngle, dArmWidth, pushDirection, Direction.down);

    if(armWidth <= maxArmLength){
      window.setTimeout(grow,50);
    }
    else {
      if(!!putDown && parseInt(putDown.style.top, 10) < 0 )
      {
        putDown.style.top = 0;
      }
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

  holdItem(heldItem);
  
  // clear the timer at 400px to stop the animation
  // if ( oc.style.left > getWidth() ) {
  //   clearInterval( timer );
  // }
}, 20);

function holdItem(item){
  if(!!item)
  {
    const ocRect = oc.getBoundingClientRect();
  item.style.top = oc
  if(oc.classList.contains('turn-around')){
    item.style.left = parseInt(oc.style.left, 10) - ocRect.width;//item.getBoundingClientRect().width + 90;
  }else{
    item.style.left = parseInt(oc.style.left, 10) + ocRect.width;
  }
  }
}


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