function worldGoBelow(){
	

	var d = document.getElementById("dog");
	d.classList.add("stay-above")
	switchWag('dog-wag-fast');
	
	setTimeout((d)=>{
		switchWag('dog-wag');
	}, 800, d)
	setTimeout((d)=>{		
		switchWag();
	}, 1200, d)

	var s = document.getElementById("sun");
	s.classList.add("sun-rise")
	


	var g
	g = document.getElementById("grass-patch-01");
	g.classList.add("stay-above");
	g = document.getElementById("grass-patch-02");
	g.classList.add("stay-above");
	g = document.getElementById("grass-patch-03");
	g.classList.add("stay-above");

	var w = document.getElementById("world");
	w.classList.remove("above")
	w.classList.add("below")


}

function worldGoAbove(){

	var w = document.getElementById("world");
	w.classList.remove("below");
	w.classList.add("above");

	var d = document.getElementById("dog");
	d.classList.remove("stay-above");


	var s = document.getElementById("sun");
	s.classList.remove("sun-rise")


	
}