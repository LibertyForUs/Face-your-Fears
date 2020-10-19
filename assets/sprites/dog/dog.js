var objectX,
	objectY;

function dogWatch(object){
	if(!object) return

	setInterval(function() {
		objectX = parseInt(object.style.left,10);
		objectY = parseInt(object.style.bottom, 10);
	}, 100);
}


function dogIsNearObject(dog){
	const dogXloc = dogX(dog),
		  dogYloc = dogY(dog);
	const isNear = Math.abs(objectX - dogXloc) < 500 && Math.abs(objectY - dogYloc) < 500;
	return isNear;
}

function dogIsReallyNearObject(dog){
	const dogXloc = dogX(dog),
		  dogYloc = dogY(dog);
	const isNear = Math.abs(objectX - dogXloc) < 200 && Math.abs(objectY - dogYloc) < 200;
	return isNear;
}

function dogIsReallyReallyNearObject(dog){
	const dogXloc = dogX(dog),
		  dogYloc = dogY(dog);
	const isNear = Math.abs(objectX - dogXloc) < 100 && Math.abs(objectY - dogYloc) < 100;
	return isNear;
}

function zDistance(dog){
	return Math.abs(parseInt(dog.getAttribute('z')) - parseInt(oc.getAttribute('z')));
}

function dogX(dog){
	if(!dog) return
	var style = window.getComputedStyle(dog, null);
	return parseInt(style.left,10);
}

function dogY(dog){
	if(!dog) return
	var style = window.getComputedStyle(dog, null);
	return parseInt(style.bottom,10);
}

function switchWag(dog, newWag){

	newWag == "dog-wag" ? null : dog.classList.remove('dog-wag');
	newWag == "dog-wag-fast" ? null : dog.classList.remove('dog-wag-fast');
	newWag == "dog-wag-very-fast" ? null : dog.classList.remove('dog-wag-very-fast');
	newWag ? dog.classList.add(newWag) : null;
}

// Waiting for dog data to load. And ensuring that the current map has the dog
function initialiseDog(){
	let dogs = document.querySelectorAll('.dog');
	debugger;
	if(dogs.length){
		var timer = setInterval(function() {
			debugger;
			dogs.forEach((dog) => {
				
				if(dogIsReallyReallyNearObject(dog)){
					switchWag(dog, 'dog-wag-very-fast');
				}
				else if(dogIsReallyNearObject(dog)){
					switchWag(dog, 'dog-wag-fast');
				}
				else if(dogIsNearObject(dog)){
					switchWag(dog, 'dog-wag');
				}
				else {
					switchWag(dog);
				}
			})		
		}, 100);
	}

	var oc = document.getElementById("oc");
	dogWatch(oc);
}