function worldGoBelow(){
	var w = document.getElementById("world");
	w.classList.remove("above")
	w.classList.add("below")
}

function worldGoAbove(){
	var w = document.getElementById("world");
	w.classList.remove("below")
	w.classList.add("above")
}