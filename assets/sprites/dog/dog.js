var objectX 
var dog = document.getElementById("dog")

let dogData = items.filter(item => item.name === "dog")[0];

// dog.style.bottom = '500px';
dog.style.left = `${dogData.position.x}px`;
dog.setAttribute('z', dogData.position.z);
setPosition(dog);
holdables.push(dog);

function dogWatch(object){
	if(!object) return



	setInterval(function() {
		objectX = parseInt(object.style.left,10);

	}, 100);
}


function dogIsNearObject(){
	const dogloc = dogX();
	const isNear = Math.abs(objectX - dogloc) < 500 && zDistance() < 4;

	return isNear
}

function dogIsReallyNearObject(){
	const dogloc = dogX()
	const isNear = Math.abs(objectX - dogloc) < 200 && zDistance() < 1;
	return isNear
}

function dogIsReallyReallyNearObject(){
	const dogloc = dogX()
	const isNear = Math.abs(objectX - dogloc) < 100
	return isNear
}

function zDistance(){
	return Math.abs(parseInt(dog.getAttribute('z')) - parseInt(oc.getAttribute('z')));
}

function dogX(){
	if(!dog) return
	var style = window.getComputedStyle(dog, null);
	return parseInt(style.left,10);
}
function switchWag(newWag){

	newWag == "dog-wag" ? null : dog.classList.remove('dog-wag');
	newWag == "dog-wag-fast" ? null : dog.classList.remove('dog-wag-fast');
	newWag == "dog-wag-very-fast" ? null : dog.classList.remove('dog-wag-very-fast');
	newWag ? dog.classList.add(newWag) : null;
}
//dog will wag when object is near
var timer = setInterval(function() {
	
	if(dogIsReallyReallyNearObject()){
  	switchWag('dog-wag-very-fast');
	}
	else if(dogIsReallyNearObject()){
		switchWag('dog-wag-fast');
	}
	else if(dogIsNearObject()){
		switchWag('dog-wag');
	}
	else {
		switchWag()
	}
}, 100);



var oc = document.getElementById("oc");

dogWatch(oc);