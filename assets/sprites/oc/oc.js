

var oc = document.getElementById("oc"),
	d = {},
  dx = 0,
  skip = 3;



oc.style.left = '1200px';



function safeX(x) {  
		var w = window.width - 10000; //2800
    var leftEdge = 950

    return x < leftEdge ? leftEdge : x > w ? w : x;
}



function ocMoveLeft(oc){
  var left = parseInt(oc.style.left,10);

	oc.classList.add('walk-movement');
  oc.classList.add('turn-around');
  dx = skip * -1;

}

function ocMoveRight(oc){
	oc.classList.add('walk-movement');
  oc.classList.remove('turn-around');
  dx = skip;
  var left = parseInt(oc.style.left,10);
  
}



var timer = setInterval(function() {
	
  oc.style.left = safeX(parseInt(oc.style.left, 10) + dx) //+ "px";
  
  // clear the timer at 400px to stop the animation
  if ( oc.style.left > getWidth() ) {
    clearInterval( timer );
  }
}, 20);


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
    oc.classList.remove("oc-stretch");
  }
  window.setTimeout(endTransition, 800);
}