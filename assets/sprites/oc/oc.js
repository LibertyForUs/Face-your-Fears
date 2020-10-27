var oc = document.getElementById("oc"),
    land = document.getElementById("land"),
    background = document.querySelector('.background'),
    foreground = document.querySelector('#lawn'),
    midwayPoint = window.innerWidth / 2, // Used to determine whether Oc or the background, should move. 1942;
    landXPosition = 0,
    parallaxOffset = 700;

const normalOCSpeed = 3,
      ocLeftOffset = 783,   // Qasim: Oc at left:0 doesn't align with the left of the screen (I don't know why, yet - will look into it further). This is their left offset
      landLeftOffset = 740,
      maxLandLeft = -(land.clientWidth - window.innerWidth - landLeftOffset),
      landTraverseDistance = landLeftOffset - maxLandLeft,
      ocWidth = oc.clientWidth;   // Initial Oc width

// for future "shift mode" for running
//const fastOCSpeed = 9;

oc.style.left = '1200px';
land.style.left = `${landLeftOffset}px`;
oc.classList.add('oc-right');

function createAttribute(element, name, value){
  var a = document.createAttribute(name);
  a.value = value;
  element.setAttributeNode(a);
}
createAttribute(oc,"dx",0);
createAttribute(oc,"dz",0);

createAttribute(oc,"z",3);
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
  
  let arms = document.createElement("DIV"),
      ocScale = (oc.getBoundingClientRect().width / oc.clientWidth), // how much is Oc scaled down currently. Effects arm stretch
      armScaledWidth = 10 * ocScale;
  
  
  arms.classList.add('arms');
  arms.classList.add("oc-arms-grow");

  //arms.classList.add("triangle-right");
  arms.style.width = armScaledWidth;
  // arms.style.left = oc.clientWidth / 2;
  // arms.style.bottom = oc.getBoundingClientRect().height  * .62;
  oc.appendChild(arms);

  function endTransition(){
    oc.classList.remove("oc-reverse-stretch");
    if(!!pickUp)
      holdItem(pickUp);
    
    if(oc.hasChildNodes())
      oc.removeChild(arms);
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

    maxArmLength *= (1/ocScale); // accounting for oc's current scale


  const baseAngle = angle(armLeft,armTop, targetX, targetY);
  
  var armAngle = ocFacesLeft() ? safeDegree(180 - baseAngle) : baseAngle;


  const rotation = `rotate(${armAngle}deg)`;
  arms.style.transform = rotation;
  arms.style.zIndex = 3000;

  var pickUp, putDown;
  holdables.map(e => {
    if (!!heldItem){
      putDown = heldItem;
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
        items.find(element => element.item === heldItem).isHeld = true;
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
    const dArmWidth = maxArmLength / 8;
    armWidth = armWidth + dArmWidth;

    arms.style.width = armWidth;

    // Oc drops objects above their height, or at their own height - not below
    if(!!putDown){

      if(targetY > getPosition(arms).bottom){
        // Placing picked object on the same Z-axis as Oc
        armAngle = 0;
        arms.style.transform = `rotate(${armAngle}deg)`;
        maxArmLength = Math.sqrt(Math.pow( (targetX - getPosition(arms).left), 2)); // Calculating distance for X-axis stretch (the Y remains the same as Oc)
      }

      moveElement(putDown, armAngle, dArmWidth, pushDirection, Direction.down, true);
      
    }else{
      // Reaching out to grab the object

    }
    

    if(armWidth <= maxArmLength){
      window.setTimeout(grow,50);
    }else {
      // If an item is dropped in the sky, it's set down on the horizon instead
      if(!!putDown){
        if(parseInt(putDown.style.bottom, 10) > parseInt(oc.style.bottom)){
          // Umbrella animation, if the putDown object is our beloved dog
          if(putDown.classList.contains('dog')){
            putDown.classList.add('dog-umbrella');
            putDown.style.transform = `scale(${transformDefaults.scale}) rotateX(${transformDefaults.rotateX}) translateY(${transformDefaults.translateY}) translateZ(50px)`;
            let umbrellaFloatSpeed = 4,
                umbrellaCloseDistance = 10; // dog umbrella animation changes 


            function dogFloatsDown(){
              if( parseInt(putDown.style.bottom) + umbrellaFloatSpeed > parseInt(oc.style.bottom) + umbrellaCloseDistance ){
                putDown.style.bottom = parseInt(putDown.style.bottom) - umbrellaFloatSpeed;
                requestAnimationFrame(dogFloatsDown);
              }else{
                putDown.style.bottom = oc.style.bottom;
                putDown.classList.remove('dog-umbrella');

                putDown.style.transform = putDown.style.transform.split(' translateZ')[0] + ' translateZ(1px)'; // Altering the Z translation, to render tufts of grass in the foreground
              }
            }
            
            dogFloatsDown();

          }else{
            setPosition(putDown);
          } 
        }

        // Updating item position in items[]. Used for parrallax positioning
        items.find(element => element.item === putDown).position = {
          x: parseInt(putDown.style.left) - landXPosition, 
          z: putDown.getAttribute('z')
        }
        items.find(element => element.item === putDown).isHeld = false;

      }

      window.setTimeout(shrink,200);
    }
  }

  // putDown object gets aligned with Oc's arms - arms are taller for the reach animation
  if(!!putDown){
    putDown.style.left = parseInt(oc.style.left) - (putDown.getBoundingClientRect().width / 2);
    putDown.style.bottom = parseInt(oc.style.bottom) + (oc.getBoundingClientRect().height / 2);
  }
  
  grow();
  window.setTimeout(reverseStretch, 800);

} // ocReach() ENDs


function ocMoveLeft(event){
  if(event.repeat) return; // prevent repeat events, movement occurs until key is lifted

  if(!oc.classList.contains('oc-stretch') && !oc.classList.contains('oc-reverse-stretch')){ 
    oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');
    oc.classList.add('oc-left', 'moving');
    oc.setAttribute("dx", parseInt(oc.getAttribute("speed"),10) * -1);
  }
}

function ocMoveRight(event){
  if(event.repeat) return; 

  if(!oc.classList.contains('oc-stretch') && !oc.classList.contains('oc-reverse-stretch')){
    oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');
    oc.classList.add('oc-right', 'moving');
    oc.setAttribute("dx", parseInt(oc.getAttribute("speed"),10));
  }
}

// moves Oc towards the horizon
function ocMoveOut(event){
  if(event.repeat) return;// prevent repeat events, movement occurs until key is lifted

  if(!oc.classList.contains('oc-stretch') && !oc.classList.contains('oc-reverse-stretch') ){
    oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');
    oc.classList.add('oc-back', 'moving');
    oc.setAttribute("dz", parseInt(oc.getAttribute("speed"),10) * 0.015);
  }
}

// moves Oc closer to the 4th wall
function ocMoveIn(event){
  if(event.repeat) return; 

  if(!oc.classList.contains('oc-stretch') && !oc.classList.contains('oc-reverse-stretch')){
    oc.classList.remove('oc-left', 'oc-right', 'oc-forward', 'oc-back');
    oc.classList.add('oc-forward', 'moving');
    oc.setAttribute("dz", parseInt(oc.getAttribute("speed"),10) * -0.015);
  }
}

//   let zVal = Number(oc.getAttribute('z')),
    //       updatedZ = zVal - (normalOCSpeed * 0.015);

    //   oc.setAttribute('z', Math.max( updatedZ, 0));
    //   setPosition(oc);

// Stopping movement beyond the fence & azimuth
// let fence = items.find(item => item.name === "fence");
    
// var ceiling = (fence === undefined ? 550 : parseInt(fence.item.style.bottom));
// var upKeyPressed = true;
// function moveOcUp(){
//   if(parseInt(oc.style.bottom) < ceiling){

var timer = setInterval(function() {
  if(oc.classList.contains('moving')){
 
    const dl = Number(oc.getAttribute("dx")),
          dz = Number(oc.getAttribute('dz')),
          l = parseInt(oc.style.left, 10),  //parseInt removes (px), but Number() gives us decimal, needed for minute Z movement
          z = Number(oc.getAttribute('z')),
          newLeft = l + dl,
          newZ = z + dz,
          landLeft = parseInt(land.style.left);


    oc.setAttribute('z', 
      Math.min(maxZ, 
                Math.max(newZ, 0)
              ));
    setPosition(oc);

    // Ensuring that Oc is within the bounds of the _world_
    let isOcAtLeftEdge = (newLeft <= ocLeftOffset),
        isOcAtRightEdge = (newLeft >= (land.clientWidth - ocLeftOffset - oc.clientWidth) ); 
    
    debugger;
    if(!isOcAtLeftEdge && !isOcAtRightEdge){

      // let colliding = false;
      // // Detecting if we're about to collide with an object
      // for(let i = 0; i < items.length; i++){
      //   if(items[i].collides){
      //     let item = items[i],
      //         itemElement = item.item,
      //         // ocLeft = Number(oc.style.left),
      //         itemLeft = Number(itemElement.style.left),
      //         ocRect = oc.getBoundingClientRect(),
      //         itemRect = itemElement.getBoundingClientRect(),
      //         verticalSpacing = 100;
              

      //     // if( !(
      //     //   ( (ocRect.bottom - verticalSpacing) < (itemRect.bottom - verticalSpacing) ) || 
      //     //   ( ())
      //     // )
          

      //     if(item.name === "dog"){
      //       if(isColliding(oc, itemElement)){
      //         debugger;
      //         colliding = true;
      //         break;
      //       }
      //     }
      //   }
      // }

      // if(colliding){
      //   debugger;
      //   return;
      // }
      // debugger;

      // Moving Oc, on the left and rightmost areas of #land
      if( (landLeft >= landLeftOffset && (newLeft - ocLeftOffset + oc.clientWidth) < midwayPoint) || 
          (landLeft <= -(land.clientWidth - window.innerWidth - landLeftOffset) && ((newLeft - ocLeftOffset + oc.clientWidth) > midwayPoint)) ){
      // if( () || (parseInt(land.style.left) <= ) ){
        oc.style.left = newLeft; //+ "px";
      }else{
        // Moving the background
        const landMovementRatio = -(parseInt(land.style.left) - landLeftOffset) / landTraverseDistance;

        landXPosition += (dl * -1);
        land.style.left = landLeftOffset + landXPosition;
        // foreground.style.left = landXPosition;
        background.style.left = (parallaxOffset * landMovementRatio);

        items.forEach(object => {
          if(!object.isHeld){
            // Fixed position objects (like the fence) don't have parrallax movement
            
            if(object.fixed){
              object.item.style.left = object.position.x + landXPosition;
            }else{ 
              let objZPosRatio = 1 - (Number(object.item.getAttribute('z')) / 9);
              object.item.style.left = object.position.x + landXPosition - ((parallaxOffset * landMovementRatio) * objZPosRatio);
            }
          }
        })
      }

      if(!!heldItem){
        holdItem(heldItem);
      }

    }else{
      // Updating levels when Oc moves to the screen edge
      oc.classList.remove('moving');

      if(currentLevel > 0){ // sanity check, ensuring we have levels. Invalid currentLevel values become '0'
        
        let targetLevel = currentLevel;
        
        if(isOcAtLeftEdge){
          targetLevel--;
        }else if(isOcAtRightEdge){
          targetLevel++;
        }
        
        if(targetLevel > 0 && targetLevel <= numLevels){
          window.location = `/level/${targetLevel}`;
        }

      }
    }

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
  setPosition(item);
  item.style.transform = item.style.transform.split(' translateZ')[0] + ' translateZ(15px)'; // Prevents tufts of grass from showing above the item
  item.style.bottom = ocBottom + (ocRect.height / 2) - (itemRect.height / 2);
  
  if(oc.classList.contains('oc-left')){
    item.style.left = ocLeft + scaledOCSpacing - (itemRect.width / 2) - scaledItemSpacing;
  }else if(oc.classList.contains('oc-right')){
    item.style.left = ocScaledLeft + oc.clientWidth - scaledItemSpacing;
  }else if(oc.classList.contains('oc-back')){
    item.style.left = ocCenter;
    // item.style.left = ocLeft - scaledItemSpacing;
  }else if(oc.classList.contains('oc-forward')){
    item.style.left = ocCenter;
    item.style.transform = item.style.transform.split(' translateZ')[0] + ' translateZ(25px)'; // Renders carried object in front of Oc
    // debugger;
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