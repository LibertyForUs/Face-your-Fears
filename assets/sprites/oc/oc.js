const normalOCSpeed = 3;

// for future "shift mode" for running
//const fastOCSpeed = 9;


var oc = document.getElementById("oc");

oc.style.left = '1200px';

oc.classList.add('oc-right');

function createAttribute(element, name, value){
  var a = document.createAttribute(name);
  a.value = value;
  element.setAttributeNode(a);
}
createAttribute(oc,"dx",0);
createAttribute(oc,"dz",0);

createAttribute(oc,"z",2);
createAttribute(oc,"speed",normalOCSpeed);
createAttribute(oc,"pulling",false);

setPosition(oc); // Setting initial Z position


function ocFacesLeft(){
  return oc.classList.contains("oc-left");
}

// orients Oc towards the left or right.
// Explaination: We're setting css transforms in JS, to scale Oc for the Z axis.
// This means that the .turn-around classes transform: scalex(-1) no longer works
// css transforms don't stack, and all css transforms are overridden once a transform is set by JS
function ocFaceLeft(){
  oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');
  oc.classList.add("oc-left");
  setPosition(oc);
}

function ocFaceRight(){
  oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');
  oc.classList.add("oc-right");
  setPosition(oc);
}

function ocReach(targetX, targetY){

  oc.classList.add("oc-stretch");
  oc.classList.remove('walk-movement');
	oc.setAttribute("dx", 0);
  
  let arms = document.createElement("DIV");
  arms.classList.add('arms');
  arms.classList.add("oc-arms-grow");

  //arms.classList.add("triangle-right");
  oc.appendChild(arms);

  function endTransition(){
    oc.classList.remove("oc-reverse-stretch");
    if(oc.hasChildNodes(arms)){
      oc.removeChild(arms);
    }
  }

  function reverseStretch(){
    oc.classList.remove("oc-stretch");
    oc.classList.add("oc-reverse-stretch");
    window.setTimeout(endTransition, 400);
  }

  // If we're holding something, it's coordinates are matched with the extending arm (starts from OC's position)
  // if(!!heldItem){
  //   heldItem.style.left = oc.style.left;
  //   heldItem.style.bottom = (getPosition(oc).top - oc.clientHeight)
  // }

  var armWidth = 5;
  const armPosition = getPosition(arms);
  var armLeft = armPosition.left;
  var armTop = armPosition.top;
  
  var reachDx = targetX - armLeft,
      reachDy = targetY - armTop,
      adx = Math.abs(reachDx),
      ady = Math.abs(reachDy),
      maxArmLength = Math.sqrt(Math.pow(adx,2) + Math.pow(ady,2));

  
  const baseAngle = angle(armLeft,armTop, targetX, targetY);
  
  var armAngle = ocFacesLeft() ? safeDegree(180 - baseAngle) : baseAngle;


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

    armWidth = (armWidth - dArmWidth)
    arms.style.width = armWidth;

    if(!!pickUp){
      const pickupZ = Number(pickUp.getAttribute('z'));
      const zMovementIncrement = ((Number(oc.getAttribute('z')) - pickupZ) / 8);
      const pullDirection = reachBackwards * ocFacesLeft() ? Direction.right : Direction.left;
      pickUp.setAttribute('z', pickupZ + zMovementIncrement);
      moveElement(pickUp, armAngle, dArmWidth, pullDirection, Direction.up);

      var objOCDistance; // distance between OC and pickUp object's nearest side
      if(oc.classList.contains('oc-left')){
        objOCDistance = Math.abs((getPosition(pickUp).left + pickUp.clientWidth) - getPosition(oc).left);
      }else{
        objOCDistance = Math.abs(getPosition(pickUp).left - (getPosition(oc).left + oc.clientWidth));
      }

      // Distance from OC's side to the object
      if(objOCDistance <= pickUp.clientWidth){
        heldItem = pickUp;
        oc.classList.add('oc-carrying');
        heldItem.style.bottom = Number(oc.style.bottom.substr(0, oc.style.bottom.length - 2)) + (oc.clientHeight / 2) - (heldItem.clientHeight / 2);
        endTransition();
        holdItem(heldItem);
      }else{
        window.setTimeout(shrink,50);
      }
      
    }else{
      // No pickup, regular arm stretchy back
      if(armWidth > 5){
        window.setTimeout(shrink,50);  
      }
    }

  }

  function grow(){
    
    const pushDirection = reachBackwards * ocFacesLeft() ? Direction.left : Direction.right;
    
    // Oc drops objects above himself, or at his own level - not below
    if(!!putDown && targetY > getPosition(arms).bottom ){
      // Placing picked object on the same Z-axis as Oc
      armAngle = 0;
      arms.style.transform = `rotate(${armAngle}deg)`;
      maxArmLength = Math.sqrt(Math.pow( (targetX - getPosition(arms).left), 2)); // Calculating distance for X-axis stretch (the Y remains the same as Oc)
      
    }else{
      // Reaching out to grab the object

    }
    const dArmWidth = maxArmLength / 8;
    armWidth = armWidth + dArmWidth;

    arms.style.width = armWidth;

    
    moveElement(putDown, armAngle, dArmWidth, pushDirection, Direction.down);

    if(armWidth <= maxArmLength){
      window.setTimeout(grow,50);
    }else {
      // If an item is dropped in the sky, it's set down on the horizon instead
      if(!!putDown && parseInt(putDown.style.bottom, 10) > 690 ){
        putDown.style.bottom = 690;
      }

      window.setTimeout(shrink,200);
    }

  }

  
  grow();
  window.setTimeout(reverseStretch, 800);

}


function ocMoveLeft(oc){
  if(!oc.classList.contains('oc-stretch') && !oc.classList.contains('oc-reverse-stretch')){ 
    oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');
    oc.classList.add('oc-left', 'moving');
    setPosition(oc); // sets z-position & CSS transform
    oc.setAttribute("dx", parseInt(oc.getAttribute("speed"),10) * -1);
  }
}

function ocMoveRight(oc){
  if(!oc.classList.contains('oc-stretch') && !oc.classList.contains('oc-reverse-stretch')){
    oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');
    oc.classList.add('oc-right', 'moving');
    setPosition(oc);
    oc.setAttribute("dx", parseInt(oc.getAttribute("speed"),10));
    // var left = parseInt(oc.style.left,10);
  }
}

// moves Oc towards the horizon
function ocMoveOut(event){
  if(event.repeat) return;// prevent repeat events, movement occurs until key is lifted

  if(!oc.classList.contains('oc-stretch') && !oc.classList.contains('oc-reverse-stretch')){
    oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');
    oc.classList.add('oc-back', 'moving');
    
    var upKeyPressed = true;
    function moveOcUp(){
      let zVal = Number(oc.getAttribute('z')),
          updatedZ = zVal + (normalOCSpeed * 0.015);

      oc.setAttribute('z', Math.min( updatedZ, maxZ));
      setPosition(oc);

      if(upKeyPressed){
        window.requestAnimationFrame(moveOcUp);
      }
    }

    window.requestAnimationFrame(moveOcUp);
    window.addEventListener('keyup', keyUpHandler);

    function keyUpHandler(event) {
      if( ['w', 'ArrowUp'].includes( event.key) ){
        upKeyPressed = false;
        window.removeEventListener('keyup', keyUpHandler);
      }
    }

  }
}

// moves Oc closer to the 4th wall
function ocMoveIn(event){
  if(event.repeat) return; 

  if(!oc.classList.contains('oc-stretch') && !oc.classList.contains('oc-reverse-stretch')){
    oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');
    oc.classList.add('oc-forward', 'moving');
    
    var downKeyPressed = true;
    function moveOcUp(){
      let zVal = Number(oc.getAttribute('z')),
          updatedZ = zVal - (normalOCSpeed * 0.015);

      oc.setAttribute('z', Math.max( updatedZ, 0));
      setPosition(oc);
      // if(oc.classList.contains('oc-carrying'))
      //   setPosition(heldItem);
      
      if(downKeyPressed){
        window.requestAnimationFrame(moveOcUp);
      }
    }

    window.requestAnimationFrame(moveOcUp);
    window.addEventListener('keyup', keyUpHandler);

    function keyUpHandler(event) {
      if( ['s', 'ArrowDown'].includes( event.key) ){
        downKeyPressed = false;
        window.removeEventListener('keyup', keyUpHandler);
      }
    }

  }
}

// onFrame function for ocMoveIn() and ocMoveOut()
function depthMovementHandler(){

}


var timer = setInterval(function() {
  if(oc.classList.contains('moving')){
 
    const dl = parseInt(oc.getAttribute("dx"),10);
    const l = parseInt(oc.style.left, 10);
    const newLeft = safeX( l + dl );
    oc.style.left = newLeft; //+ "px";

    if(!!heldItem){
      holdItem(heldItem);
    }
  
  // clear the timer at 400px to stop the animation
  // if ( oc.style.left > getWidth() ) {
  //   clearInterval( timer );
  // }
  }
}, 20);

// ($0.clientWidth - ($0.clientWidth * 0.3)) / 2 
// Math.round(($0.offsetWidth - $0.getBoundingClientRect().width) / 2)
function holdItem(item){
  const ocRect = oc.getBoundingClientRect(),
        itemRect = item.getBoundingClientRect(),
        ocBottom = parseInt(oc.style.bottom, 10),  // Getting numerical pixel values, removing 'px' from style the string
        ocLeft = parseInt(oc.style.left, 10),      // CSS style's left value. When Oc is scaled, there is a gap on the left
        scaledOCSpacing = Math.round((oc.offsetWidth - ocRect.width) / 2),
        scaledItemSpacing = Math.round((item.offsetWidth - itemRect.width) / 2),
        ocScaledLeft = ocLeft - scaledOCSpacing, // when Oc is scaled, this gives the true left. offsetWidth is unscaled, ocRect is scaled
        ocCenter = ocLeft + (oc.clientWidth / 2) - (item.clientWidth / 2);
  
  item.setAttribute('z', oc.getAttribute('z'));

  if(oc.classList.contains('oc-left')){
    item.style.left = ocLeft + scaledOCSpacing - (itemRect.width / 2) - scaledItemSpacing;
  }else if(oc.classList.contains('oc-right')){
    item.style.left = ocScaledLeft + oc.clientWidth - scaledItemSpacing;
  }else if(oc.classList.contains('oc-back')){
    item.style.left = ocCenter;
    // item.style.left = ocLeft - scaledItemSpacing;
  }else if(oc.classList.contains('oc-forward')){
    item.style.left = ocCenter;
  }

  setPosition(item);
  item.style.bottom = ocBottom + (ocRect.height / 2) - (itemRect.height / 2);
  
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