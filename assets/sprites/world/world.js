

function worldGoBelow(){
	ocSink();

	if(!document.getElementsByClassName("shifting")[0] && !document.getElementsByClassName("below")[0]){
		var p = document.getElementById("plate");
		var d = document.getElementById("dog");
		
	
		
		

		d.classList.add("stay-above");
		d.classList.remove("return-above");
		p.classList.add("below");
		p.classList.remove("above");
	}	
	
}

function worldGoAbove(){
	ocRise();
	if(!document.getElementsByClassName("shifting")[0] && !document.getElementsByClassName("above")[0]){
		var p = document.getElementById("plate");
		var d = document.getElementById("dog");
		

		p.classList.add("shifting");
		setTimeout(function(){ p.classList.remove("shifting") }, 800);
		p.classList.remove("below");
		p.classList.add("above");
		d.classList.add("return-above");
		d.classList.remove("stay-above");

	}


	


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

