function worldGoBelow(){

	var p = document.getElementById("plate");
	var t = document.getElementById("tower");

	
	//t.classList.remove("return-above");
	// w.classList.add("below")
	//p.classList.remove("above")
	t.classList.add("stay-above");
	t.classList.remove("return-above");
	p.classList.add("below");
	p.classList.remove("above");
	
	
}

function worldGoAbove(){
	var p = document.getElementById("plate");
	var t = document.getElementById("tower");

	
	p.classList.remove("below");
	p.classList.add("above")
	t.classList.add("return-above");
	t.classList.remove("stay-above");


	//p.classList.add("above");
	//w.classList.remove("below");

	
	
	//t.classList.add("return-above");
	
}

document.addEventListener('keydown', function(event) {
    const key = event.key; 
    
    switch (key) {
	    case "ArrowLeft":
	    	
        break;
	    case "ArrowRight":
	    	
        break;
      case "ArrowDown":
      	worldGoBelow()
      	break;
      case "ArrowUp":
      	worldGoAbove()
      	break;
		}
});