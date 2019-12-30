
function getRandLawnURL(){
	//return "/sprites/lawn/grass/grass-patch-" + getRandLawnNumber() + ".png"
	return "/sprites/lawn/grass/grass-strip.png"
}
function getRandStarterLawnElementID(){
	//return "grass-patch-" + getRandLawnNumber(3) 
	return "grass-strip";
}
function getRandLawnNumber(limit){
	limit = limit < 10 ? limit : 10
	index = Math.ceil(
			Math.random() * limit
		)
	const num = index.toString()
		.padStart(2, '0')
	
	return num
}




function placeGrassPatch(left,top,z,range,horizon,bottom){
	const absoluteRange = bottom-horizon;
	const horizontalVariation = 20;
	const verticalVariation = 0;

	
	var template = document.getElementById(getRandStarterLawnElementID());

	
	var patch = template.cloneNode(true);

	patch.style.left = Math.random() * horizontalVariation + left
	var grassTop = Math.random() * verticalVariation + top
	patch.style.top = grassTop
	const percentOfRange = (grassTop - horizon) / absoluteRange 
	patch.style.opacity = percentOfRange * 4 + 0.1

	patch.style.zIndex = z 

	var target = document.getElementById("lawn")
	//const rustleWindow = 1000 * 60 * 5
	//const url = "url(" + getRandLawnURL() + ")"
	//setInterval((u)=>{patch.style.backgroundImage=u}, Math.floor(Math.random() * rustleWindow), url)
	target.appendChild(patch);
	
	return patch
}




//const maxWidth = getWidth() ;
const maxWidth = document.getElementById('universe').clientWidth;
const bottom = getHeight(); //* 1.4;
const horizon = -20 //440
var range = bottom - horizon - 500;

const cellSize = 790 //20
const cellWidth = 400;
const cellHeight = 22;
const density = 1;


const columns = maxWidth /1.3/ cellWidth 
const topRows = range / cellHeight 
const lawnZ = 1
var lawn = []
var patch 

var count = 0

for(r=0; r < topRows ; r++){
	rowY = horizon + (r * cellHeight / density)
	for(c=0.5 + (Math.random() * 0.5); c < columns; c++){
		
		
		patch = placeGrassPatch(c * cellSize, rowY, lawnZ, range, horizon, bottom)
		lawn.push(patch)
		count++;

	}
}
//console.log(count)




