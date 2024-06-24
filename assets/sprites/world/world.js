

function worldGoBelow(){
	if(!Boolean(heldItem) && !oc.classList.contains('oc-stretch') && !oc.classList.contains('oc-reverse-stretch')){

		ocSink();
		

		if(!document.getElementsByClassName("shifting")[0] && !document.getElementsByClassName("below")[0]){
			var p = document.getElementById("plate");
			var d = document.getElementById("dog");

			p.classList.add("shifting");
			setTimeout(function(){ 
				p.classList.remove("shifting");
				document.querySelector('.below-ground').append(oc);
				setPosition(oc);
			}, 800);

			// d.classList.add("stay-above");
			// d.classList.remove("return-above");
			p.classList.add("below");
			p.classList.remove("above");
			debugger;
			items.forEach(object => {
				if(object.aboveGround)
					object.item.classList.add('stay-above');
			})
		}	

	}
	
}

function worldGoAbove(){
	if(!document.getElementsByClassName("shifting")[0] && !document.getElementsByClassName("above")[0]){
		ocRise();
		var p = document.getElementById("plate");
		var d = document.getElementById("dog");
		

		p.classList.add("shifting");
		setTimeout(function(){ 
			p.classList.remove("shifting"); 
			document.querySelector('.above-ground').append(oc);
			setPosition(oc);
		}, 800);
		p.classList.remove("below");
		p.classList.add("above");
		// d.classList.add("return-above");
		// setTimeout(function(){ d.classList.remove("return-above") }, 800);
		items.forEach(object => {
			if(object.aboveGround)
				object.item.classList.remove('stay-above');
		})
		// d.classList.remove("stay-above");

	}	
}