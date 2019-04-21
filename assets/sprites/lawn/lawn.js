
function getRandLawnURL(){
	return "/sprites/lawn/grass/grass-patch-" + getRandLawnNumber() + ".png"
}
function getRandStarterLawnElementID(){
	return "grass-patch-" + getRandLawnNumber(3) 
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



function getLawnPatchesAtPosition(ocPosition, walkLine, cellSize, columns, lawn, manipulate){
	const row = walkLine / cellSize
	const column = ocPosition / cellSize
	const index = Math.floor((row * columns) + column -55)
	
	var patches = []
	for (r = -1; r < 2; r++){
		for (c = -1; c < 2; c++){
			var i = index + (r*columns) + c

			if(lawn[i]){
				patches.push(lawn[i])	
				if(manipulate) manipulate(lawn[i])	
			}
			
			
		}
	}
	return patches

}

function rustlePatch(patch){
	const url = "url(" + getRandLawnURL() + ")"
	const rustleWindow = 40
	if(patch){
		setTimeout((u)=>{patch.style.backgroundImage=u}, Math.floor(Math.random() * rustleWindow), url)
		setTimeout((u)=>{patch.style.backgroundImage=u}, Math.floor(Math.random() * rustleWindow), url)
		setTimeout((u)=>{patch.style.backgroundImage=u}, Math.floor(Math.random() * rustleWindow), url)
	}
}


function placeGrassPatch(left,top,z,range,horizon,bottom){
	const absoluteRange = bottom-horizon

	
	var template = document.getElementById(getRandStarterLawnElementID());
	
	var patch = template.cloneNode(true);
	patch.style.left = Math.random() * cellSize + left
	var grassTop = Math.random() * cellSize + top
	patch.style.top = grassTop
	const percentOfRange = (grassTop - horizon) / absoluteRange 
	patch.style.opacity = percentOfRange * 1.2

	patch.style.zIndex = z 

	var target = document.getElementById("lawn")
	const rustleWindow = 1000 * 60 * 5
	const url = "url(" + getRandLawnURL() + ")"
	setInterval((u)=>{patch.style.backgroundImage=u}, Math.floor(Math.random() * rustleWindow), url)
	target.appendChild(patch);
	
	return patch
}



var grassTemplate 
const maxWidth = getWidth();
const bottom = getHeight();
const horizon = 440
const walkLine = 718
var range = bottom - horizon
const cellSize = 15
const columns = maxWidth / cellSize
const topRows = range / cellSize
const lawnZ = 1
var lawn = []
var patch 


for(r=0; r < topRows; r++){
	rowY = horizon + (r * cellSize)
	for(c=0; c < columns; c++){
		
		patch = placeGrassPatch(c * cellSize, rowY, lawnZ, range, horizon, bottom)
		lawn.push(patch)

	}
}




